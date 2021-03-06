import Http from './http'
import {FullRequestCfg, NetasCfg, RequestCfg, requestType, Response} from "../type/conf"

export default abstract class AbstractHttp implements Http {
  abstract defaults: NetasCfg
  abstract config: FullRequestCfg
  static XMLHttpRequest
  static FormData

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

    if (!(res instanceof AbstractHttp.FormData)) {
      if (this.config.dataType === 'multipart') res = this.urlencodedParse()
      else if (this.config.dataType === 'json') res = JSON.stringify(this.config.data)
    }
    this.config.finalData = res

    return res;
  }

  /**
   * 将对象转换为 FormData对象
   */
  urlencodedParse(): FormData {
    let formData: FormData = new AbstractHttp.FormData()
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
      case "":
        this.config.headers["Content-Type"] = "text/plain"
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
      else if (typeof confItem === 'object' && !(confItem instanceof AbstractHttp.FormData))
        confItem = {...confItem, ...item}

      processedConfig[key] = confItem
    })

    let xhr: XMLHttpRequest = new AbstractHttp.XMLHttpRequest()
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

  abstract request(conf: NetasCfg): Promise<Response>

  abstract createHttp(): Http

  abstract requestFail(conf: FullRequestCfg)

  abstract requestSuccess(conf: FullRequestCfg): Response
}
