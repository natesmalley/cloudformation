"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEfsDriverPolicyStatements = getEfsDriverPolicyStatements;
function getEfsDriverPolicyStatements(kmsKeys) {
    const result = [
        {
            "Effect": "Allow",
            "Action": [
                "elasticfilesystem:DescribeAccessPoints",
                "elasticfilesystem:DescribeFileSystems",
                "elasticfilesystem:DescribeMountTargets",
                "ec2:DescribeAvailabilityZones"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "elasticfilesystem:CreateAccessPoint",
                "elasticfilesystem:TagResource",
            ],
            "Resource": "*",
            "Condition": {
                "StringLike": {
                    "aws:RequestTag/efs.csi.aws.com/cluster": "true"
                }
            }
        },
        {
            "Effect": "Allow",
            "Action": "elasticfilesystem:DeleteAccessPoint",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "aws:ResourceTag/efs.csi.aws.com/cluster": "true"
                }
            }
        }
    ];
    if (kmsKeys) {
        const kmsKeysArns = kmsKeys.map((k) => k.keyArn);
        const kmsPolicy = [
            {
                Effect: "Allow",
                Action: ["kms:CreateGrant", "kms:ListGrants", "kms:RevokeGrant"],
                Resource: kmsKeysArns,
                Condition: {
                    Bool: {
                        "kms:GrantIsForAWSResource": "true",
                    },
                },
            },
            {
                Effect: "Allow",
                Action: [
                    "kms:Encrypt",
                    "kms:Decrypt",
                    "kms:ReEncrypt*",
                    "kms:GenerateDataKey*",
                    "kms:DescribeKey",
                ],
                Resource: kmsKeysArns,
            },
        ];
        result.push(...kmsPolicy);
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWFtLXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9hZGRvbnMvZWZzLWNzaS1kcml2ZXIvaWFtLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWFBLG9FQWtFQztBQWxFRCxTQUFnQiw0QkFBNEIsQ0FDMUMsT0FBbUI7SUFFbkIsTUFBTSxNQUFNLEdBQWdCO1FBQzFCO1lBQ0UsUUFBUSxFQUFFLE9BQU87WUFDakIsUUFBUSxFQUFFO2dCQUNSLHdDQUF3QztnQkFDeEMsdUNBQXVDO2dCQUN2Qyx3Q0FBd0M7Z0JBQ3hDLCtCQUErQjthQUNoQztZQUNELFVBQVUsRUFBRSxHQUFHO1NBQ2hCO1FBQ0Q7WUFDRSxRQUFRLEVBQUUsT0FBTztZQUNqQixRQUFRLEVBQUU7Z0JBQ1IscUNBQXFDO2dCQUNyQywrQkFBK0I7YUFDaEM7WUFDRCxVQUFVLEVBQUUsR0FBRztZQUNmLFdBQVcsRUFBRTtnQkFDWCxZQUFZLEVBQUU7b0JBQ1osd0NBQXdDLEVBQUUsTUFBTTtpQkFDakQ7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxRQUFRLEVBQUUsT0FBTztZQUNqQixRQUFRLEVBQUUscUNBQXFDO1lBQy9DLFVBQVUsRUFBRSxHQUFHO1lBQ2YsV0FBVyxFQUFFO2dCQUNYLGNBQWMsRUFBRTtvQkFDZCx5Q0FBeUMsRUFBRSxNQUFNO2lCQUNsRDthQUNGO1NBQ0Y7S0FDRixDQUFDO0lBQ0YsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNaLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxNQUFNLFNBQVMsR0FBZ0I7WUFDN0I7Z0JBQ0UsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsTUFBTSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUM7Z0JBQ2hFLFFBQVEsRUFBRSxXQUFXO2dCQUNyQixTQUFTLEVBQUU7b0JBQ1QsSUFBSSxFQUFFO3dCQUNKLDJCQUEyQixFQUFFLE1BQU07cUJBQ3BDO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxNQUFNLEVBQUUsT0FBTztnQkFDZixNQUFNLEVBQUU7b0JBQ04sYUFBYTtvQkFDYixhQUFhO29CQUNiLGdCQUFnQjtvQkFDaEIsc0JBQXNCO29CQUN0QixpQkFBaUI7aUJBQ2xCO2dCQUNELFFBQVEsRUFBRSxXQUFXO2FBQ3RCO1NBQ0YsQ0FBQztRQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGttcyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWttc1wiO1xuXG5pbnRlcmZhY2UgU3RhdGVtZW50IHtcbiAgRWZmZWN0OiBzdHJpbmc7XG4gIEFjdGlvbjogc3RyaW5nIHwgc3RyaW5nW107XG4gIFJlc291cmNlOiBzdHJpbmcgfCBzdHJpbmdbXTtcbiAgQ29uZGl0aW9uPzoge1xuICAgIFN0cmluZ0VxdWFscz86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nW10gfCBzdHJpbmcgfTtcbiAgICBTdHJpbmdMaWtlPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgICBCb29sPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVmc0RyaXZlclBvbGljeVN0YXRlbWVudHMoXG4gIGttc0tleXM/OiBrbXMuS2V5W11cbik6IFN0YXRlbWVudFtdIHtcbiAgY29uc3QgcmVzdWx0OiBTdGF0ZW1lbnRbXSA9IFtcbiAgICB7XG4gICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCIsXG4gICAgICBcIkFjdGlvblwiOiBbXG4gICAgICAgIFwiZWxhc3RpY2ZpbGVzeXN0ZW06RGVzY3JpYmVBY2Nlc3NQb2ludHNcIixcbiAgICAgICAgXCJlbGFzdGljZmlsZXN5c3RlbTpEZXNjcmliZUZpbGVTeXN0ZW1zXCIsXG4gICAgICAgIFwiZWxhc3RpY2ZpbGVzeXN0ZW06RGVzY3JpYmVNb3VudFRhcmdldHNcIixcbiAgICAgICAgXCJlYzI6RGVzY3JpYmVBdmFpbGFiaWxpdHlab25lc1wiXG4gICAgICBdLFxuICAgICAgXCJSZXNvdXJjZVwiOiBcIipcIlxuICAgIH0sXG4gICAge1xuICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiLFxuICAgICAgXCJBY3Rpb25cIjogW1xuICAgICAgICBcImVsYXN0aWNmaWxlc3lzdGVtOkNyZWF0ZUFjY2Vzc1BvaW50XCIsXG4gICAgICAgIFwiZWxhc3RpY2ZpbGVzeXN0ZW06VGFnUmVzb3VyY2VcIixcbiAgICAgIF0sXG4gICAgICBcIlJlc291cmNlXCI6IFwiKlwiLFxuICAgICAgXCJDb25kaXRpb25cIjoge1xuICAgICAgICBcIlN0cmluZ0xpa2VcIjoge1xuICAgICAgICAgIFwiYXdzOlJlcXVlc3RUYWcvZWZzLmNzaS5hd3MuY29tL2NsdXN0ZXJcIjogXCJ0cnVlXCJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgXCJFZmZlY3RcIjogXCJBbGxvd1wiLFxuICAgICAgXCJBY3Rpb25cIjogXCJlbGFzdGljZmlsZXN5c3RlbTpEZWxldGVBY2Nlc3NQb2ludFwiLFxuICAgICAgXCJSZXNvdXJjZVwiOiBcIipcIixcbiAgICAgIFwiQ29uZGl0aW9uXCI6IHtcbiAgICAgICAgXCJTdHJpbmdFcXVhbHNcIjoge1xuICAgICAgICAgIFwiYXdzOlJlc291cmNlVGFnL2Vmcy5jc2kuYXdzLmNvbS9jbHVzdGVyXCI6IFwidHJ1ZVwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIF07XG4gIGlmIChrbXNLZXlzKSB7XG4gICAgY29uc3Qga21zS2V5c0FybnMgPSBrbXNLZXlzLm1hcCgoaykgPT4gay5rZXlBcm4pO1xuICAgIGNvbnN0IGttc1BvbGljeTogU3RhdGVtZW50W10gPSBbXG4gICAgICB7XG4gICAgICAgIEVmZmVjdDogXCJBbGxvd1wiLFxuICAgICAgICBBY3Rpb246IFtcImttczpDcmVhdGVHcmFudFwiLCBcImttczpMaXN0R3JhbnRzXCIsIFwia21zOlJldm9rZUdyYW50XCJdLFxuICAgICAgICBSZXNvdXJjZToga21zS2V5c0FybnMsXG4gICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgIEJvb2w6IHtcbiAgICAgICAgICAgIFwia21zOkdyYW50SXNGb3JBV1NSZXNvdXJjZVwiOiBcInRydWVcIixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgRWZmZWN0OiBcIkFsbG93XCIsXG4gICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgIFwia21zOkVuY3J5cHRcIixcbiAgICAgICAgICBcImttczpEZWNyeXB0XCIsXG4gICAgICAgICAgXCJrbXM6UmVFbmNyeXB0KlwiLFxuICAgICAgICAgIFwia21zOkdlbmVyYXRlRGF0YUtleSpcIixcbiAgICAgICAgICBcImttczpEZXNjcmliZUtleVwiLFxuICAgICAgICBdLFxuICAgICAgICBSZXNvdXJjZToga21zS2V5c0FybnMsXG4gICAgICB9LFxuICAgIF07XG4gICAgcmVzdWx0LnB1c2goLi4ua21zUG9saWN5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19