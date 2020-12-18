"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var fs = require('fs');
var mime = require('mime');
var File = /** @class */ (function () {
    function File(path) {
        // @ts-ignore
        this.content = null;
        this.path = path;
        this.init();
    }
    File.prototype.init = function () {
        this.readFile();
        this.parseFile();
    };
    File.prototype.readFile = function () {
        this.content = fs.readFileSync(this.path);
    };
    File.prototype.parseFile = function () {
        // filename
        this.filename = this.path.substring(this.path.lastIndexOf('/') + 1);
        // suffix
        var suffixIndex = this.path.lastIndexOf('.');
        if (suffixIndex !== -1)
            this.suffix = this.path.substring(suffixIndex + 1);
        // mime
        this.mime = mime.getType(this.suffix);
    };
    return File;
}());
module.exports = File;
exports.default = File;
