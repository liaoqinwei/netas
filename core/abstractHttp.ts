import Http from './http'
import {FullRequestCfg, NetworkCfg, RequestCfg, requestType, Response} from "../type/conf"

var XMLHttpRequest = XMLHttpRequest
var FormData = FormData
if (typeof window === "undefined") {
  // @ts-ignore
  XMLHttpRequest = require('../XMLHttpRequest')
  // @ts-ignore
  FormData = require('../FormData')
}

export default abstract class AbstractHttp implements Http {
  abstract defaults: NetworkCfg
  abstract config: FullRequestCfg

  /**
   * 将传入的 url 和 baseUrl合并
   */
  mergeUrl(): string {
    let url: string = this.config.url,
        baseUrl: string = this.config.baseUrl

    if (/^http[s]?:[/]{2}./.test(url)) return url;

    baseUrl.lastIndexOf('/') === baseUrl.length - 1 ? baseUrl = baseUrl.substring(0, baseUrl.length - 1) : null
    url.indexOf('/') !== 0 ? url = '/' + url : null;

    return baseUrl + url;
  }

  /**
   * 将传入的 url 参数进行合并
   */
  paramsHandle(): string {
    let url: string = this.config.url
    let paramStr: string = ''
    let res: string

    if (this.config.baseUrl !== '') url = this.mergeUrl();
    // cache
    if (!this.config.cache) this.config.params['_'] = Date.now()

    for (let key in this.config.params) {
      paramStr += key + '=' + this.config.params[key] + '&'
    }
    if (paramStr !== "")
      url.indexOf('?') === -1 ?
          url += '?' : url[url.length - 1] !== '&' ? paramStr = '&' + paramStr : null

    res = url + paramStr.substring(0, paramStr.length - 1)
    this.config["finalUrl"] = res
    return res;
  }

  /**
   * 处理 data 为 formData / json
   */
  dataHandle(): requestType {
    let res: any = this.config.data
    if (!(res instanceof FormData)) {
      if (this.config.dataType === 'urlencode') res = this.urlencodedParse()
      else if (this.config.dataType === 'json') res = JSON.stringify(this.config.data)
    }

    this.config.finalData = res
    return res;
  }

  /**
   * 将对象转换为 FormData对象
   */
  urlencodedParse(): FormData {
    let formData: FormData = new FormData()
    let keys: string[] = Object.keys(this.config.data)
    keys.forEach((key: string) => {
      formData.append(key, this.config.data[key])
    })
    return formData
  }

  // 处理请求头
  processReqHeader() {
    switch (this.config.dataType) {
      case "json":
        this.config.headers["Content-Type"] = 'application/json'
        return
    }
  }

  // 配置解析
  configParse(conf: RequestCfg): void {
    let keys: string[] = Object.keys(this.defaults),
        processedConfig: RequestCfg = conf
    keys.forEach(key => {
      let item = this.defaults[key],
          confItem = conf[key];

      if (confItem == null)
        confItem = item
      else if (typeof confItem === 'object' && !(confItem instanceof FormData))
        confItem = {...confItem, ...item}

      processedConfig[key] = confItem
    })

    let xhr: XMLHttpRequest = new XMLHttpRequest()
    xhr.responseType = conf.responseType
    xhr.timeout = conf.timeout

    processedConfig["xhr"] = xhr
    this.config = processedConfig as FullRequestCfg
  }

  // 发送请求
  send(conf: RequestCfg) {
    this.configParse(conf)
    this.paramsHandle()

    this.config.xhr.open(this.config.method, this.config["finalUrl"])
    if (Object.keys(this.config.data).length > 0)
      this.dataHandle()

    this.headerHandle()
    this.processedResponseHandle()
    this.config.xhr.send(this.config.finalData)
  }

  // 设置请求头
  headerHandle() {
    let xhr = this.config.xhr
    this.processReqHeader()
    for (let key in this.config.headers) {
      let val = this.config.headers[key]
      xhr.setRequestHeader(key, val)
    }
  }

  processedResponseHandle() {
  }

  abstract request(conf: NetworkCfg): Promise<Response>

  abstract createHttp(): Http

  abstract requestFail(conf: FullRequestCfg)

  abstract requestSuccess(conf: FullRequestCfg): Response
}
