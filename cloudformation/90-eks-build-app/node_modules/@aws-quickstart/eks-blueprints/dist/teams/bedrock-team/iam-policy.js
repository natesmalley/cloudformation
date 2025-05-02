"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBedrockPolicyDocument = getBedrockPolicyDocument;
function getBedrockPolicyDocument() {
    const result = [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:*",
            ],
            "Resource": "*"
        }
    ];
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWFtLXBvbGljeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi90ZWFtcy9iZWRyb2NrLXRlYW0vaWFtLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU1BLDREQVdDO0FBWEQsU0FBZ0Isd0JBQXdCO0lBQ3BDLE1BQU0sTUFBTSxHQUFnQjtRQUN4QjtZQUNJLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLFFBQVEsRUFBRTtnQkFDTixXQUFXO2FBQ2Q7WUFDRCxVQUFVLEVBQUUsR0FBRztTQUNsQjtLQUNKLENBQUM7SUFDRixPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW50ZXJmYWNlIFN0YXRlbWVudCB7XG4gICAgRWZmZWN0OiBzdHJpbmc7XG4gICAgQWN0aW9uOiBzdHJpbmcgfCBzdHJpbmdbXTtcbiAgICBSZXNvdXJjZTogc3RyaW5nIHwgc3RyaW5nW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCZWRyb2NrUG9saWN5RG9jdW1lbnQoKSA6IFN0YXRlbWVudFtdIHtcbiAgICBjb25zdCByZXN1bHQ6IFN0YXRlbWVudFtdID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCIsXG4gICAgICAgICAgICBcIkFjdGlvblwiOiBbXG4gICAgICAgICAgICAgICAgXCJiZWRyb2NrOipcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIlJlc291cmNlXCI6IFwiKlwiXG4gICAgICAgIH1cbiAgICBdO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG4iXX0=