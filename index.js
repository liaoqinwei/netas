import HttpRequest from "./src/core/httpRequest";
let http = new HttpRequest();
if (window) {
    window.netas = http;
}
else if (global) {
    module.exports = http;
}
export default http;
