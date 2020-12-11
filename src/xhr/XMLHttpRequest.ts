const http = require('http')
const fs = require('fs')
const url = require('url')
// @ts-ignore
const FormData = require('./FormData')

type method = 'get' | 'post' | 'put' | 'options' | 'delete' | 'patch' | 'connect' | 'trace' | 'head'

let netPathReg = /^http[s]?/
let encodingReg = /charset=(\S+)[;]?/

// node 环境下没有 XHR 我们需要封装一个
// @ts-ignore
class XMLHttpRequest {
  constructor() {
    this.readyState = 0
  }

  url: string
  method: method
  readonly DONE = 4
  readonly HEADERS_RECEIVED = 2
  readonly LOADING = 3
  readonly OPENED = 1
  readonly UNSENT = 0
  headers = {
    'Cache-Control': 'max-age=0'
  }
  timeout = 1000 * 10

  // response
  response
  responseText
  // not support
  responseType

  // state
  statusText
  status
  privateReadyState

  // event
  onabort
  onerror
  ontimeout
  onreadystatechange

  get readyState() {
    return this.privateReadyState
  }

  set readyState(val) {
    this.privateReadyState = val
    if (val === 0) return
    this.onreadystatechange && this.onreadystatechange()
  }

  // 不支持同步请求
  open(method: method, url: string): void {
    this.readyState = this.OPENED
    this.url = url
    this.method = method
  }

  /*
  * url 的情况
  * 文件
  * /sdad/sadsad
  * file:///E:\sadad\sad
  *
  * http://
  * https://
  *
  *
  * */
  send(data: object | string): void {
    // send
    this.readyState = this.HEADERS_RECEIVED

    let options = {...url.parse(this.url), method: this.method, headers: this.headers}
    let protocol = options.protocol
    if (protocol !== null) { // http / https
      // https for 443 port
      if (protocol === 'https:') options.port = 443

      // 发送请求
      this.readyState = this.LOADING

      let req = http.request(options, (res) => {
        // save state
        let dataList = [], finalData, encoding;
        let temp = encodingReg.exec(res.headers["content-type"])
        encoding = (temp && temp[1]) || 'utf-8'
        this.status = res.statusCode
        this.statusText = res.statusMessage


        res.on('data', data => dataList.push(data))
        res.on('end', () => {
          finalData = Buffer.concat(dataList)
          this.response = finalData
          this.responseText = finalData.toString(encoding)
          // down
          this.readyState = this.DONE
        })

      })

      if (['post', 'delete', 'put'].includes(this.method.toLowerCase())) {
        if (typeof data === 'string') {
          req.write(data, 'utf-8')
          req.setHeader('Content-Type', 'application/json')
        } else {
          // formData
          if (data !== null) {
            req.setHeader('Accept', '*/*')
          }
        }
      }


      // req end
      req.end()
    } else { // file

    }

    // 请求完成
    this.readyState = this.DONE
  }

  abort(): void {
  }

  getResponseHeader(header: string) {
  }

  getAllResponseHeaders(): string {
    return ''
  }

  setRequestHeader(header: string, value: string) {
    if (this.readyState !== this.OPENED) return
    this.headers[header] = value
  }

  // 此方法暂定
  overrideMimeType() {
  }
}


function parseFormData(formData: FormData) {
  // @ts-ignore
  let dataList = [], fix = formData.id;
  // @ts-ignore
  for (let [key, val] of formData.entries()) {
    console.log(key, val)
  }

}

/*
// test
let xhr = new XMLHttpRequest()
xhr.open('get', 'http://152.136.147.123:9090/recommend')
xhr.send(null)
console.log(123)*/


let fd = new FormData()
fd.append('uname', 'sdadas')
fd.append('upwd', 'sdad')
parseFormData(fd)