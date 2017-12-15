/**
 * Created by WH1709055 on  2017/11/16 17:13
 */


import { Injectable } from '@angular/core'
import { ProxyService } from "../../../../../../proxy.service";

@Injectable()
export class PandectBaseService {
    constructor(
        private $proxy: ProxyService
    ) {

    }

    /**
     * 获取服务一般属性
     * @param {string} serverId
     * @param {Function} callback
     */
    public getServerBaseInfo(serverId: string, callback: Function) {
        this.$proxy.get(`/itm/bsserver/${serverId}`, callback);
    }

    /**
     * 获取模型详情
     * @param {string} modelId
     * @param callback
     */
    public getModelById(modelId: string, callback) {
        this.$proxy.get(`/itm/model/${modelId}`, callback)
    }
}




