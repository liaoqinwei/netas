import AbstractHttp from "./abstractHttp";
export default class HttpRequest extends AbstractHttp {
    constructor() {
        super(...arguments);
        this.defaults = {
            baseUrl: '',
            headers: {},
            data: {},
            cache: true,
            params: {},
            dataType: 'json',
            method: 'get',
            timeout: 1000 * 10,
            responseType: 'json'
        };
        this.config = { url: '' };
    }
    // 请求
    request(conf) {
        // 合并url 和 处理参数
        if (conf.url === '' || conf.url == null)
            throw new Error('必须传入一个请求地址');
        this.send(conf);
        conf = this.config;
        let xhr = this.config.xhr;
        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                // 请求已经回来
                if (xhr.readyState === 4) {
                    let code = xhr.status;
                    // 成功
                    if (/^[2|3].{2}/.test(code.toString())) {
                        resolve(this.requestSuccess(conf));
                    }
                    else {
                        // 失败
                        reject(this.requestFail(conf));
                    }
                }
            };
            // 发生错误
            xhr.onerror = (ev) => {
                reject(ev);
            };
        });
    }
    // 可以返回一个新的请求对象
    createHttp() {
        return new HttpRequest();
    }
    // 响应失败
    requestFail(conf) {
        let res;
        let status = conf.xhr.status, data = conf.xhr.response, headers = conf.xhr.getAllResponseHeaders(), reason = conf.xhr.statusText, url = conf.finalUrl, headerMap = {};
        if (headers !== '') {
            let headerList = headers.trim().split('\n\r');
            for (let i = 0; i < headerList.length; i += 2) {
                headerMap[headerList[i]] = headerList[i + 1];
            }
        }
        res = { status, data, reason, url, headers: headerMap };
        return res;
    }
    // 响应成功
    requestSuccess(conf) {
        let res;
        let status = conf.xhr.status, data = conf.xhr.response, headers = conf.xhr.getAllResponseHeaders(), reason = conf.xhr.statusText, url = conf.finalUrl, headerMap = {};
        let headerList = headers.trim().split('\n\r');
        for (let i = 0; i < headerList.length; i += 2) {
            headerMap[headerList[i]] = headerList[i + 1];
        }
        res = { status, data, reason, url, headers: headerMap };
        return res;
    }
}
