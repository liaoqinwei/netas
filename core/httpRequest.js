"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstractHttp_1 = require("./abstractHttp");
var HttpRequest = /** @class */ (function (_super) {
    __extends(HttpRequest, _super);
    function HttpRequest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // default config
        _this.defaults = {
            baseUrl: '',
            headers: {},
            data: {},
            cache: true,
            params: {},
            dataType: 'json',
            method: 'get',
            timeout: 1000 * 10,
            responseType: 'json'
        };
        _this.config = { url: '' };
        return _this;
    }
    // 请求
    HttpRequest.prototype.request = function (conf) {
        var _this = this;
        // 合并url 和 处理参数
        if (conf.url === '' || conf.url == null)
            throw new Error('必须传入一个请求地址');
        this.send(conf);
        conf = this.config;
        var xhr = this.config.xhr;
        return new Promise(function (resolve, reject) {
            xhr.onreadystatechange = function () {
                // 请求已经回来
                if (xhr.readyState === 4) {
                    var code = xhr.status;
                    // 成功
                    if (/^[2|3][\d]{2}/.test(code.toString()))
                        resolve(_this.requestSuccess(conf));
                    else
                        reject(_this.requestFail(conf));
                }
            };
            // 发生错误
            xhr.onerror = function (ev) { return reject(_this.requestFail(ev)); };
            xhr.ontimeout = function (ev) { return reject(_this.requestFail(ev)); };
        });
    };
    // 可以返回一个新的请求对象
    HttpRequest.prototype.createHttp = function () {
        return new HttpRequest();
    };
    // 响应失败
    HttpRequest.prototype.requestFail = function (conf) {
        var xhr = conf.xhr;
        return {
            code: xhr.status,
            xhr: xhr
        };
    };
    // 响应成功
    HttpRequest.prototype.requestSuccess = function (conf) {
        var res;
        var status = conf.xhr.status, data = conf.xhr.response, headers = conf.xhr.getAllResponseHeaders(), reason = conf.xhr.statusText, url = conf.finalUrl, headerMap = {};
        var headerList = headers.trim().split(/(?:\r\n)|(?:: )/);
        for (var i = 0; i < headerList.length; i += 2) {
            headerMap[headerList[i]] = headerList[i + 1];
        }
        res = { status: status, data: data, reason: reason, url: url, headers: headerMap };
        return res;
    };
    return HttpRequest;
}(abstractHttp_1.default));
exports.default = HttpRequest;
