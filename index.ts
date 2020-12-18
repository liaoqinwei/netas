import HttpRequest from "./core/httpRequest";
import AbstractHttp  from "./core/abstractHttp";


AbstractHttp.XMLHttpRequest = require("./XMLHttpRequest")
AbstractHttp.FormData = require("./FormData")

let http: HttpRequest = new HttpRequest();

// common js
module.exports = http
// es6
export default http

