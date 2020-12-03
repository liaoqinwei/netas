import Http from './http'
import {FullRequestCfg, NetworkCfg, RequestCfg, requestType, Response} from "../conf/conf"
import {clone} from "../util/utlil";

export default abstract class AbstractHttp implements Http {
  abstract defaults: NetworkCfg
  abstract config: FullRequestCfg

  /**
   * 将传入的 url 和 baseUrl合并
   */
  mergeUrl(): string {
    let url: string = this.config.url
    if (/^http[s]?:[/]{2}./.test(url)) return url;
    url.indexOf('/') !== 0 ? url = '/' + url : null;
    return this.config.baseUrl + url;
  }

  /**
   * 将传入的 url 参数进行合并
   */
  paramsHandle(): string {
    let url: string
    let paramStr: string = ''
    let res: string

    if (this.config.baseUrl !== '') url = this.mergeUrl();
    // 缓存
    if (this.config.catch) this.config.params['_'] = Date.now()

    for (let key in this.config.params) {
      paramStr += key + '=' + this.config.params[key] + '&'
    }
    url.indexOf('?') === -1 ? url += '?' :
        url[url.length - 1] !== '&' ? paramStr = '&' + paramStr : null

    res = url + paramStr
    this.config["finalUrl"] = res
    return res;
  }

  /**
   * 处理 data 为 formData / json
   */
  dataHandle(): requestType {
    let res: requestType
    if (this.config.dataType === 'urlencode') res = this.urlencodedParse()
    else if (this.config.dataType === 'json') res = JSON.stringify(this.config.data)
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
  headerParse() {
    switch (this.config.dataType) {
      case "json":
        this.config.headers["Content-Type"] = 'application/json'
        break
      case "urlencode":
        this.config.headers["Content-Type"] = 'x-www-form-urlencoded'
        break
    }
  }

  // 配置解析
  configParse(conf: RequestCfg): void {
    let keys: string[] = Object.keys(this.defaults),
        processedConfig: RequestCfg
    keys.forEach(key => {
      let item: NetworkCfg = clone<NetworkCfg>(this.defaults[key], true),
          confItem = conf[key];
      if (confItem == null)
        confItem = item
      else if (typeof confItem === 'object')
        confItem = {...confItem, ...item}
      processedConfig[key] = confItem
    })
    this.config["xhr"] = new XMLHttpRequest()
    this.config = processedConfig
  }

  // 发送请求
  send(conf: RequestCfg) {
    this.configParse(conf)
    this.paramsHandle()
    this.headerHandle()
    this.dataHandle()
    this.processedResponseHandle()
    this.config.xhr.open(this.config.method, this.config["finalUrl"])
    this.config.xhr.send(this.config.finalData)
  }

  // 设置请求头
  headerHandle() {
    let xhr = this.config.xhr
    this.headerParse()
    for (let key in this.config.headers) {
      let val = this.config.headers[key]
      xhr.setRequestHeader(key, val)
    }
  }

  // 重新响应的mime类型
  overrideMimeType() {
    let xhr = this.config.xhr
    switch (this.config.responseType) {
      case "json":
        xhr.overrideMimeType("application/json")
        break
      case "document":
        xhr.overrideMimeType("text/html")
        break
      case "text":
        xhr.overrideMimeType("text/plain")
        break
    }
  }

  processedResponseHandle() {
    this.overrideMimeType()
  }

  abstract request(conf: NetworkCfg): Promise<Response>

  abstract createHttp(): Http

  abstract requestFail(conf: FullRequestCfg): Response

  abstract requestSuccess(conf: FullRequestCfg): Response
}