/**
 * Created by WH1709055 on  2017/11/16 09:38
 */

import { Injectable } from '@angular/core'
import { ProxyService } from "../../../../../../proxy.service";

@Injectable()
export class OperationParameterService {
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




