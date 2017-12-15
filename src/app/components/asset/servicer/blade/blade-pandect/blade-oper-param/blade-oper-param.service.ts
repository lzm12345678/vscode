/**
 * Created by WH1711028 on  2017/11/20
 */

import { Injectable } from '@angular/core'
import { ProxyService } from "../../../../../../proxy.service";

@Injectable()
export class BladeOperParamService {
    constructor(
        private $proxy: ProxyService
    ) {  }

    /**
     * 获取运行参数
     * @param {string} serverId
     * @param {Function} callback
     */
    public getRunParam(serverId: string, callback: Function) {
        this.$proxy.get(`/itm/getRunParam/${serverId}`, callback);
    }
}




