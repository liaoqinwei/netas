import {FullRequestCfg, NetworkCfg} from "../type/conf";
import {Response} from "../type/conf";

// @ts-ignore
export default interface Http {
  // 默认配置
  defaults: NetworkCfg

  config:FullRequestCfg

  // 请求函数
  request(conf: NetworkCfg): Promise<Response>

  // 创建http对象
  createHttp(): Http

  // 请求错误时
  requestFail(conf:FullRequestCfg)

  // 请求成功
  requestSuccess(conf:FullRequestCfg): Response
}

