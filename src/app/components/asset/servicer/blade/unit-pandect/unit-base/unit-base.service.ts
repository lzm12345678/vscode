/**
 * Created by WH1711028 on  2017/11/20
 */


import { Injectable } from '@angular/core'
import { ProxyService } from "../../../../../../proxy.service";

@Injectable()
export class UnitBaseService {
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
        this.$proxy.get(`/itm/bladeUnit/${serverId}`, callback);
    }
}




