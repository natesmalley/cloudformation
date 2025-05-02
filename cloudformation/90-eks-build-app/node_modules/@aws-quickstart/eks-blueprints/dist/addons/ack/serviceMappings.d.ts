import { PolicyStatement } from "aws-cdk-lib/aws-iam";
/**
 * Chart Mapping for fields such as chart, version, managed IAM policy.
 */
export interface AckChartMapping {
    chart: string;
    version: string;
    managedPolicyName?: string;
    inlinePolicyStatements?: PolicyStatement[];
}
/**
 * List of all supported supported AWS services by ACK Addon.
 */
export declare enum AckServiceName {
    ACM = "acm",
    ACMPCA = "acmpca",
    APIGATEWAYV2 = "apigatewayv2",
    APPLICATIONAUTOSCALING = "applicationautoscaling",
    CLOUDTRAIL = "cloudtrail",
    CLOUDWATCH = "cloudwatch",
    CLOUDWATCHLOGS = "cloudwatchlogs",
    DYNAMODB = "dynamodb",
    EC2 = "ec2",
    ECR = "ecr",
    EKS = "eks",
    ELASTICACHE = "elasticache",
    ELASTICSEARCHSERVICE = "elasticsearchservice",
    EMRCONTAINERS = "emrcontainers",
    EVENTBRIDGE = "eventbridge",
    IAM = "iam",
    KAFKA = "kafka",
    KINESIS = "kinesis",
    KMS = "kms",
    LAMBDA = "lambda",
    MEMORYDB = "memorydb",
    MQ = "mq",
    OPENSEARCHSERVICE = "opensearchservice",
    PIPES = "pipes",
    PROMETHEUSSERVICE = "prometheusservice",
    RDS = "rds",
    ROUTE53 = "route53",
    ROUTE53RESOLVER = "route53resolver",
    S3 = "s3",
    SAGEMAKER = "sagemaker",
    SECRETSMANAGER = "secretsmanager",
    SFN = "sfn",
    SNS = "sns",
    SQS = "sqs"
}
/**
 * List of all Service Mappings such as chart, version, managed IAM policy
 * for all supported AWS services by ACK Addon.
 */
export declare const serviceMappings: {
    [key in AckServiceName]?: AckChartMapping;
};
