"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractHttp = /** @class */ (function () {
    function AbstractHttp() {
    }
    /**
     * 将传入的 url 和 baseUrl合并
     */
    AbstractHttp.prototype.mergeUrl = function () {
        var url = this.config.url, baseUrl = this.config.baseUrl;
        if (/^http[s]?:[/]{2}./.test(url))
            return url;
        baseUrl.lastIndexOf('/') === baseUrl.length - 1 ? baseUrl = baseUrl.substring(0, baseUrl.length - 1) : null;
        url.indexOf('/') !== 0 ? url = '/' + url : null;
        return baseUrl + url;
    };
    /**
     * 将传入的 url 参数进行合并
     */
    AbstractHttp.prototype.paramsHandle = function () {
        var url = this.config.url;
        var paramStr = '';
        var res;
        if (this.config.baseUrl !== '')
            url = this.mergeUrl();
        // cache
        if (!this.config.cache)
            this.config.params['_'] = Date.now();
        for (var key in this.config.params) {
            paramStr += key + '=' + this.config.params[key] + '&';
        }
        if (paramStr !== "")
            url.indexOf('?') === -1 ?
                url += '?' : url[url.length - 1] !== '&' ? paramStr = '&' + paramStr : null;
        res = url + paramStr.substring(0, paramStr.length - 1);
        this.config["finalUrl"] = res;
        return res;
    };
    /**
     * 处理 data 为 formData / json
     */
    AbstractHttp.prototype.dataHandle = function () {
        var res = this.config.data;
        if (!(res instanceof AbstractHttp.FormData)) {
            if (this.config.dataType === 'multipart')
                res = this.urlencodedParse();
            else if (this.config.dataType === 'json')
                res = JSON.stringify(this.config.data);
        }
        this.config.finalData = res;
        return res;
    };
    /**
     * 将对象转换为 FormData对象
     */
    AbstractHttp.prototype.urlencodedParse = function () {
        var _this = this;
        var formData = new AbstractHttp.FormData();
        var keys = Object.keys(this.config.data);
        keys.forEach(function (key) {
            formData.append(key, _this.config.data[key]);
        });
        return formData;
    };
    // 处理请求头
    AbstractHttp.prototype.processReqHeader = function () {
        switch (this.config.dataType) {
            case "json":
                this.config.headers["Content-Type"] = 'application/json';
                return;
            case "":
                this.config.headers["Content-Type"] = "text/plain";
        }
    };
    // 配置解析
    AbstractHttp.prototype.configParse = function (conf) {
        var _this = this;
        var keys = Object.keys(this.defaults), processedConfig = conf;
        keys.forEach(function (key) {
            var item = _this.defaults[key], confItem = conf[key];
            if (confItem == null)
                confItem = item;
            else if (typeof confItem === 'object' && !(confItem instanceof FormData))
                confItem = __assign(__assign({}, confItem), item);
            processedConfig[key] = confItem;
        });
        var xhr = new AbstractHttp.XMLHttpRequest();
        xhr.responseType = conf.responseType;
        xhr.timeout = conf.timeout;
        processedConfig["xhr"] = xhr;
        this.config = processedConfig;
    };
    // 发送请求
    AbstractHttp.prototype.send = function (conf) {
        this.configParse(conf);
        this.paramsHandle();
        this.config.xhr.open(this.config.method, this.config["finalUrl"]);
        if (Object.keys(this.config.data).length > 0)
            this.dataHandle();
        this.headerHandle();
        this.processedResponseHandle();
        this.config.xhr.send(this.config.finalData);
    };
    // 设置请求头
    AbstractHttp.prototype.headerHandle = function () {
        var xhr = this.config.xhr;
        this.processReqHeader();
        for (var key in this.config.headers) {
            var val = this.config.headers[key];
            xhr.setRequestHeader(key, val);
        }
    };
    AbstractHttp.prototype.processedResponseHandle = function () {
    };
    return AbstractHttp;
}());
exports.default = AbstractHttp;
