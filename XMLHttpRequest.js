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
// @ts-nocheck
var http = require('./util/http');
var url = require('url');
var isJson = require('is-json');
var FormData = require('./FormData');
var File = require('./File');
var encodingReg = /charset=(\S+)[;]?/, emptyFn = new Function(), _defaultErrorFn = function (err) {
    console.error(err);
};
// node 环境下没有 XHR 我们需要封装一个
var XMLHttpRequest = /** @class */ (function () {
    function XMLHttpRequest() {
        this.DONE = 4;
        this.HEADERS_RECEIVED = 2;
        this.LOADING = 3;
        this.OPENED = 1;
        this.UNSENT = 0;
        this.headers = {
            'Cache-Control': 'max-age=0',
            'Accept': '*/*',
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
        };
        this.timeout = 1000 * 10;
        this.responseType = 'text';
        this.status = 0;
        this.readyState = this.UNSENT;
    }
    Object.defineProperty(XMLHttpRequest.prototype, "readyState", {
        get: function () {
            return this.privateReadyState;
        },
        set: function (val) {
            this.privateReadyState = val;
            if (val === 0)
                return;
            this.onreadystatechange && this.onreadystatechange();
        },
        enumerable: false,
        configurable: true
    });
    // 不支持同步请求
    XMLHttpRequest.prototype.open = function (method, url) {
        this.readyState = this.OPENED;
        this.url = url;
        this.method = method;
    };
    XMLHttpRequest.prototype.send = function (data) {
        var _this = this;
        // send
        this.readyState = this.HEADERS_RECEIVED;
        var options = __assign(__assign({}, url.parse(this.url)), { method: this.method, headers: this.headers, timeout: this.timeout });
        var protocol = options.protocol;
        if (/http[s]?/.test(protocol)) {
            // http / https
            this.readyState = this.LOADING;
            // res process
            var req = http(options, this.processResponse.bind(this));
            this.req = req;
            this.processRequest(data);
            // req end
            req.end();
            return;
        }
        // file
        queueMicrotask(function () {
            _this.readyState = _this.LOADING;
            try {
                var file = new File(_this.url);
                _this.response = file.content;
                _this.responseText = file.content.toString('utf8');
                _this.status = 200;
                _this.res = { headers: {} };
            }
            catch (e) {
                _this.onerror && _this.onerror({ target: _this });
            }
            finally {
                _this.readyState = _this.DONE;
            }
        });
    };
    XMLHttpRequest.prototype.processResponse = function (res) {
        var _this = this;
        this.res = res;
        var dataList = [], finalData, encoding;
        var temp = encodingReg.exec(res.headers["content-type"]);
        encoding = (temp && temp[1]) || 'utf-8';
        this.status = res.statusCode;
        this.statusText = res.statusMessage;
        res.on('data', function (data) { return dataList.push(data); });
        res.on('end', function () {
            finalData = Buffer.concat(dataList);
            _this.responseText = finalData.toString(encoding);
            switch (_this.responseType) {
                case "json":
                    try {
                        _this.response = JSON.parse(finalData);
                    }
                    catch (e) {
                        _this.response = finalData.toString(encoding);
                    }
                    break;
                case "binary":
                    _this.response = finalData;
                    break;
                case "text":
                    _this.response = _this.responseText;
            }
            // down
            _this.readyState = _this.DONE;
        });
    };
    XMLHttpRequest.prototype.processRequest = function (data) {
        // add event
        this.req.on('timeout', this.ontimeout || emptyFn);
        this.req.on('abort', this.onabort || emptyFn);
        this.req.on('error', this.onerror || _defaultErrorFn);
        // process request body
        if (['post', 'delete', 'put'].includes(this.method.toLowerCase())) {
            if (typeof data === 'object' && data != null && !(data instanceof FormData))
                data = JSON.stringify(data);
            if (typeof data === "string") {
                // json header
                if (isJson(data))
                    this.req.setHeader('Content-Type', 'application/json;charset=utf-8');
                // text header
                else
                    this.req.setHeader('Content-Type', 'text/plain;charset=utf-8');
                this.req.write(data, 'utf-8');
            }
            else if (data instanceof FormData) {
                // FORM-DATA
                var bufferList = parseFormData(data);
                this.req.setHeader('Content-Type', "multipart/form-data; boundary=" + data.id.substring(2));
                this.req.write(bufferList);
                this.req.write(data.id + '--', 'utf8');
            }
        }
    };
    XMLHttpRequest.prototype.abort = function () {
        this.req.destroy();
    };
    XMLHttpRequest.prototype.getResponseHeader = function (header) {
        if (this.readyState === this.DONE)
            return this.res.headers[header];
    };
    XMLHttpRequest.prototype.getAllResponseHeaders = function () {
        if (this.readyState === this.DONE) {
            var headers = '';
            for (var _i = 0, _a = Object.entries(this.res.headers); _i < _a.length; _i++) {
                var _b = _a[_i], header = _b[0], val = _b[1];
                headers += header + ': ' + val + '\r\n';
            }
            return headers.trim();
        }
    };
    // set header
    XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
        if (this.readyState !== this.OPENED)
            return;
        this.headers[header] = value;
    };
    // not support
    XMLHttpRequest.prototype.overrideMimeType = function () {
    };
    return XMLHttpRequest;
}());
// Process Form Data into Buffer
function parseFormData(formData) {
    var bufferList = [];
    var _loop_1 = function (key, val) {
        val.forEach(function (item) {
            var encoding = 'utf-8', filename = '', contentType = '\r\n';
            if (item instanceof File) {
                encoding = 'binary';
                filename = "; filename=" + item.filename;
                contentType = "Content-type:" + item.mime + "\r\n\r\n";
                item = item.content;
                if (item === null)
                    return;
            }
            bufferList.push(Buffer.from(formData.id + '\r\n', encoding));
            bufferList.push(Buffer.from("Content-Disposition: form-data; name=\"" + key + "\"" + filename + "\r\n", encoding));
            bufferList.push(Buffer.from(contentType, encoding));
            bufferList.push(Buffer.from(item + '\r\n', encoding));
        });
    };
    for (var _i = 0, _a = formData.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], val = _b[1];
        _loop_1(key, val);
    }
    return Buffer.concat(bufferList);
}
module.exports = XMLHttpRequest;
