/**
 * Created by WH1711028 on  2017/11/20
 */

import { Injectable } from '@angular/core'
import { ProxyService } from "../../../../../../proxy.service";


@Injectable()
export class UnitMonitorTaskService {
    constructor(
        private $proxy: ProxyService
    ) {

    }

    /**
     * 获取监控任务列表
     * @param param
     * @param {Function} callback
     */
    public getAllMonitorTask(param, callback: Function) {
        this.$proxy.post(`/itm/monitorTask/queryByEquipment`, param, callback);
    }
}

