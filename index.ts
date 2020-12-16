import HttpRequest from "./core/httpRequest";

let http: HttpRequest = new HttpRequest();


if (typeof window === 'undefined') {
  // in node
  module.exports = http
} else {

  // @ts-ignore
  window[netas] = http
}
// es6
export default http
