const http = require('http')
const url = require('url')
const isJson = require('is-json')
// @ts-ignore
const FormData = require('./formData')
// @ts-ignore
const File = require('./file')

type method = 'get' | 'post' | 'put' | 'options' | 'delete' | 'patch' | 'connect' | 'trace' | 'head'

// let netPathReg = /^http[s]?/
let encodingReg = /charset=(\S+)[;]?/

// node 环境下没有 XHR 我们需要封装一个
// @ts-ignore
class XMLHttpRequest {
  constructor() {
    this.readyState = this.UNSENT
  }

  private req
  private res
  private url: string
  private method: method

  readonly DONE = 4
  readonly HEADERS_RECEIVED = 2
  readonly LOADING = 3
  readonly OPENED = 1
  readonly UNSENT = 0
  headers = {
    'Cache-Control': 'max-age=0',
    'Accept': '*/*'
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
  * */
  send(data: object | string | FormData): void {
    // send
    this.readyState = this.HEADERS_RECEIVED

    let options = {...url.parse(this.url), method: this.method, headers: this.headers}
    let protocol = options.protocol
    if (protocol !== null) {
      // http / https
      // https for 443 port
      if (protocol === 'https:') options.port = 443
      this.readyState = this.LOADING
      // res process
      let req = http.request(options, this.processResponse)
      this.req = req
      this.processRequest(data)
      // req end
      req.end()
    } else { // file
      this.readyState = this.LOADING
      // @ts-ignore
      let file = new File(this.url)
      // @ts-ignore
      this.response = file.content
      // @ts-ignore
      this.responseText = file.content.toString('utf8')
      this.readyState = this.DONE
    }
  }

  private processResponse(res) {
    this.res = res
    console.log(res)
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
  }

  private processRequest(data: object | string | FormData) {
    // req process
    if (['post', 'delete', 'put'].includes(this.method.toLowerCase())) {
      // json / string
      if (typeof data === 'object' && data !== null && !(data instanceof FormData))
        data = JSON.stringify(data)
      if (typeof data === "string") {
        if (isJson(data))
          this.req.setHeader('Content-Type', 'application/json;charset=utf-8')
        else
          this.req.setHeader('Content-Type', 'text/plain;charset=utf-8')
        this.req.write(data, 'utf-8')
      } else if (data instanceof FormData) {
        // FOMR-DATA
        // @ts-ignore
        this.req.setHeader('Content-Type', `multipart/form-data; boundary=${data.id.substring(2)}`)
        let bufferList = parseFormData(data)
        this.req.write(bufferList)
        // write end
        // @ts-ignore
        this.req.write(data.id + '--', 'utf8')
      }
    }
  }

  abort(): void {
    this.req.destroy()
    this.onabort && this.onabort()
    this.onerror && this.onerror()
  }

  getResponseHeader(header: string) {
    if (this.readyState === this.DONE)
      return this.res.getHeader(header)
  }

  // 获取所有的响应头
  getAllResponseHeaders(): object {
    return this.res
  }

  setRequestHeader(header: string, value: string) {
    if (this.readyState !== this.OPENED) return
    this.headers[header] = value
  }

  // 此方法暂定
  overrideMimeType() {
  }
}


function parseFormData(formData: FormData): Buffer {
  let bufferList = []
  // @ts-ignore
  for (let [key, val] of formData.entries()) {
    val.forEach(item => {
      let encoding = 'utf-8', filename = '', contentType = '\r\n'
      if (item instanceof File) {
        encoding = 'binary'
        // @ts-ignore
        filename = `; filename=${item.filename}`
        // @ts-ignore
        contentType = `Content-type:${item.mime}\r\n\r\n`
        // @ts-ignore
        item = item.content
        if (item === null) return
      }
      // @ts-ignore
      bufferList.push(Buffer.from(formData.id + '\r\n', encoding))
      // @ts-ignore
      bufferList.push(Buffer.from(`Content-Disposition: form-data; name="${key}"${filename}\r\n`, encoding))
      // @ts-ignore
      bufferList.push(Buffer.from(contentType, encoding))
      // @ts-ignore
      bufferList.push(Buffer.from(item + '\r\n', encoding))
    })
  }
  return Buffer.concat(bufferList)
}


module.exports = XMLHttpRequest