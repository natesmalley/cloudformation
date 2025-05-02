"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternetHostStringConstraint = exports.CompositeConstraint = exports.GenericRegexStringConstraint = exports.ArrayConstraint = exports.NumberConstraint = exports.UrlStringConstraint = exports.StringConstraint = void 0;
exports.validateConstraints = validateConstraints;
const zod_1 = require("zod");
/**
 * This validates if the given string (value) is within the bounds of min to max inclusive. If not a detailed Zod Error is thrown also utilizing the identifier for context.
 */
class StringConstraint {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    validate(key, value, identifier) {
        var _a, _b;
        if (value != undefined)
            zod_1.z.string()
                .min((_a = this.min) !== null && _a !== void 0 ? _a : 0, { message: `${key} (${identifier}: ${value}) must be no less than ${this.min} characters long.` })
                .max((_b = this.max) !== null && _b !== void 0 ? _b : 63, { message: `${key} (${identifier}: ${value}) must be no more than ${this.max} characters long.` })
                .parse(value);
    }
}
exports.StringConstraint = StringConstraint;
/**
 * This is the same as StringConstraint, but also checks if the given string is a correctly formatted URL. If not a detailed Zod Error is thrown also utilizing the identifier for context.
 */
class UrlStringConstraint {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    validate(key, value, identifier) {
        var _a, _b;
        if (value != undefined) {
            zod_1.z.string().url({ message: `${key} (${identifier}: ${value}) must be a URL formatted correctly.` }).parse(value);
            zod_1.z.string()
                .min((_a = this.min) !== null && _a !== void 0 ? _a : 0, { message: `${key} (${identifier}: ${value}) must be a URL no less than ${this.min} characters long.` })
                .max((_b = this.max) !== null && _b !== void 0 ? _b : 100, { message: `${key} (${identifier}: ${value}) must be a URL no more than ${this.max} characters long.` })
                .parse(value);
        }
    }
}
exports.UrlStringConstraint = UrlStringConstraint;
/**
 * This class checks if the given number (value) is within the bounds of the given min and max inclusive number bounds. If not a detailed Zod Error is thrown also utilizing the identifier for context.
 */
class NumberConstraint {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    validate(key, value, identifier) {
        var _a, _b;
        if (value != undefined)
            zod_1.z.number()
                .gte((_a = this.min) !== null && _a !== void 0 ? _a : 1, { message: `${key} (${identifier}: ${value}) must be no less than ${this.min} nodes.` })
                .lte((_b = this.max) !== null && _b !== void 0 ? _b : 3, { message: `${key} (${identifier}: ${value}) must be no more than ${this.max} nodes.` })
                .parse(value);
    }
}
exports.NumberConstraint = NumberConstraint;
/**
 * This works just like NumberConstraint but checks the length of the given value for an expected array. If not a detailed Zod Error is thrown also utilizing the identifier for context.
 */
class ArrayConstraint {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    validate(key, value, identifier) {
        var _a, _b;
        if (value != undefined)
            zod_1.z.number()
                .gte((_a = this.min) !== null && _a !== void 0 ? _a : 1, { message: `${key} (${identifier} of length: ${value.length}) must be no less than ${this.min} node groups.` })
                .lte((_b = this.max) !== null && _b !== void 0 ? _b : 3, { message: `${key} (${identifier} of length: ${value.length}) must be no more than ${this.max} node groups.` })
                .parse(value.length);
    }
}
exports.ArrayConstraint = ArrayConstraint;
/**
 * Checks whether a given string matches the regex.  If not, a detailed Zod Error is thrown.
 */
class GenericRegexStringConstraint {
    constructor(regex) {
        this.regex = regex;
    }
    validate(key, value, identifier) {
        var _a;
        if (value != undefined)
            zod_1.z.string()
                .regex((_a = this.regex) !== null && _a !== void 0 ? _a : new RegExp('.*'), { message: `${key} (${identifier}) must match regular expression ${this.regex}.` })
                .parse(value);
    }
}
exports.GenericRegexStringConstraint = GenericRegexStringConstraint;
/**
 * Contains a list of constraints and checks whether a given value meets each constraint.  If not, a detailed Zod Error is thrown for that constraint.
 */
class CompositeConstraint {
    constructor(...constraints) {
        this.constraints = constraints;
    }
    validate(key, value, identifier) {
        this.constraints.forEach(constraint => {
            constraint.validate(key, value, identifier);
        });
    }
}
exports.CompositeConstraint = CompositeConstraint;
/**
 * Checks whether a given string matches the regex for RFC 1123.  If not, a detailed Zod Error is thrown.
 */
class InternetHostStringConstraint extends CompositeConstraint {
    constructor() {
        super(new GenericRegexStringConstraint(new RegExp('^(?![0-9]+$)(?!.*-$)(?!-)[a-zA-Z0-9-]*$')), new StringConstraint(1, 63));
    }
}
exports.InternetHostStringConstraint = InternetHostStringConstraint;
/**
 * This function validates the given object by the given constraints, and returns an error that uses the given context if needed.
 * @param constraints This is the keys of the object with specified values for validation.
 * @param context Object type name for error context purposes.
 * @param object The given object type, an array of or only a single object, to be validated.
 * @returns throws a Zod Error if validations are broken.
 */
function validateConstraints(constraints, context, ...object) {
    if (object != undefined)
        for (let i = 0; i < object.length; i++) {
            for (let k in constraints) {
                const constraint = constraints[k];
                constraint.validate(context + "." + k, object[i][k], k);
            }
        }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RyYWludHMtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvdXRpbHMvY29uc3RyYWludHMtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBMElBLGtEQVNDO0FBbkpELDZCQUF3QjtBQVN4Qjs7R0FFRztBQUNILE1BQWEsZ0JBQWdCO0lBRXpCLFlBQXFCLEdBQVksRUFBVyxHQUFZO1FBQW5DLFFBQUcsR0FBSCxHQUFHLENBQVM7UUFBVyxRQUFHLEdBQUgsR0FBRyxDQUFTO0lBQUksQ0FBQztJQUU3RCxRQUFRLENBQUMsR0FBVyxFQUFFLEtBQVUsRUFBRSxVQUFrQjs7UUFFaEQsSUFBSSxLQUFLLElBQUksU0FBUztZQUNsQixPQUFDLENBQUMsTUFBTSxFQUFFO2lCQUNMLEdBQUcsQ0FBQyxNQUFBLElBQUksQ0FBQyxHQUFHLG1DQUFJLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUcsS0FBSyxVQUFVLEtBQUssS0FBSywwQkFBMEIsSUFBSSxDQUFDLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQztpQkFDckgsR0FBRyxDQUFDLE1BQUEsSUFBSSxDQUFDLEdBQUcsbUNBQUksRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsR0FBRyxLQUFLLFVBQVUsS0FBSyxLQUFLLDBCQUEwQixJQUFJLENBQUMsR0FBRyxtQkFBbUIsRUFBRSxDQUFDO2lCQUN0SCxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztDQUNKO0FBWkQsNENBWUM7QUFFRDs7R0FFRztBQUNILE1BQWEsbUJBQW1CO0lBRTVCLFlBQXFCLEdBQVksRUFBVyxHQUFZO1FBQW5DLFFBQUcsR0FBSCxHQUFHLENBQVM7UUFBVyxRQUFHLEdBQUgsR0FBRyxDQUFTO0lBQUksQ0FBQztJQUU3RCxRQUFRLENBQUMsR0FBVyxFQUFFLEtBQVUsRUFBRSxVQUFrQjs7UUFFaEQsSUFBSSxLQUFLLElBQUksU0FBUyxFQUFFLENBQUM7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eEIsTUFBTSxVQUFVLEdBQWUsV0FBVyxDQUFDLENBQUMsQ0FBRSxDQUFDO2dCQUMvQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1RCxDQUFDO1FBQ0wsQ0FBQztBQUNULENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB6IH0gZnJvbSBcInpvZFwiO1xuXG4vKipcbiAqIFRoaXMgaXMgaW50ZXJmYWNlIGZvciB0aGUgY29uc3RyYWludHMgbmVlZGVkIHRvIHRlc3QgYXNraW5nIGZvciB0aGUga2V5IG5hbWUgb2YgdGhlIG9iamVjdCwgdGhlIHZhbHVlIGJlaW5nIHRlc3RlZCwgYW5kIGNvbnRleHQgZm9yIGRldGFpbGVkIFpvZCBlcnJvcnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29uc3RyYWludCB7XG4gICAgdmFsaWRhdGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnksIGlkZW50aWZpZXI6IHN0cmluZyk6IGFueTtcbn1cblxuLyoqXG4gKiBUaGlzIHZhbGlkYXRlcyBpZiB0aGUgZ2l2ZW4gc3RyaW5nICh2YWx1ZSkgaXMgd2l0aGluIHRoZSBib3VuZHMgb2YgbWluIHRvIG1heCBpbmNsdXNpdmUuIElmIG5vdCBhIGRldGFpbGVkIFpvZCBFcnJvciBpcyB0aHJvd24gYWxzbyB1dGlsaXppbmcgdGhlIGlkZW50aWZpZXIgZm9yIGNvbnRleHQuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHJpbmdDb25zdHJhaW50IGltcGxlbWVudHMgQ29uc3RyYWludCB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBtaW4/OiBudW1iZXIsIHJlYWRvbmx5IG1heD86IG51bWJlcikgeyB9XG5cbiAgICB2YWxpZGF0ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSwgaWRlbnRpZmllcjogc3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKHZhbHVlICE9IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHouc3RyaW5nKClcbiAgICAgICAgICAgICAgICAubWluKHRoaXMubWluID8/IDAsIHsgbWVzc2FnZTogYCR7a2V5fSAoJHtpZGVudGlmaWVyfTogJHt2YWx1ZX0pIG11c3QgYmUgbm8gbGVzcyB0aGFuICR7dGhpcy5taW59IGNoYXJhY3RlcnMgbG9uZy5gIH0pXG4gICAgICAgICAgICAgICAgLm1heCh0aGlzLm1heCA/PyA2MywgeyBtZXNzYWdlOiBgJHtrZXl9ICgke2lkZW50aWZpZXJ9OiAke3ZhbHVlfSkgbXVzdCBiZSBubyBtb3JlIHRoYW4gJHt0aGlzLm1heH0gY2hhcmFjdGVycyBsb25nLmAgfSlcbiAgICAgICAgICAgICAgICAucGFyc2UodmFsdWUpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBzYW1lIGFzIFN0cmluZ0NvbnN0cmFpbnQsIGJ1dCBhbHNvIGNoZWNrcyBpZiB0aGUgZ2l2ZW4gc3RyaW5nIGlzIGEgY29ycmVjdGx5IGZvcm1hdHRlZCBVUkwuIElmIG5vdCBhIGRldGFpbGVkIFpvZCBFcnJvciBpcyB0aHJvd24gYWxzbyB1dGlsaXppbmcgdGhlIGlkZW50aWZpZXIgZm9yIGNvbnRleHQuXG4gKi9cbmV4cG9ydCBjbGFzcyBVcmxTdHJpbmdDb25zdHJhaW50IGltcGxlbWVudHMgU3RyaW5nQ29uc3RyYWludCB7XG5cbiAgICBjb25zdHJ1Y3RvcihyZWFkb25seSBtaW4/OiBudW1iZXIsIHJlYWRvbmx5IG1heD86IG51bWJlcikgeyB9XG5cbiAgICB2YWxpZGF0ZShrZXk6IHN0cmluZywgdmFsdWU6IGFueSwgaWRlbnRpZmllcjogc3RyaW5nKSB7XG5cbiAgICAgICAgaWYgKHZhbHVlICE9IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICB6LnN0cmluZygpLnVybCh7IG1lc3NhZ2U6IGAke2tleX0gKCR7aWRlbnRpZmllcn06ICR7dmFsdWV9KSBtdXN0IGJlIGEgVVJMIGZvcm1hdHRlZCBjb3JyZWN0bHkuYCB9KS5wYXJzZSh2YWx1ZSk7XG5cbiAgICAgICAgICAgIHouc3RyaW5nKClcbiAgICAgICAgICAgICAgICAubWluKHRoaXMubWluID8/IDAsIHsgbWVzc2FnZTogYCR7a2V5fSAoJHtpZGVudGlmaWVyfTogJHt2YWx1ZX0pIG11c3QgYmUgYSBVUkwgbm8gbGVzcyB0aGFuICR7dGhpcy5taW59IGNoYXJhY3RlcnMgbG9uZy5gIH0pXG4gICAgICAgICAgICAgICAgLm1heCh0aGlzLm1heCA/PyAxMDAsIHsgbWVzc2FnZTogYCR7a2V5fSAoJHtpZGVudGlmaWVyfTogJHt2YWx1ZX0pIG11c3QgYmUgYSBVUkwgbm8gbW9yZSB0aGFuICR7dGhpcy5tYXh9IGNoYXJhY3RlcnMgbG9uZy5gIH0pXG4gICAgICAgICAgICAgICAgLnBhcnNlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKiBUaGlzIGNsYXNzIGNoZWNrcyBpZiB0aGUgZ2l2ZW4gbnVtYmVyICh2YWx1ZSkgaXMgd2l0aGluIHRoZSBib3VuZHMgb2YgdGhlIGdpdmVuIG1pbiBhbmQgbWF4IGluY2x1c2l2ZSBudW1iZXIgYm91bmRzLiBJZiBub3QgYSBkZXRhaWxlZCBab2QgRXJyb3IgaXMgdGhyb3duIGFsc28gdXRpbGl6aW5nIHRoZSBpZGVudGlmaWVyIGZvciBjb250ZXh0LlxuICovXG5leHBvcnQgY2xhc3MgTnVtYmVyQ29uc3RyYWludCBpbXBsZW1lbnRzIENvbnN0cmFpbnQge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbWluPzogbnVtYmVyLCByZWFkb25seSBtYXg/OiBudW1iZXIpIHsgfVxuXG4gICAgdmFsaWRhdGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnksIGlkZW50aWZpZXI6IHN0cmluZykge1xuXG4gICAgICAgIGlmICh2YWx1ZSAhPSB1bmRlZmluZWQpXG4gICAgICAgICAgICB6Lm51bWJlcigpXG4gICAgICAgICAgICAgICAgLmd0ZSh0aGlzLm1pbiA/PyAxLCB7IG1lc3NhZ2U6IGAke2tleX0gKCR7aWRlbnRpZmllcn06ICR7dmFsdWV9KSBtdXN0IGJlIG5vIGxlc3MgdGhhbiAke3RoaXMubWlufSBub2Rlcy5gIH0pXG4gICAgICAgICAgICAgICAgLmx0ZSh0aGlzLm1heCA/PyAzLCB7IG1lc3NhZ2U6IGAke2tleX0gKCR7aWRlbnRpZmllcn06ICR7dmFsdWV9KSBtdXN0IGJlIG5vIG1vcmUgdGhhbiAke3RoaXMubWF4fSBub2Rlcy5gIH0pXG4gICAgICAgICAgICAgICAgLnBhcnNlKHZhbHVlKTtcbiAgICB9XG59XG5cbi8qKlxuICogVGhpcyB3b3JrcyBqdXN0IGxpa2UgTnVtYmVyQ29uc3RyYWludCBidXQgY2hlY2tzIHRoZSBsZW5ndGggb2YgdGhlIGdpdmVuIHZhbHVlIGZvciBhbiBleHBlY3RlZCBhcnJheS4gSWYgbm90IGEgZGV0YWlsZWQgWm9kIEVycm9yIGlzIHRocm93biBhbHNvIHV0aWxpemluZyB0aGUgaWRlbnRpZmllciBmb3IgY29udGV4dC5cbiAqL1xuZXhwb3J0IGNsYXNzIEFycmF5Q29uc3RyYWludCBpbXBsZW1lbnRzIENvbnN0cmFpbnQge1xuXG4gICAgY29uc3RydWN0b3IocmVhZG9ubHkgbWluPzogbnVtYmVyLCByZWFkb25seSBtYXg/OiBudW1iZXIpIHsgfVxuXG4gICAgdmFsaWRhdGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnksIGlkZW50aWZpZXI6IHN0cmluZykge1xuXG4gICAgICAgIGlmICh2YWx1ZSAhPSB1bmRlZmluZWQpXG4gICAgICAgICAgICB6Lm51bWJlcigpXG4gICAgICAgICAgICAgICAgLmd0ZSh0aGlzLm1pbiA/PyAxLCB7IG1lc3NhZ2U6IGAke2tleX0gKCR7aWRlbnRpZmllcn0gb2YgbGVuZ3RoOiAke3ZhbHVlLmxlbmd0aH0pIG11c3QgYmUgbm8gbGVzcyB0aGFuICR7dGhpcy5taW59IG5vZGUgZ3JvdXBzLmAgfSlcbiAgICAgICAgICAgICAgICAubHRlKHRoaXMubWF4ID8/IDMsIHsgbWVzc2FnZTogYCR7a2V5fSAoJHtpZGVudGlmaWVyfSBvZiBsZW5ndGg6ICR7dmFsdWUubGVuZ3RofSkgbXVzdCBiZSBubyBtb3JlIHRoYW4gJHt0aGlzLm1heH0gbm9kZSBncm91cHMuYCB9KVxuICAgICAgICAgICAgICAgIC5wYXJzZSh2YWx1ZS5sZW5ndGgpO1xuICAgIH1cbn1cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYSBnaXZlbiBzdHJpbmcgbWF0Y2hlcyB0aGUgcmVnZXguICBJZiBub3QsIGEgZGV0YWlsZWQgWm9kIEVycm9yIGlzIHRocm93bi5cbiAqL1xuZXhwb3J0IGNsYXNzIEdlbmVyaWNSZWdleFN0cmluZ0NvbnN0cmFpbnQgaW1wbGVtZW50cyBDb25zdHJhaW50IHtcbiAgICBjb25zdHJ1Y3RvciAocmVhZG9ubHkgcmVnZXg/OiBSZWdFeHApIHsgfVxuXG4gICAgdmFsaWRhdGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnksIGlkZW50aWZpZXI6IHN0cmluZykge1xuICAgICAgICBcbiAgICAgICAgaWYgKHZhbHVlICE9IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHouc3RyaW5nKClcbiAgICAgICAgICAgICAgICAucmVnZXgodGhpcy5yZWdleCA/PyBuZXcgUmVnRXhwKCcuKicpLCB7IG1lc3NhZ2U6IGAke2tleX0gKCR7aWRlbnRpZmllcn0pIG11c3QgbWF0Y2ggcmVndWxhciBleHByZXNzaW9uICR7dGhpcy5yZWdleH0uYH0pXG4gICAgICAgICAgICAgICAgLnBhcnNlKHZhbHVlKTtcbiAgICAgICAgXG4gICAgfVxuXG59XG5cbi8qKlxuICogQ29udGFpbnMgYSBsaXN0IG9mIGNvbnN0cmFpbnRzIGFuZCBjaGVja3Mgd2hldGhlciBhIGdpdmVuIHZhbHVlIG1lZXRzIGVhY2ggY29uc3RyYWludC4gIElmIG5vdCwgYSBkZXRhaWxlZCBab2QgRXJyb3IgaXMgdGhyb3duIGZvciB0aGF0IGNvbnN0cmFpbnQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb3NpdGVDb25zdHJhaW50IGltcGxlbWVudHMgQ29uc3RyYWludCB7XG4gICAgcmVhZG9ubHkgY29uc3RyYWludHM6IEFycmF5PENvbnN0cmFpbnQ+O1xuICAgIGNvbnN0cnVjdG9yICguLi5jb25zdHJhaW50czogQXJyYXk8Q29uc3RyYWludD4pIHsgXG4gICAgICAgIHRoaXMuY29uc3RyYWludHMgPSBjb25zdHJhaW50cztcbiAgICB9XG4gICAgXG4gICAgdmFsaWRhdGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnksIGlkZW50aWZpZXI6IHN0cmluZykge1xuICAgICAgICB0aGlzLmNvbnN0cmFpbnRzLmZvckVhY2goY29uc3RyYWludCA9PiB7XG4gICAgICAgICAgICBjb25zdHJhaW50LnZhbGlkYXRlKGtleSwgdmFsdWUsIGlkZW50aWZpZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuLyoqXG4gKiBDaGVja3Mgd2hldGhlciBhIGdpdmVuIHN0cmluZyBtYXRjaGVzIHRoZSByZWdleCBmb3IgUkZDIDExMjMuICBJZiBub3QsIGEgZGV0YWlsZWQgWm9kIEVycm9yIGlzIHRocm93bi5cbiAqL1xuZXhwb3J0IGNsYXNzIEludGVybmV0SG9zdFN0cmluZ0NvbnN0cmFpbnQgZXh0ZW5kcyBDb21wb3NpdGVDb25zdHJhaW50IHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7IFxuICAgICAgICBzdXBlcihcbiAgICAgICAgICAgIG5ldyBHZW5lcmljUmVnZXhTdHJpbmdDb25zdHJhaW50KG5ldyBSZWdFeHAoJ14oPyFbMC05XSskKSg/IS4qLSQpKD8hLSlbYS16QS1aMC05LV0qJCcpKSwgXG4gICAgICAgICAgICBuZXcgU3RyaW5nQ29uc3RyYWludCgxLDYzKSxcbiAgICAgICAgKTsgXG4gICAgfVxufVxuXG4vKipcbiAqIFRoZSB0eXBlIHRoYXQgZGVyaXZlcyBmcm9tIGEgZ2VuZXJpYyBpbnB1dCBzdHJ1Y3R1cmUsIHJldGFpbmluZyB0aGUga2V5cy4gRW5hYmxlcyB0byBkZWZpbmUgbWFwcGluZyBiZXR3ZWVuIHRoZSBpbnB1dCBzdHJ1Y3R1cmUga2V5cyBhbmQgY29uc3RyYWludHMuXG4gKi9cbmV4cG9ydCB0eXBlIENvbnN0cmFpbnRzVHlwZTxUPiA9IFBhcnRpYWw8UmVjb3JkPGtleW9mIFQsIENvbnN0cmFpbnQ+PjtcblxuLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIHZhbGlkYXRlcyB0aGUgZ2l2ZW4gb2JqZWN0IGJ5IHRoZSBnaXZlbiBjb25zdHJhaW50cywgYW5kIHJldHVybnMgYW4gZXJyb3IgdGhhdCB1c2VzIHRoZSBnaXZlbiBjb250ZXh0IGlmIG5lZWRlZC5cbiAqIEBwYXJhbSBjb25zdHJhaW50cyBUaGlzIGlzIHRoZSBrZXlzIG9mIHRoZSBvYmplY3Qgd2l0aCBzcGVjaWZpZWQgdmFsdWVzIGZvciB2YWxpZGF0aW9uLlxuICogQHBhcmFtIGNvbnRleHQgT2JqZWN0IHR5cGUgbmFtZSBmb3IgZXJyb3IgY29udGV4dCBwdXJwb3Nlcy5cbiAqIEBwYXJhbSBvYmplY3QgVGhlIGdpdmVuIG9iamVjdCB0eXBlLCBhbiBhcnJheSBvZiBvciBvbmx5IGEgc2luZ2xlIG9iamVjdCwgdG8gYmUgdmFsaWRhdGVkLlxuICogQHJldHVybnMgdGhyb3dzIGEgWm9kIEVycm9yIGlmIHZhbGlkYXRpb25zIGFyZSBicm9rZW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUNvbnN0cmFpbnRzPFQ+KGNvbnN0cmFpbnRzOiBDb25zdHJhaW50c1R5cGU8VD4sIGNvbnRleHQ6IHN0cmluZywgLi4ub2JqZWN0OiBhbnkpIHtcblxuICAgIGlmIChvYmplY3QgIT0gdW5kZWZpbmVkKVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgayBpbiBjb25zdHJhaW50cykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbnN0cmFpbnQ6IENvbnN0cmFpbnQgPSBjb25zdHJhaW50c1trXSE7XG4gICAgICAgICAgICAgICAgY29uc3RyYWludC52YWxpZGF0ZShjb250ZXh0ICsgXCIuXCIgKyBrLCBvYmplY3RbaV1ba10sIGspO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG59XG4iXX0=