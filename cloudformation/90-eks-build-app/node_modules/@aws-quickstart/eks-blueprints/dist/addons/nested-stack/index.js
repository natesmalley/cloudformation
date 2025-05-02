"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedStackAddOn = exports.NestedStackAddOnProps = void 0;
const utils_1 = require("../../utils");
/**
 * Properties for the nested stack add-on.
 */
class NestedStackAddOnProps {
}
exports.NestedStackAddOnProps = NestedStackAddOnProps;
let NestedStackAddOn = class NestedStackAddOn {
    constructor(props) {
        this.props = props;
        this.id = props.id;
    }
    deploy(clusterInfo) {
        const props = this.props;
        const stack = clusterInfo.cluster.stack;
        return Promise.resolve(props.builder.build(stack, props.id, props.nestedStackProps));
    }
};
exports.NestedStackAddOn = NestedStackAddOn;
exports.NestedStackAddOn = NestedStackAddOn = __decorate([
    utils_1.supportsALL
], NestedStackAddOn);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvYWRkb25zL25lc3RlZC1zdGFjay9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFHQSx1Q0FBMEM7QUFFMUM7O0dBRUc7QUFDSCxNQUFhLHFCQUFxQjtDQWVqQztBQWZELHNEQWVDO0FBR00sSUFBTSxnQkFBZ0IsR0FBdEIsTUFBTSxnQkFBZ0I7SUFJekIsWUFBNkIsS0FBNEI7UUFBNUIsVUFBSyxHQUFMLEtBQUssQ0FBdUI7UUFDckQsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxNQUFNLENBQUMsV0FBd0I7UUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN4QyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUN4RixDQUFDO0NBRUosQ0FBQTtBQWRZLDRDQUFnQjsyQkFBaEIsZ0JBQWdCO0lBRDVCLG1CQUFXO0dBQ0MsZ0JBQWdCLENBYzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmVzdGVkU3RhY2tQcm9wcyB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcbmltcG9ydCB7IENsdXN0ZXJBZGRPbiwgQ2x1c3RlckluZm8sIE5lc3RlZFN0YWNrQnVpbGRlciB9IGZyb20gXCIuLi8uLi9zcGlcIjtcbmltcG9ydCB7IHN1cHBvcnRzQUxMIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCI7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgdGhlIG5lc3RlZCBzdGFjayBhZGQtb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBOZXN0ZWRTdGFja0FkZE9uUHJvcHMge1xuICAgIC8qKlxuICAgICAqIFJlcXVpcmVkIGlkZW50aWZpZWQsIG11c3QgYmUgdW5pcXVlIHdpdGhpbiB0aGUgcGFyZW50IHN0YWNrIHNjb3BlLlxuICAgICAqL1xuICAgIGlkOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZGVyIHRoYXQgZ2VuZXJhdGVzIHRoZSBzdGFjay5cbiAgICAgKi9cbiAgICBidWlsZGVyOiBOZXN0ZWRTdGFja0J1aWxkZXI7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25hbCBwcm9wZXJ0aWVzIGZvciB0aGUgbmVzdGVkIHN0YWNrLlxuICAgICAqL1xuICAgIG5lc3RlZFN0YWNrUHJvcHM/OiBOZXN0ZWRTdGFja1Byb3BzO1xufVxuXG5Ac3VwcG9ydHNBTExcbmV4cG9ydCBjbGFzcyBOZXN0ZWRTdGFja0FkZE9uICBpbXBsZW1lbnRzIENsdXN0ZXJBZGRPbiB7XG5cbiAgICByZWFkb25seSBpZD8gOiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBOZXN0ZWRTdGFja0FkZE9uUHJvcHMpIHtcbiAgICAgICAgdGhpcy5pZCA9IHByb3BzLmlkO1xuICAgIH1cblxuICAgIGRlcGxveShjbHVzdGVySW5mbzogQ2x1c3RlckluZm8pOiB2b2lkIHwgUHJvbWlzZTxDb25zdHJ1Y3Q+IHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSB0aGlzLnByb3BzO1xuICAgICAgICBjb25zdCBzdGFjayA9IGNsdXN0ZXJJbmZvLmNsdXN0ZXIuc3RhY2s7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocHJvcHMuYnVpbGRlci5idWlsZChzdGFjaywgcHJvcHMuaWQscHJvcHMubmVzdGVkU3RhY2tQcm9wcykpO1xuICAgIH1cblxufSJdfQ==