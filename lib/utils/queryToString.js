"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(query) {
    let result = '';
    for (const queryElement in query) {
        result += `${queryElement}=${query[queryElement]}&`;
    }
    result = result.slice(0, -1);
    return result;
}
exports.default = default_1;
