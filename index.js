"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httpRequest_1 = require("./core/httpRequest");
var http = new httpRequest_1.default();
if (typeof window === 'undefined') {
    // in node
    module.exports = http;
}
else {
    // @ts-ignore
    window[netas] = http;
}
// es6
exports.default = http;
