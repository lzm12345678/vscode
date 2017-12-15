/**
 * Created by WH1711028 on  2017/11/22
 */

import { Injectable } from '@angular/core';
import { ProxyService } from "../../../../../../proxy.service";

@Injectable()
export class UnitAlarmListService {
    constructor(private $proxy: ProxyService) {

    }

    /**
     * 获取告警列表
     * @param param
     * @param {Function} callback
     */
    public getAlarmList(pageNum, pageSize, alarmSource, callback: Function) {
        this.$proxy.post(`/itm/alarm/listByServer`, { alarmSource, pageSize, pageNum }, callback);
    }
}
