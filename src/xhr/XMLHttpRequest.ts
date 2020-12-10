const http = require('http')
const fs = require('fs')
const url = require('url')

type method = 'get' | 'post' | 'put' | 'options' | 'delete' | 'patch' | 'connect' | 'trace' | 'head'

let netPathReg = /^http[s]?/

// node 环境下没有 XHR 我们需要封装一个
// @ts-ignore
class XMLHttpRequest {
    url: string
    method: method
    readonly DONE = 4
    readonly HEADERS_RECEIVED = 2
    readonly LOADING = 3
    readonly OPENED = 1
    readonly UNSENT = 0
    headers = {}
    timeout = 1000 * 10

    // response
    readonly response
    readonly responseText
    responseType

    // state
    statusText
    status
    readyState = this.UNSENT

    // event
    onabort
    onerror
    ontimeout
    onreadystatechange


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
    send(data: object): void {
        // send
        this.readyState = this.HEADERS_RECEIVED
        let options = {...url.parse(this.url), method: this.method, headers: this.headers,}
        let protocol = options.protocol
        if (protocol !== null) { // http / https
          // https for 443 port
          if(protocol === 'https:')
            options.port = 443
          http.request(options,(res)=>{
            console.log(res)
          }).end()
        } else { // file

        }
        // 发送请求
        this.readyState = this.LOADING
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


// test
let xhr = new XMLHttpRequest()
xhr.open('get','http://152.136.147.123:9090/recommend')
xhr.send(null)
console.log(123)