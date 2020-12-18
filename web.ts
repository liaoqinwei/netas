//in web
import AbstractHttp  from "./core/abstractHttp";
import HttpRequest from "./core/httpRequest";


AbstractHttp.XMLHttpRequest = window.XMLHttpRequest
AbstractHttp.FormData = window.FormData

let http: HttpRequest = new HttpRequest();

// common js
module.exports = http
// es6
export default http
