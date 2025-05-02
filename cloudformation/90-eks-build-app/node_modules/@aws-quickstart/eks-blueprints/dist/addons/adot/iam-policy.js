"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdotCollectorPolicyDocument = getAdotCollectorPolicyDocument;
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
function getAdotCollectorPolicyDocument() {
    return aws_iam_1.PolicyDocument.fromJson({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "aps:RemoteWrite"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "cloudwatch:PutMetricData",
                    "ec2:DescribeVolumes",
                    "ec2:DescribeTags",
                    "logs:PutLogEvents",
                    "logs:DescribeLogStreams",
                    "logs:DescribeLogGroups",
                    "logs:CreateLogStream",
                    "logs:CreateLogGroup"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "ssm:GetParameter"
                ],
                "Resource": "arn:aws:ssm:*:*:parameter/AmazonCloudWatch-*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "xray:PutTraceSegments",
                    "xray:PutTelemetryRecords",
                    "xray:GetSamplingRules",
                    "xray:GetSamplingTargets",
                    "xray:GetSamplingStatisticSummaries"
                ],
                "Resource": [
                    "*"
                ]
            }
        ]
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWFtLXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9hZGRvbnMvYWRvdC9pYW0tcG9saWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsd0VBK0NDO0FBakRELGlEQUFxRDtBQUVyRCxTQUFnQiw4QkFBOEI7SUFDMUMsT0FBTyx3QkFBYyxDQUFDLFFBQVEsQ0FBQztRQUN2QixTQUFTLEVBQUUsWUFBWTtRQUN2QixXQUFXLEVBQUU7WUFDVDtnQkFDSSxRQUFRLEVBQUUsT0FBTztnQkFDakIsUUFBUSxFQUFFO29CQUNOLGlCQUFpQjtpQkFDcEI7Z0JBQ0QsVUFBVSxFQUFFLEdBQUc7YUFDbEI7WUFDRDtnQkFDSSxRQUFRLEVBQUUsT0FBTztnQkFDakIsUUFBUSxFQUFFO29CQUNOLDBCQUEwQjtvQkFDMUIscUJBQXFCO29CQUNyQixrQkFBa0I7b0JBQ2xCLG1CQUFtQjtvQkFDbkIseUJBQXlCO29CQUN6Qix3QkFBd0I7b0JBQ3hCLHNCQUFzQjtvQkFDdEIscUJBQXFCO2lCQUN4QjtnQkFDRCxVQUFVLEVBQUUsR0FBRzthQUNsQjtZQUNEO2dCQUNJLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixRQUFRLEVBQUU7b0JBQ04sa0JBQWtCO2lCQUNyQjtnQkFDRCxVQUFVLEVBQUUsOENBQThDO2FBQzdEO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLE9BQU87Z0JBQ2pCLFFBQVEsRUFBRTtvQkFDTix1QkFBdUI7b0JBQ3ZCLDBCQUEwQjtvQkFDMUIsdUJBQXVCO29CQUN2Qix5QkFBeUI7b0JBQ3pCLG9DQUFvQztpQkFDdkM7Z0JBQ0QsVUFBVSxFQUFFO29CQUNSLEdBQUc7aUJBQ047YUFDSjtTQUNKO0tBQ1IsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBvbGljeURvY3VtZW50IH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkb3RDb2xsZWN0b3JQb2xpY3lEb2N1bWVudCgpIDogUG9saWN5RG9jdW1lbnQge1xuICAgIHJldHVybiBQb2xpY3lEb2N1bWVudC5mcm9tSnNvbih7XG4gICAgICAgICAgICBcIlZlcnNpb25cIjogXCIyMDEyLTEwLTE3XCIsXG4gICAgICAgICAgICBcIlN0YXRlbWVudFwiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQWN0aW9uXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXBzOlJlbW90ZVdyaXRlXCJcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgXCJSZXNvdXJjZVwiOiBcIipcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiQWN0aW9uXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2xvdWR3YXRjaDpQdXRNZXRyaWNEYXRhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVjMjpEZXNjcmliZVZvbHVtZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZWMyOkRlc2NyaWJlVGFnc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsb2dzOlB1dExvZ0V2ZW50c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsb2dzOkRlc2NyaWJlTG9nU3RyZWFtc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJsb2dzOkRlc2NyaWJlTG9nR3JvdXBzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxvZ3M6Q3JlYXRlTG9nU3RyZWFtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImxvZ3M6Q3JlYXRlTG9nR3JvdXBcIlxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBcIlJlc291cmNlXCI6IFwiKlwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiRWZmZWN0XCI6IFwiQWxsb3dcIixcbiAgICAgICAgICAgICAgICAgICAgXCJBY3Rpb25cIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJzc206R2V0UGFyYW1ldGVyXCJcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgXCJSZXNvdXJjZVwiOiBcImFybjphd3M6c3NtOio6KjpwYXJhbWV0ZXIvQW1hem9uQ2xvdWRXYXRjaC0qXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiLFxuICAgICAgICAgICAgICAgICAgICBcIkFjdGlvblwiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICBcInhyYXk6UHV0VHJhY2VTZWdtZW50c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ4cmF5OlB1dFRlbGVtZXRyeVJlY29yZHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwieHJheTpHZXRTYW1wbGluZ1J1bGVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInhyYXk6R2V0U2FtcGxpbmdUYXJnZXRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInhyYXk6R2V0U2FtcGxpbmdTdGF0aXN0aWNTdW1tYXJpZXNcIlxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBcIlJlc291cmNlXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiKlwiXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgfSk7XG59XG4iXX0=