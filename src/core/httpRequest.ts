import Http from "./http";
import {FullRequestCfg, NetworkCfg, RequestCfg, Response} from "../conf/conf";
import AbstractHttp from "./abstractHttp";

export default class HttpRequest extends AbstractHttp {
  defaults: NetworkCfg = {
    baseUrl: '',
    headers: {},
    data: {},
    catch: true,
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
          if (/^[2|3].{2}/.test(code.toString())) {
            resolve(this.requestSuccess(conf))
          } else {
            // 失败
            reject(this.requestFail(conf))
          }
        }
      }
      // 发生错误
      xhr.onerror = (ev) => {
        reject(ev)
      }
    })
  }

  // 可以返回一个新的请求对象
  createHttp(): Http {
    return new HttpRequest();
  }

  requestFail(conf: FullRequestCfg): Response {
    let res: Response
    let status = conf.xhr.status,
        data = conf.xhr.response,
        headers = conf.xhr.getAllResponseHeaders(),
        reason = conf.xhr.statusText,
        url = conf.finalUrl,
        headerMap = {}
    let headerList = headers.trim().split('\n\r')
    for (let i = 0; i < headerList.length; i += 2) {
      headerMap[headerList[i]] = headerList[i + 1]
    }
    res = {status, data, reason, url, headers: headerMap}
    return res
  }

  requestSuccess(conf: FullRequestCfg): Response {
    let res: Response
    let status = conf.xhr.status,
        data = conf.xhr.response,
        headers = conf.xhr.getAllResponseHeaders(),
        reason = conf.xhr.statusText,
        url = conf.finalUrl,
        headerMap = {}
    let headerList = headers.trim().split('\n\r')
    for (let i = 0; i < headerList.length; i += 2) {
      headerMap[headerList[i]] = headerList[i + 1]
    }
    res = {status, data, reason, url, headers: headerMap}
    return res
  }
}