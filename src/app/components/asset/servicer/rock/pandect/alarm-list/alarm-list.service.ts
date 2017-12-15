/**
 * Created by WH1709055 on  2017/11/10 14:26
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ProxyService } from "../../../../../../proxy.service";
import {Result} from "../../../../../../models/result";

@Injectable()
export class AlarmListService {
    constructor(
        private $proxy: ProxyService,
        private $http: HttpClient
    ) {}

    /**
     * 获取告警列表
     * @param param
     * @param {Function} callback
     */
    public getAlarmList(pageNum, pageSize, alarmSource, callback: Function) {
        this.$proxy.post(`/itm/alarm/listByServer`, { alarmSource, pageSize, pageNum }, callback);
    }

    /**
     * 获取当前告警
     * @param pageSize
     * @param pageNum
     * @param callback
     */
    public getCurrentAlarm (pageSize, pageNum, callback) {
        this.$proxy.post(`/itm/alarm/current/list`, { pageSize, pageNum }, callback);
    }

    /**
     * 单个确认告警
     * @param alarmId
     * @param callback
     */
    public confirmAlarm(alarmId, alarmStatus) {
        return new Promise((resolve, reject) => {
            this.$http.put(`/itom/alarm/confirm/${alarmId}/${alarmStatus}`, {}).subscribe((result: Result) => {
                if (result.code === 0) {
                    resolve(result.data);
                } else {
                    reject(result.msg);
                }
            });
        });
    }

    /**
     * 单个清除告警
     * @param alarmId
     * @param callback
     */
    public cleanAlarm(alarmId) {
        return new Promise((resolve, reject) => {
            this.$http.put(`/itom/alarm/clean/${alarmId}`, {}).subscribe((result: Result) => {
                if (result.code === 0) {
                    resolve(result.data);
                } else {
                    reject(result.msg);
                }
            });
        });
    }
}
