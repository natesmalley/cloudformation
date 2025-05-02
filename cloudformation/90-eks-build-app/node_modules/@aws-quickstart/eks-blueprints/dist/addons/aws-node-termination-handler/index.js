"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsNodeTerminationHandlerAddOn = exports.Mode = void 0;
const aws_autoscaling_1 = require("aws-cdk-lib/aws-autoscaling");
const aws_autoscaling_hooktargets_1 = require("aws-cdk-lib/aws-autoscaling-hooktargets");
const aws_events_1 = require("aws-cdk-lib/aws-events");
const aws_events_targets_1 = require("aws-cdk-lib/aws-events-targets");
const iam = require("aws-cdk-lib/aws-iam");
const aws_sqs_1 = require("aws-cdk-lib/aws-sqs");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const assert = require("assert");
const utils_1 = require("../../utils");
const helm_addon_1 = require("../helm-addon");
/**
 * Supported Modes
 */
var Mode;
(function (Mode) {
    /**
     * IMDS Mode
     */
    Mode[Mode["IMDS"] = 0] = "IMDS";
    /**
     * Queue Mode
     */
    Mode[Mode["QUEUE"] = 1] = "QUEUE";
})(Mode || (exports.Mode = Mode = {}));
/**
 * Default options for the add-on
 */
const defaultProps = {
    chart: 'aws-node-termination-handler',
    repository: 'https://aws.github.io/eks-charts',
    version: '0.21.0',
    release: 'blueprints-addon-aws-node-termination-handler',
    name: 'aws-node-termination-handler',
    namespace: 'kube-system',
    mode: Mode.IMDS
};
let AwsNodeTerminationHandlerAddOn = class AwsNodeTerminationHandlerAddOn extends helm_addon_1.HelmAddOn {
    constructor(props) {
        super({ ...defaultProps, ...props });
        this.options = this.props;
    }
    /**
     * Implementation of the deploy interface
     * @param clusterInfo
     */
    deploy(clusterInfo) {
        const cluster = clusterInfo.cluster;
        const asgCapacity = clusterInfo.autoscalingGroups || [];
        const karpenter = clusterInfo.getScheduledAddOn('KarpenterAddOn');
        if (!karpenter) {
            // No support for Fargate and Managed Node Groups, lets catch that
            assert(asgCapacity && asgCapacity.length > 0, 'AWS Node Termination Handler is only supported for self-managed nodes');
        }
        // Create an SQS Queue
        let helmValues;
        // Create Service Account
        const serviceAccount = cluster.addServiceAccount('aws-nth-sa', {
            name: 'aws-node-termination-handler-sa',
            namespace: this.options.namespace,
        });
        // Get the appropriate Helm Values depending upon the Mode selected
        if (this.options.mode === Mode.IMDS) {
            helmValues = this.configureImdsMode(serviceAccount, karpenter);
        }
        else {
            helmValues = this.configureQueueMode(cluster, serviceAccount, asgCapacity, karpenter);
        }
        // Deploy the helm chart
        const awsNodeTerminationHandlerChart = this.addHelmChart(clusterInfo, helmValues);
        awsNodeTerminationHandlerChart.node.addDependency(serviceAccount);
    }
    /**
     * Configures IMDS Mode
     * @param serviceAccount
     * @returns Helm values
     */
    configureImdsMode(serviceAccount, karpenter) {
        return {
            enableSpotInterruptionDraining: true,
            enableRebalanceMonitoring: true,
            enableRebalanceDraining: karpenter ? true : false,
            enableScheduledEventDraining: true,
            nodeSelector: karpenter ? { 'karpenter.sh/capacity-type': 'spot' } : {},
            serviceAccount: {
                create: false,
                name: serviceAccount.serviceAccountName,
            }
        };
    }
    /**
     * Configures Queue Mode
     * @param cluster
     * @param serviceAccount
     * @param asgCapacity
     * @returns Helm values
     */
    configureQueueMode(cluster, serviceAccount, asgCapacity, karpenter) {
        const queue = new aws_sqs_1.Queue(cluster.stack, "aws-nth-queue", {
            retentionPeriod: aws_cdk_lib_1.Duration.minutes(5)
        });
        queue.addToResourcePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            principals: [
                new iam.ServicePrincipal('events.amazonaws.com'),
                new iam.ServicePrincipal('sqs.amazonaws.com'),
            ],
            actions: ['sqs:SendMessage'],
            resources: [queue.queueArn]
        }));
        const resources = [];
        // This does not apply if you leverage Karpenter (which uses NTH for Spot/Fargate)
        if (!karpenter) {
            for (let i = 0; i < asgCapacity.length; i++) {
                const nodeGroup = asgCapacity[i];
                // Setup a Termination Lifecycle Hook on an ASG
                new aws_autoscaling_1.LifecycleHook(cluster.stack, `aws-${nodeGroup.autoScalingGroupName}-nth-lifecycle-hook`, {
                    lifecycleTransition: aws_autoscaling_1.LifecycleTransition.INSTANCE_TERMINATING,
                    heartbeatTimeout: aws_cdk_lib_1.Duration.minutes(5), // based on https://github.com/aws/aws-node-termination-handler docs
                    notificationTarget: new aws_autoscaling_hooktargets_1.QueueHook(queue),
                    autoScalingGroup: nodeGroup
                });
                // Tag the ASG
                const tags = [{
                        Key: 'aws-node-termination-handler/managed',
                        Value: 'true'
                    }];
                (0, utils_1.tagAsg)(cluster.stack, nodeGroup.autoScalingGroupName, tags);
                resources.push(nodeGroup.autoScalingGroupArn);
            }
        }
        // Create Amazon EventBridge Rules
        this.createEvents(cluster.stack, queue, karpenter);
        // Service Account Policy
        serviceAccount.addToPrincipalPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
                'autoscaling:CompleteLifecycleAction',
                'autoscaling:DescribeAutoScalingInstances',
                'autoscaling:DescribeTags'
            ],
            resources: karpenter ? ['*'] : resources
        }));
        serviceAccount.addToPrincipalPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['ec2:DescribeInstances'],
            resources: ['*']
        }));
        queue.grantConsumeMessages(serviceAccount);
        return {
            enableSqsTerminationDraining: true,
            queueURL: queue.queueUrl,
            awsRegion: karpenter ? cluster.stack.region : '',
            serviceAccount: {
                create: false,
                name: serviceAccount.serviceAccountName,
            },
            checkASGTagBeforeDraining: karpenter ? false : true,
            enableSpotInterruptionDraining: karpenter ? true : false,
        };
    }
    /**
     * Create EventBridge rules with target as SQS queue
     * @param scope
     * @param queue
     */
    createEvents(scope, queue, karpenter) {
        const target = new aws_events_targets_1.SqsQueue(queue);
        const eventPatterns = [
            {
                source: ['aws.ec2'],
                detailType: ['EC2 Spot Instance Interruption Warning']
            },
            {
                source: ['aws.ec2'],
                detailType: ['EC2 Instance Rebalance Recommendation']
            },
            {
                source: ['aws.ec2'],
                detailType: ['EC2 Instance State-change Notification']
            },
            {
                source: ['aws.health'],
                detailType: ['AWS Health Event'],
            }
        ];
        if (!karpenter) {
            eventPatterns.push({
                source: ['aws.autoscaling'],
                detailType: ['EC2 Instance-terminate Lifecycle Action']
            });
        }
        eventPatterns.forEach((event, index) => {
            const rule = new aws_events_1.Rule(scope, `rule-${index}`, { eventPattern: event });
            rule.addTarget(target);
        });
    }
};
exports.AwsNodeTerminationHandlerAddOn = AwsNodeTerminationHandlerAddOn;
exports.AwsNodeTerminationHandlerAddOn = AwsNodeTerminationHandlerAddOn = __decorate([
    utils_1.supportsX86
], AwsNodeTerminationHandlerAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL2F3cy1ub2RlLXRlcm1pbmF0aW9uLWhhbmRsZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUVBQW1HO0FBQ25HLHlGQUFvRTtBQUVwRSx1REFBNEQ7QUFDNUQsdUVBQTBEO0FBQzFELDJDQUEyQztBQUMzQyxpREFBNEM7QUFDNUMsNkNBQXVDO0FBRXZDLGlDQUFpQztBQUVqQyx1Q0FBa0Q7QUFDbEQsOENBQThEO0FBRTlEOztHQUVHO0FBQ0gsSUFBWSxJQVVYO0FBVkQsV0FBWSxJQUFJO0lBQ2Q7O09BRUc7SUFDSCwrQkFBSSxDQUFBO0lBRUo7O09BRUc7SUFDSCxpQ0FBSyxDQUFBO0FBQ1AsQ0FBQyxFQVZXLElBQUksb0JBQUosSUFBSSxRQVVmO0FBYUQ7O0dBRUc7QUFDSCxNQUFNLFlBQVksR0FBbUM7SUFDbkQsS0FBSyxFQUFFLDhCQUE4QjtJQUNyQyxVQUFVLEVBQUUsa0NBQWtDO0lBQzlDLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLE9BQU8sRUFBRSwrQ0FBK0M7SUFDeEQsSUFBSSxFQUFFLDhCQUE4QjtJQUNwQyxTQUFTLEVBQUUsYUFBYTtJQUN4QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Q0FDaEIsQ0FBQztBQUdLLElBQU0sOEJBQThCLEdBQXBDLE1BQU0sOEJBQStCLFNBQVEsc0JBQVM7SUFJM0QsWUFBWSxLQUFzQztRQUNoRCxLQUFLLENBQUMsRUFBRSxHQUFHLFlBQW1CLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUM1QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLFdBQXdCO1FBQzdCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUM7UUFDcEMsTUFBTSxXQUFXLEdBQUcsV0FB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QUFDO2FBQ3REO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNuQixVQUFVLEVBQUUsQ0FBQyx3Q0FBd0MsQ0FBQzthQUN2RDtZQUNEO2dCQUNFLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDdEIsVUFBVSxFQUFFLENBQUMsa0JBQWtCLENBQUM7YUFDakM7U0FDRixDQUFDO1FBRUYsSUFBSSxDQUFDLFNBQVMsRUFBQyxDQUFDO1lBQ2QsYUFBYSxDQUFDLElBQUksQ0FDaEI7Z0JBQ0UsTUFBTSxFQUFFLENBQUMsaUJBQWlCLENBQUM7Z0JBQzNCLFVBQVUsRUFBRSxDQUFDLHlDQUF5QyxDQUFDO2FBQ3hELENBQ0YsQ0FBQztRQUNKLENBQUM7UUFFRCxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksaUJBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxLQUFLLEVBQUUsRUFBRSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQTtBQXZMWSx3RUFBOEI7eUNBQTlCLDhCQUE4QjtJQUQxQyxtQkFBVztHQUNDLDhCQUE4QixDQXVMMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdXRvU2NhbGluZ0dyb3VwLCBMaWZlY3ljbGVIb29rLCBMaWZlY3ljbGVUcmFuc2l0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWF1dG9zY2FsaW5nJztcbmltcG9ydCB7IFF1ZXVlSG9vayB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hdXRvc2NhbGluZy1ob29rdGFyZ2V0cyc7XG5pbXBvcnQgeyBJQ2x1c3RlciwgU2VydmljZUFjY291bnQgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWtzJztcbmltcG9ydCB7IEV2ZW50UGF0dGVybiwgUnVsZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1ldmVudHMnO1xuaW1wb3J0IHsgU3FzUXVldWUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZXZlbnRzLXRhcmdldHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgUXVldWUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3FzJztcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCAqIGFzIGFzc2VydCBmcm9tIFwiYXNzZXJ0XCI7XG5pbXBvcnQgeyBDbHVzdGVySW5mbyB9IGZyb20gJy4uLy4uL3NwaSc7XG5pbXBvcnQgeyBzdXBwb3J0c1g4NiwgdGFnQXNnIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgSGVsbUFkZE9uLCBIZWxtQWRkT25Vc2VyUHJvcHMgfSBmcm9tICcuLi9oZWxtLWFkZG9uJztcblxuLyoqXG4gKiBTdXBwb3J0ZWQgTW9kZXNcbiAqL1xuZXhwb3J0IGVudW0gTW9kZSB7XG4gIC8qKlxuICAgKiBJTURTIE1vZGVcbiAgICovXG4gIElNRFMsXG5cbiAgLyoqXG4gICAqIFF1ZXVlIE1vZGVcbiAgICovXG4gIFFVRVVFXG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgdGhlIGFkZC1vblxuICovXG5leHBvcnQgaW50ZXJmYWNlIEF3c05vZGVUZXJtaW5hdGlvbkhhbmRsZXJQcm9wcyBleHRlbmRzIEhlbG1BZGRPblVzZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBTdXBwb3J0ZWQgTW9kZXMgYXJlIE1vZGUuSU1EUyBhbmQgTW9kZS5RVUVVRVxuICAgKiBAZGVmYXVsdCBNb2RlLklNRFNcbiAgICovXG4gIG1vZGU/OiBNb2RlXG59XG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgYWRkLW9uXG4gKi9cbmNvbnN0IGRlZmF1bHRQcm9wczogQXdzTm9kZVRlcm1pbmF0aW9uSGFuZGxlclByb3BzID0ge1xuICBjaGFydDogJ2F3cy1ub2RlLXRlcm1pbmF0aW9uLWhhbmRsZXInLFxuICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9hd3MuZ2l0aHViLmlvL2Vrcy1jaGFydHMnLFxuICB2ZXJzaW9uOiAnMC4yMS4wJyxcbiAgcmVsZWFzZTogJ2JsdWVwcmludHMtYWRkb24tYXdzLW5vZGUtdGVybWluYXRpb24taGFuZGxlcicsXG4gIG5hbWU6ICdhd3Mtbm9kZS10ZXJtaW5hdGlvbi1oYW5kbGVyJyxcbiAgbmFtZXNwYWNlOiAna3ViZS1zeXN0ZW0nLFxuICBtb2RlOiBNb2RlLklNRFNcbn07XG5cbkBzdXBwb3J0c1g4NlxuZXhwb3J0IGNsYXNzIEF3c05vZGVUZXJtaW5hdGlvbkhhbmRsZXJBZGRPbiBleHRlbmRzIEhlbG1BZGRPbiB7XG5cbiAgcHJpdmF0ZSBvcHRpb25zOiBBd3NOb2RlVGVybWluYXRpb25IYW5kbGVyUHJvcHM7XG5cbiAgY29uc3RydWN0b3IocHJvcHM/OiBBd3NOb2RlVGVybWluYXRpb25IYW5kbGVyUHJvcHMpIHtcbiAgICBzdXBlcih7IC4uLmRlZmF1bHRQcm9wcyBhcyBhbnksIC4uLnByb3BzIH0pO1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMucHJvcHM7XG4gIH1cblxuICAvKipcbiAgICogSW1wbGVtZW50YXRpb24gb2YgdGhlIGRlcGxveSBpbnRlcmZhY2VcbiAgICogQHBhcmFtIGNsdXN0ZXJJbmZvIFxuICAgKi9cbiAgZGVwbG95KGNsdXN0ZXJJbmZvOiBDbHVzdGVySW5mbyk6IHZvaWQge1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBjbHVzdGVySW5mby5jbHVzdGVyOyAgICBcbiAgICBjb25zdCBhc2dDYXBhY2l0eSA9IGNsdXN0ZXJJbmZvLmF1dG9zY2FsaW5nR3JvdXBzIHx8IFtdO1xuXG4gICAgY29uc3Qga2FycGVudGVyID0gY2x1c3RlckluZm8uZ2V0U2NoZWR1bGVkQWRkT24oJ0thcnBlbnRlckFkZE9uJyk7XG4gICAgaWYgKCFrYXJwZW50ZXIpe1xuICAgICAgLy8gTm8gc3VwcG9ydCBmb3IgRmFyZ2F0ZSBhbmQgTWFuYWdlZCBOb2RlIEdyb3VwcywgbGV0cyBjYXRjaCB0aGF0XG4gICAgICBhc3NlcnQoYXNnQ2FwYWNpdHkgJiYgYXNnQ2FwYWNpdHkubGVuZ3RoID4gMCwgJ0FXUyBOb2RlIFRlcm1pbmF0aW9uIEhhbmRsZXIgaXMgb25seSBzdXBwb3J0ZWQgZm9yIHNlbGYtbWFuYWdlZCBub2RlcycpO1xuICAgIH0gICAgXG5cbiAgICAvLyBDcmVhdGUgYW4gU1FTIFF1ZXVlXG4gICAgbGV0IGhlbG1WYWx1ZXM6IGFueTtcblxuICAgIC8vIENyZWF0ZSBTZXJ2aWNlIEFjY291bnRcbiAgICBjb25zdCBzZXJ2aWNlQWNjb3VudCA9IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ2F3cy1udGgtc2EnLCB7XG4gICAgICAgIG5hbWU6ICdhd3Mtbm9kZS10ZXJtaW5hdGlvbi1oYW5kbGVyLXNhJyxcbiAgICAgICAgbmFtZXNwYWNlOiB0aGlzLm9wdGlvbnMubmFtZXNwYWNlLFxuICAgIH0pO1xuXG4gICAgLy8gR2V0IHRoZSBhcHByb3ByaWF0ZSBIZWxtIFZhbHVlcyBkZXBlbmRpbmcgdXBvbiB0aGUgTW9kZSBzZWxlY3RlZFxuICAgIGlmICh0aGlzLm9wdGlvbnMubW9kZSA9PT0gTW9kZS5JTURTKSB7XG4gICAgICAgIGhlbG1WYWx1ZXMgPSB0aGlzLmNvbmZpZ3VyZUltZHNNb2RlKHNlcnZpY2VBY2NvdW50LCBrYXJwZW50ZXIpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaGVsbVZhbHVlcyA9IHRoaXMuY29uZmlndXJlUXVldWVNb2RlKGNsdXN0ZXIsIHNlcnZpY2VBY2NvdW50LCBhc2dDYXBhY2l0eSwga2FycGVudGVyKTtcbiAgICB9XG4gICAgXG4gICAgLy8gRGVwbG95IHRoZSBoZWxtIGNoYXJ0XG4gICAgY29uc3QgYXdzTm9kZVRlcm1pbmF0aW9uSGFuZGxlckNoYXJ0ID0gdGhpcy5hZGRIZWxtQ2hhcnQoY2x1c3RlckluZm8sIGhlbG1WYWx1ZXMpO1xuICAgIGF3c05vZGVUZXJtaW5hdGlvbkhhbmRsZXJDaGFydC5ub2RlLmFkZERlcGVuZGVuY3koc2VydmljZUFjY291bnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgSU1EUyBNb2RlXG4gICAqIEBwYXJhbSBzZXJ2aWNlQWNjb3VudCBcbiAgICogQHJldHVybnMgSGVsbSB2YWx1ZXNcbiAgICovXG4gICAgcHJpdmF0ZSBjb25maWd1cmVJbWRzTW9kZShzZXJ2aWNlQWNjb3VudDogU2VydmljZUFjY291bnQsIGthcnBlbnRlcjogUHJvbWlzZTxDb25zdHJ1Y3Q+IHwgdW5kZWZpbmVkKTogYW55IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVuYWJsZVNwb3RJbnRlcnJ1cHRpb25EcmFpbmluZzogdHJ1ZSxcbiAgICAgICAgICAgIGVuYWJsZVJlYmFsYW5jZU1vbml0b3Jpbmc6IHRydWUsXG4gICAgICAgICAgICBlbmFibGVSZWJhbGFuY2VEcmFpbmluZzoga2FycGVudGVyID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgZW5hYmxlU2NoZWR1bGVkRXZlbnREcmFpbmluZzogdHJ1ZSxcbiAgICAgICAgICAgIG5vZGVTZWxlY3Rvcjoga2FycGVudGVyID8geydrYXJwZW50ZXIuc2gvY2FwYWNpdHktdHlwZSc6ICdzcG90J30gOiB7fSxcbiAgICAgICAgICAgIHNlcnZpY2VBY2NvdW50OiB7XG4gICAgICAgICAgICAgICAgY3JlYXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBuYW1lOiBzZXJ2aWNlQWNjb3VudC5zZXJ2aWNlQWNjb3VudE5hbWUsXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIFF1ZXVlIE1vZGVcbiAgICogQHBhcmFtIGNsdXN0ZXJcbiAgICogQHBhcmFtIHNlcnZpY2VBY2NvdW50XG4gICAqIEBwYXJhbSBhc2dDYXBhY2l0eVxuICAgKiBAcmV0dXJucyBIZWxtIHZhbHVlc1xuICAgKi9cbiAgICBwcml2YXRlIGNvbmZpZ3VyZVF1ZXVlTW9kZShjbHVzdGVyOiBJQ2x1c3Rlciwgc2VydmljZUFjY291bnQ6IFNlcnZpY2VBY2NvdW50LCBhc2dDYXBhY2l0eTogQXV0b1NjYWxpbmdHcm91cFtdLCBrYXJwZW50ZXI6IFByb21pc2U8Q29uc3RydWN0PiB8IHVuZGVmaW5lZCk6IGFueSB7XG4gICAgICAgIGNvbnN0IHF1ZXVlID0gbmV3IFF1ZXVlKGNsdXN0ZXIuc3RhY2ssIFwiYXdzLW50aC1xdWV1ZVwiLCB7XG4gICAgICAgICAgICByZXRlbnRpb25QZXJpb2Q6IER1cmF0aW9uLm1pbnV0ZXMoNSlcbiAgICAgICAgfSk7XG4gICAgICAgIHF1ZXVlLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgcHJpbmNpcGFsczogW1xuICAgICAgICAgICAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZXZlbnRzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgICAgICAgICBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3Nxcy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgYWN0aW9uczogWydzcXM6U2VuZE1lc3NhZ2UnXSxcbiAgICAgICAgICAgIHJlc291cmNlczogW3F1ZXVlLnF1ZXVlQXJuXVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgY29uc3QgcmVzb3VyY2VzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIC8vIFRoaXMgZG9lcyBub3QgYXBwbHkgaWYgeW91IGxldmVyYWdlIEthcnBlbnRlciAod2hpY2ggdXNlcyBOVEggZm9yIFNwb3QvRmFyZ2F0ZSlcbiAgICAgICAgaWYgKCFrYXJwZW50ZXIpe1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXNnQ2FwYWNpdHkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3Qgbm9kZUdyb3VwID0gYXNnQ2FwYWNpdHlbaV07XG4gICAgICAgICAgICAgIC8vIFNldHVwIGEgVGVybWluYXRpb24gTGlmZWN5Y2xlIEhvb2sgb24gYW4gQVNHXG4gICAgICAgICAgICAgIG5ldyBMaWZlY3ljbGVIb29rKGNsdXN0ZXIuc3RhY2ssIGBhd3MtJHtub2RlR3JvdXAuYXV0b1NjYWxpbmdHcm91cE5hbWV9LW50aC1saWZlY3ljbGUtaG9va2AsIHtcbiAgICAgICAgICAgICAgICAgIGxpZmVjeWNsZVRyYW5zaXRpb246IExpZmVjeWNsZVRyYW5zaXRpb24uSU5TVEFOQ0VfVEVSTUlOQVRJTkcsXG4gICAgICAgICAgICAgICAgICBoZWFydGJlYXRUaW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDUpLCAvLyBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1ub2RlLXRlcm1pbmF0aW9uLWhhbmRsZXIgZG9jc1xuICAgICAgICAgICAgICAgICAgbm90aWZpY2F0aW9uVGFyZ2V0OiBuZXcgUXVldWVIb29rKHF1ZXVlKSxcbiAgICAgICAgICAgICAgICAgIGF1dG9TY2FsaW5nR3JvdXA6IG5vZGVHcm91cFxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAvLyBUYWcgdGhlIEFTR1xuICAgICAgICAgICAgICBjb25zdCB0YWdzID0gW3tcbiAgICAgICAgICAgICAgICAgIEtleTogJ2F3cy1ub2RlLXRlcm1pbmF0aW9uLWhhbmRsZXIvbWFuYWdlZCcsXG4gICAgICAgICAgICAgICAgICBWYWx1ZTogJ3RydWUnXG4gICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgICB0YWdBc2coY2x1c3Rlci5zdGFjaywgbm9kZUdyb3VwLmF1dG9TY2FsaW5nR3JvdXBOYW1lLCB0YWdzKTtcbiAgICAgICAgICAgICAgcmVzb3VyY2VzLnB1c2gobm9kZUdyb3VwLmF1dG9TY2FsaW5nR3JvdXBBcm4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBBbWF6b24gRXZlbnRCcmlkZ2UgUnVsZXNcbiAgICAgICAgdGhpcy5jcmVhdGVFdmVudHMoY2x1c3Rlci5zdGFjaywgcXVldWUsIGthcnBlbnRlcik7XG5cbiAgICAgICAgLy8gU2VydmljZSBBY2NvdW50IFBvbGljeVxuICAgICAgICBzZXJ2aWNlQWNjb3VudC5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgICAgJ2F1dG9zY2FsaW5nOkNvbXBsZXRlTGlmZWN5Y2xlQWN0aW9uJyxcbiAgICAgICAgICAgICAgICAnYXV0b3NjYWxpbmc6RGVzY3JpYmVBdXRvU2NhbGluZ0luc3RhbmNlcycsXG4gICAgICAgICAgICAgICAgJ2F1dG9zY2FsaW5nOkRlc2NyaWJlVGFncydcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IGthcnBlbnRlciA/IFsnKiddIDogcmVzb3VyY2VzXG4gICAgICAgIH0pKTtcblxuICAgICAgICBzZXJ2aWNlQWNjb3VudC5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICBhY3Rpb25zOiBbJ2VjMjpEZXNjcmliZUluc3RhbmNlcyddLFxuICAgICAgICAgICAgcmVzb3VyY2VzOiBbJyonXVxuICAgICAgICB9KSk7XG4gICAgICAgIHF1ZXVlLmdyYW50Q29uc3VtZU1lc3NhZ2VzKHNlcnZpY2VBY2NvdW50KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZW5hYmxlU3FzVGVybWluYXRpb25EcmFpbmluZzogdHJ1ZSxcbiAgICAgICAgICAgIHF1ZXVlVVJMOiBxdWV1ZS5xdWV1ZVVybCxcbiAgICAgICAgICAgIGF3c1JlZ2lvbjoga2FycGVudGVyID8gY2x1c3Rlci5zdGFjay5yZWdpb246ICcnLFxuICAgICAgICAgICAgc2VydmljZUFjY291bnQ6IHtcbiAgICAgICAgICAgICAgICBjcmVhdGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIG5hbWU6IHNlcnZpY2VBY2NvdW50LnNlcnZpY2VBY2NvdW50TmFtZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGVja0FTR1RhZ0JlZm9yZURyYWluaW5nOiBrYXJwZW50ZXIgPyBmYWxzZSA6IHRydWUsXG4gICAgICAgICAgICBlbmFibGVTcG90SW50ZXJydXB0aW9uRHJhaW5pbmc6IGthcnBlbnRlciA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBFdmVudEJyaWRnZSBydWxlcyB3aXRoIHRhcmdldCBhcyBTUVMgcXVldWVcbiAgICogQHBhcmFtIHNjb3BlIFxuICAgKiBAcGFyYW0gcXVldWUgXG4gICAqL1xuICBwcml2YXRlIGNyZWF0ZUV2ZW50cyhzY29wZTogQ29uc3RydWN0LCBxdWV1ZTogUXVldWUsIGthcnBlbnRlcjogUHJvbWlzZTxDb25zdHJ1Y3Q+IHwgdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgY29uc3QgdGFyZ2V0ID0gbmV3IFNxc1F1ZXVlKHF1ZXVlKTtcbiAgICBjb25zdCBldmVudFBhdHRlcm5zOiBFdmVudFBhdHRlcm5bXSA9IFtcbiAgICAgIHtcbiAgICAgICAgc291cmNlOiBbJ2F3cy5lYzInXSxcbiAgICAgICAgZGV0YWlsVHlwZTogWydFQzIgU3BvdCBJbnN0YW5jZSBJbnRlcnJ1cHRpb24gV2FybmluZyddXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzb3VyY2U6IFsnYXdzLmVjMiddLFxuICAgICAgICBkZXRhaWxUeXBlOiBbJ0VDMiBJbnN0YW5jZSBSZWJhbGFuY2UgUmVjb21tZW5kYXRpb24nXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc291cmNlOiBbJ2F3cy5lYzInXSxcbiAgICAgICAgZGV0YWlsVHlwZTogWydFQzIgSW5zdGFuY2UgU3RhdGUtY2hhbmdlIE5vdGlmaWNhdGlvbiddXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBzb3VyY2U6IFsnYXdzLmhlYWx0aCddLFxuICAgICAgICBkZXRhaWxUeXBlOiBbJ0FXUyBIZWFsdGggRXZlbnQnXSxcbiAgICAgIH1cbiAgICBdO1xuXG4gICAgaWYgKCFrYXJwZW50ZXIpe1xuICAgICAgZXZlbnRQYXR0ZXJucy5wdXNoKFxuICAgICAgICB7XG4gICAgICAgICAgc291cmNlOiBbJ2F3cy5hdXRvc2NhbGluZyddLFxuICAgICAgICAgIGRldGFpbFR5cGU6IFsnRUMyIEluc3RhbmNlLXRlcm1pbmF0ZSBMaWZlY3ljbGUgQWN0aW9uJ11cbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZXZlbnRQYXR0ZXJucy5mb3JFYWNoKChldmVudCwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShzY29wZSwgYHJ1bGUtJHtpbmRleH1gLCB7IGV2ZW50UGF0dGVybjogZXZlbnQgfSk7XG4gICAgICBydWxlLmFkZFRhcmdldCh0YXJnZXQpO1xuICAgIH0pO1xuICB9XG59Il19