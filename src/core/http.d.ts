import { FullRequestCfg, NetworkCfg } from "../conf/conf";
import { Response } from "../conf/conf";
export default interface Http {
    defaults: NetworkCfg;
    config: FullRequestCfg;
    request(conf: NetworkCfg): Promise<Response>;
    createHttp(): Http;
    requestFail(conf: FullRequestCfg): Response;
    requestSuccess(conf: FullRequestCfg): Response;
}
