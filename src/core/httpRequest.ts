import Http from "./http";
import {FullRequestCfg, NetworkCfg, RequestCfg, Response} from "../type/conf";
import AbstractHttp from "./abstractHttp";

export default class HttpRequest extends AbstractHttp {
  // default config
  defaults: NetworkCfg = {
    baseUrl: '',
    headers: {},
    data: {},
    cache: true,
    params: {},
    dataType: 'json',
    method: 'get',
    timeout: 1000 * 10,
    responseType: 'json'
  }
  config: FullRequestCfg = {url: ''}

  // 请求
  request(conf: RequestCfg): Promise<Response> {
    // 合并url 和 处理参数
    if (conf.url === '' || conf.url == null) throw new Error('必须传入一个请求地址');
    this.send(conf)
    conf = this.config
    let xhr = this.config.xhr
    return new Promise<Response>((resolve, reject) => {
      xhr.onreadystatechange = () => {
        // 请求已经回来
        if (xhr.readyState === 4) {
          let code = xhr.status
          // 成功
          if (/^[2|3][\d]{2}/.test(code.toString())) resolve(this.requestSuccess(conf))
          else reject(this.requestFail(conf))
        }
      }
      // 发生错误
      xhr.onerror = (ev:any) => reject(this.requestFail(ev))
      xhr.ontimeout = (ev:any) => reject(this.requestFail(ev))
    })
  }

  // 可以返回一个新的请求对象
  createHttp(): Http {
    return new HttpRequest();
  }

  // 响应失败
  requestFail(conf: FullRequestCfg) {
    let xhr = conf.xhr
    return {
      code: xhr.status,
      xhr
    }
  }

  // 响应成功
  requestSuccess(conf: FullRequestCfg): Response {
    let res: Response
    let status: number = conf.xhr.status,
        data: any = conf.xhr.response,
        headers: string = conf.xhr.getAllResponseHeaders(),
        reason: string = conf.xhr.statusText,
        url: string = conf.finalUrl,
        headerMap = {}

    let headerList = headers.trim().split(/(?:\r\n)|(?:: )/)
    for (let i = 0; i < headerList.length; i += 2) {
      headerMap[headerList[i]] = headerList[i + 1]
    }
    res = {status, data, reason, url, headers: headerMap}
    return res
  }
}