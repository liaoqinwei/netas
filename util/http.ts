const http = require('http')
const https = require('https')

module.exports = function (options: any, callback: Function) {
  return options.protocol === 'https:' ?
      https.request(options, callback) :
      http.request(options, callback)
}