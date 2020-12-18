"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
var uuidv4 = require('uuid').v4;
var File = require('./File');
var FormData = /** @class */ (function () {
    function FormData() {
        this.datas = {};
        this.id = '------' + uuidv4().substr(0, 25).replace(/-/g, '');
    }
    FormData.prototype.append = function (key, val) {
        (this.datas[key] = this.datas[key] || []).push(val);
    };
    FormData.prototype.delete = function (key) {
        this.datas[key] || this.datas[key].shift();
    };
    FormData.prototype.get = function (key) {
        return this.datas[key] || this.datas[key][0];
    };
    FormData.prototype.set = function (key, val) {
        this.datas[key] = [val];
    };
    FormData.prototype.getAll = function (key) {
        return this.datas[key];
    };
    FormData.prototype.values = function () {
        return Object.values(this.datas);
    };
    FormData.prototype.keys = function () {
        return Object.keys(this.datas);
    };
    FormData.prototype.entries = function () {
        return Object.entries(this.datas);
    };
    return FormData;
}());
module.exports = FormData;
exports.default = FormData;
