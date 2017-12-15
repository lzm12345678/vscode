/**
 * Created by WH1711028 on  2017/11/20
 */


import { Injectable } from '@angular/core'
import { ProxyService } from "../../../../../../proxy.service";

@Injectable()
export class BladeBaseService {
    constructor(
        private $proxy: ProxyService
    ) {

    }

    /**
     * 获取服务一般属性
     * @param {string} bladeServerId
     * @param {Function} callback
     */
    public getServerBaseInfo(bladeServerId: string, callback: Function) {
        this.$proxy.get(`/itm/bladeServer/${bladeServerId}`, callback);
    }
}




