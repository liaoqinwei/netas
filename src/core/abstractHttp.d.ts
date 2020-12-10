import Http from './http';
import { FullRequestCfg, NetworkCfg, RequestCfg, requestType, Response } from "../conf/conf";
export default abstract class AbstractHttp implements Http {
    abstract defaults: NetworkCfg;
    abstract config: FullRequestCfg;
    /**
     * 将传入的 url 和 baseUrl合并
     */
    mergeUrl(): string;
    /**
     * 将传入的 url 参数进行合并
     */
    paramsHandle(): string;
    /**
     * 处理 data 为 formData / json
     */
    dataHandle(): requestType;
    /**
     * 将对象转换为 FormData对象
     */
    urlencodedParse(): FormData;
    headerParse(): void;
    configParse(conf: RequestCfg): void;
    send(conf: RequestCfg): void;
    headerHandle(): void;
    overrideMimeType(): void;
    processedResponseHandle(): void;
    abstract request(conf: NetworkCfg): Promise<Response>;
    abstract createHttp(): Http;
    abstract requestFail(conf: FullRequestCfg): Response;
    abstract requestSuccess(conf: FullRequestCfg): Response;
}
