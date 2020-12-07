export declare type responseType = '' | 'arraybuffer' | 'blob' | 'json' | 'text' | 'document';
export declare type dataType = 'json' | 'urlencode' | '';
export declare type requestType = string | FormData;
export interface NetworkCfg {
    baseUrl?: string;
    headers?: object;
    data?: object;
    params?: object;
    dataType?: dataType;
    method?: 'get' | 'head' | 'options' | 'trace' | 'post' | 'put' | 'delete';
    timeout?: number;
    cache?: boolean;
    responseType?: responseType;
}
export interface RequestCfg extends NetworkCfg {
    url: string;
}
export interface FullRequestCfg extends RequestCfg {
    finalUrl?: string;
    xhr?: XMLHttpRequest;
    finalData?: requestType;
}
export interface Response {
    readonly url: string;
    readonly status: number;
    readonly reason: string;
    readonly data: any;
    readonly headers: object;
}
