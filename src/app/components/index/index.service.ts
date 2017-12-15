/**
 * Created by WH1711028 on  2017/11/28
 */

import { Injectable } from '@angular/core';
import { ProxyService } from "../../proxy.service";

@Injectable()
export class IndexService {
    constructor(
        private $proxy: ProxyService
    ) {

    }

    /**
     * 获取告警列表数据
     * @param {any} body {pageSize, pageNum}
     * @param {Function} callback
     */
    public getAlarmData(body, callback: Function) {
        this.$proxy.post(`/itm/alarm/current/list`, body, callback);
    }

    /**
     * 单个确认告警
     * @param alarmId
     * @param callback
     */
    public confirmAlarm(alarmId, alarmStatus, callback) {
        if (!alarmStatus) {
            alarmStatus = 0;
        }
        this.$proxy.put(`/itm/alarm/confirm/${alarmId}/${alarmStatus}`, {}, e => {
            callback(e)
        })
    }

    /**
     * 单个清除告警
     * @param alarmId
     * @param callback
     */
    public cleanAlarm(alarmId, callback) {
        this.$proxy.put(`/itm/alarm/clean/${alarmId}`, {}, e => {
            callback(e)
        })

    }

}
