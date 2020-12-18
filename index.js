"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httpRequest_1 = require("./core/httpRequest");
var abstractHttp_1 = require("./core/abstractHttp");
abstractHttp_1.default.XMLHttpRequest = require("./XMLHttpRequest");
abstractHttp_1.default.FormData = require("./FormData");
var http = new httpRequest_1.default();
// common js
module.exports = http;
// es6
exports.default = http;
