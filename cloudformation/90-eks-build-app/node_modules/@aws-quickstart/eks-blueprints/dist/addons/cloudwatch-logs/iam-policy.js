"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCloudWatchLogsPolicyDocument = getCloudWatchLogsPolicyDocument;
function getCloudWatchLogsPolicyDocument() {
    const result = [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:DescribeVolumes",
                "ec2:DescribeTags",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams",
                "logs:DescribeLogGroups",
                "logs:CreateLogStream",
                "logs:CreateLogGroup",
                "logs:PutRetentionPolicy",
                "logs:DeleteRetentionPolicy"
            ],
            "Resource": "*"
        }
    ];
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWFtLXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9hZGRvbnMvY2xvdWR3YXRjaC1sb2dzL2lhbS1wb2xpY3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFNQSwwRUFtQkM7QUFuQkQsU0FBZ0IsK0JBQStCO0lBQzNDLE1BQU0sTUFBTSxHQUFnQjtRQUN4QjtZQUNJLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLFFBQVEsRUFBRTtnQkFDTixxQkFBcUI7Z0JBQ3JCLGtCQUFrQjtnQkFDbEIsbUJBQW1CO2dCQUNuQix5QkFBeUI7Z0JBQ3pCLHdCQUF3QjtnQkFDeEIsc0JBQXNCO2dCQUN0QixxQkFBcUI7Z0JBQ3JCLHlCQUF5QjtnQkFDekIsNEJBQTRCO2FBQy9CO1lBQ0QsVUFBVSxFQUFFLEdBQUc7U0FDbEI7S0FDSixDQUFDO0lBQ0YsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImludGVyZmFjZSBTdGF0ZW1lbnQge1xuICAgIEVmZmVjdDogc3RyaW5nO1xuICAgIEFjdGlvbjogc3RyaW5nIHwgc3RyaW5nW107XG4gICAgUmVzb3VyY2U6IHN0cmluZyB8IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xvdWRXYXRjaExvZ3NQb2xpY3lEb2N1bWVudCgpIDogU3RhdGVtZW50W10ge1xuICAgIGNvbnN0IHJlc3VsdDogU3RhdGVtZW50W10gPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiRWZmZWN0XCI6IFwiQWxsb3dcIixcbiAgICAgICAgICAgIFwiQWN0aW9uXCI6IFtcbiAgICAgICAgICAgICAgICBcImVjMjpEZXNjcmliZVZvbHVtZXNcIixcbiAgICAgICAgICAgICAgICBcImVjMjpEZXNjcmliZVRhZ3NcIixcbiAgICAgICAgICAgICAgICBcImxvZ3M6UHV0TG9nRXZlbnRzXCIsXG4gICAgICAgICAgICAgICAgXCJsb2dzOkRlc2NyaWJlTG9nU3RyZWFtc1wiLFxuICAgICAgICAgICAgICAgIFwibG9nczpEZXNjcmliZUxvZ0dyb3Vwc1wiLFxuICAgICAgICAgICAgICAgIFwibG9nczpDcmVhdGVMb2dTdHJlYW1cIixcbiAgICAgICAgICAgICAgICBcImxvZ3M6Q3JlYXRlTG9nR3JvdXBcIixcbiAgICAgICAgICAgICAgICBcImxvZ3M6UHV0UmV0ZW50aW9uUG9saWN5XCIsXG4gICAgICAgICAgICAgICAgXCJsb2dzOkRlbGV0ZVJldGVudGlvblBvbGljeVwiXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJSZXNvdXJjZVwiOiBcIipcIlxuICAgICAgICB9XG4gICAgXTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuIl19