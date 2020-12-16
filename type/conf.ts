// 配置
export type responseType = '' | 'arraybuffer' | 'blob' | 'json' | 'text' | 'document'
export type dataType = 'json' | 'urlencode' | ''
export type requestType = string | FormData

export interface NetworkCfg {
  baseUrl?: string
  headers?: object
  data?: requestType|object
  params?: object
  dataType?: dataType
  method?: 'get' | 'head' | 'options' | 'trace' | 'post' | 'put' | 'delete'
  timeout?: number
  cache?: boolean
  responseType?: responseType
}

// 用户请求时的类型定义
export interface RequestCfg extends NetworkCfg {
  url: string
}

export interface FullRequestCfg extends RequestCfg {
  finalUrl?: string
  xhr?: XMLHttpRequest
  finalData?: requestType
}

// 响应
export interface Response {
  readonly url: string
  readonly status: number
  readonly reason: string
  readonly data: any
  // @ts-ignore
  readonly headers: object
}
