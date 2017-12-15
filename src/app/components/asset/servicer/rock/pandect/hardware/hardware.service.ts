/**
 * Created by WH1709055 on  2017/11/16 13:53
 */

import { Injectable } from '@angular/core'
import { ProxyService } from "../../../../../../proxy.service";

@Injectable()
export class HardwareService {
    constructor(
        private $proxy: ProxyService
    ) {  }

    /**
     * 获取服务器硬件信息
     * @param {string} serverId
     * @param {Function} callback
     */
    public getServerHardwareInfo(serverId: string, callback: Function) {
        this.$proxy.get(`/itm/bsserver/queryServerInfo/${serverId}`, callback);
    }
}



