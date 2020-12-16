// @ts-nocheck
const http = require('http')
const url = require('url')
const isJson = require('is-json')
const FormData = require('./FormData')
const File = require('./File')

type method = 'get' | 'post' | 'put' | 'options' | 'delete' | 'patch' | 'connect' | 'trace' | 'head'
type sendType = string | object | FormData | undefined | null
type responseTypeNode = 'json' | 'text' | 'binary'


let encodingReg: RegExp = /charset=(\S+)[;]?/,
    emptyFn: Function = new Function(),
    _defaultErrorFn = err => {
      console.error(err)
    };

// node 环境下没有 XHR 我们需要封装一个
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
    'Accept': '*/*',
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
  }
  timeout = 1000 * 10

  // response
  response
  responseText
  responseType: responseTypeNode = 'text'

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

  send(data: sendType): void {
    // send
    this.readyState = this.HEADERS_RECEIVED

    let options = {...url.parse(this.url), method: this.method, headers: this.headers, timeout: this.timeout}
    let protocol = options.protocol
    if (protocol !== null) {
      // http / https
      // https for 443 port
      if (protocol === 'https:') options.port = 443
      this.readyState = this.LOADING
      // res process
      let req = http.request(options, this.processResponse.bind(this))
      this.req = req
      this.processRequest(data)
      // req end
      req.end()
    } else { // file
      this.readyState = this.LOADING
      try {
        let file = new File(this.url)
        this.response = file.content
        this.responseText = file.content.toString('utf8')
      } catch (e) {
        this.onerror && this.onerror(e)
      }
      this.readyState = this.DONE
    }
  }

  private processResponse(res) {
    this.res = res
    let dataList = [], finalData, encoding;
    let temp = encodingReg.exec(res.headers["content-type"])

    encoding = (temp && temp[1]) || 'utf-8'
    this.status = res.statusCode
    this.statusText = res.statusMessage


    res.on('data', data => dataList.push(data))
    res.on('end', () => {
      finalData = Buffer.concat(dataList)
      switch (this.responseType) {
        case "json":
          try {
            this.response = JSON.parse(finalData)
          } catch (e) {
            this.response = finalData.toString(encoding)
          }
          break
        case "binary":
          this.response = finalData
          break
        case "text":
          this.response = finalData.toString(encoding)
      }

      this.responseText = finalData.toString(encoding)
      // down
      this.readyState = this.DONE
    })
  }

  private processRequest(data: sendType) {
    // add event
    this.req.on('timeout', this.ontimeout || emptyFn)
    this.req.on('abort', this.onabort || emptyFn)
    this.req.on('error', this.onerror || _defaultErrorFn)

    // process request body
    if (['post', 'delete', 'put'].includes(this.method.toLowerCase())) {
      if (typeof data === 'object' && data != null && !(data instanceof FormData))
        data = JSON.stringify(data)
      if (typeof data === "string") {

        // json header
        if (isJson(data))
          this.req.setHeader('Content-Type', 'application/json;charset=utf-8')
        // text header
        else
          this.req.setHeader('Content-Type', 'text/plain;charset=utf-8')

        this.req.write(data, 'utf-8')
      } else if (data instanceof FormData) {
        // FORM-DATA
        let bufferList = parseFormData(data)

        this.req.setHeader('Content-Type', `multipart/form-data; boundary=${data.id.substring(2)}`)
        this.req.write(bufferList)
        this.req.write(data.id + '--', 'utf8')
      }
    }

  }

  abort(): void {
    this.req.destroy()
  }

  getResponseHeader(header: string): string {
    if (this.readyState === this.DONE)
      return this.res.headers[header]
  }

  getAllResponseHeaders(): string {
    if (this.readyState === this.DONE) {
      let headers = ''
      for (let [header, val] of Object.entries(this.res.headers))
        headers += header + ': ' + val + '\r\n'
      return headers.trim()
    }
  }

  // set header
  setRequestHeader(header: string, value: string) {
    if (this.readyState !== this.OPENED) return
    this.headers[header] = value
  }

  // not support
  overrideMimeType() {
  }
}

// Process Form Data into Buffer
function parseFormData(formData: FormData): Buffer {
  let bufferList = []
  for (let [key, val] of formData.entries()) {
    val.forEach(item => {
      let encoding = 'utf-8', filename = '', contentType = '\r\n'
      if (item instanceof File) {
        encoding = 'binary'
        filename = `; filename=${item.filename}`
        contentType = `Content-type:${item.mime}\r\n\r\n`
        item = item.content
        if (item === null) return
      }
      bufferList.push(Buffer.from(formData.id + '\r\n', encoding))
      bufferList.push(Buffer.from(`Content-Disposition: form-data; name="${key}"${filename}\r\n`, encoding))
      bufferList.push(Buffer.from(contentType, encoding))
      bufferList.push(Buffer.from(item + '\r\n', encoding))
    })
  }
  return Buffer.concat(bufferList)
}

module.exports = XMLHttpRequest