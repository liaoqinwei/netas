import Http from "./http";
import { FullRequestCfg, NetworkCfg, RequestCfg, Response } from "../conf/conf";
import AbstractHttp from "./abstractHttp";
export default class HttpRequest extends AbstractHttp {
    defaults: NetworkCfg;
    config: FullRequestCfg;
    request(conf: RequestCfg): Promise<Response>;
    createHttp(): Http;
    requestFail(conf: FullRequestCfg): Response;
    requestSuccess(conf: FullRequestCfg): Response;
}
