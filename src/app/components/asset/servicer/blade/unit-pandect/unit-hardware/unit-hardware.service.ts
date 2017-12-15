/**
 * Created by WH1711028 on  2017/11/22
 */

import { Injectable } from '@angular/core'
import { ProxyService } from "../../../../../../proxy.service";

@Injectable()
export class UnitHardwareService {
    constructor(
        private $proxy: ProxyService
    ) {  }

    /**
     * 获取服务器硬件信息
     * @param {string} serverId
     * @param {Function} callback
     */
    public getServerHardwareInfo(serverId: string, callback: Function) {
        this.$proxy.get(`/itm/bladeUnit/hardware/${serverId}`, callback);
    }
}



