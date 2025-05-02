"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ebsCollectorPolicy = ebsCollectorPolicy;
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
function ebsCollectorPolicy() {
    return new aws_iam_1.PolicyDocument({
        statements: [
            new aws_iam_1.PolicyStatement({
                actions: [
                    'ec2:DescribeVolumes',
                ],
                resources: ['*']
            })
        ]
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWFtLXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9hZGRvbnMvY2xvdWQtd2F0Y2gtaW5zaWdodHMvaWFtLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGdEQVdDO0FBYkQsaURBQW9FO0FBRXBFLFNBQWdCLGtCQUFrQjtJQUNoQyxPQUFPLElBQUksd0JBQWMsQ0FBQztRQUN4QixVQUFVLEVBQUU7WUFDVixJQUFJLHlCQUFlLENBQUM7Z0JBQ2xCLE9BQU8sRUFBRTtvQkFDUCxxQkFBcUI7aUJBQ3RCO2dCQUNELFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQzthQUNqQixDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtQb2xpY3lEb2N1bWVudCwgUG9saWN5U3RhdGVtZW50fSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZWJzQ29sbGVjdG9yUG9saWN5KCk6IFBvbGljeURvY3VtZW50IHtcbiAgcmV0dXJuIG5ldyBQb2xpY3lEb2N1bWVudCh7XG4gICAgc3RhdGVtZW50czogW1xuICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAnZWMyOkRlc2NyaWJlVm9sdW1lcycsXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogWycqJ11cbiAgICAgIH0pXG4gICAgXVxuICB9KTtcbn1cblxuIl19