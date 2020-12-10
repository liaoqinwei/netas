const http = require('http')
const https = require('https')
const fs = require('fs')

type method = 'get' | 'post' | 'put' | 'options' | 'delete' | 'patch' | 'connect' | 'trace' | 'head'


// node 环境下没有 XHR 我们需要封装一个
class XMLHttpRequest {
  readonly DONE = 4
  readonly HEADERS_RECEIVED = 2
  readonly LOADING = 3
  readonly OPENED = 1
  readonly UNSENT = 0

  timeout

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
  }

  send(data: object): void {
    this.readyState = this.HEADERS_RECEIVED
  }

  abort(): void {
  }

  getResponseHeader(header: string) {
  }

  getAllResponseHeaders(): string {
    return ''
  }

  setRequestHeader(header: string, value: string) {

  }

  // 此方法暂定
  overrideMimeType() {
  }
}