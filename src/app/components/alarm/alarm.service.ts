import { Injectable } from '@angular/core';
import { Result, Brand, Series, Version} from "../../models";
import { ProxyService } from "../../proxy.service";
import {AlarmProxyService} from "../../alram-proxy.service";
@Injectable()
export class AlarmService {
    constructor(private $proxy: AlarmProxyService) {
    }

    /**
     *
     * 获取当前告警
     * {"pageSize":2,"pageNum":1,"queryTerm":{"roleName":"admin"},"sortItem":"role_name","sortWay":"1"}
     * @param pageSize
     * @param pageIndex
     * @param callback
     */
    public getCurrentAlarm (body,callback){
        this.$proxy.post(`/itm/alarm/current/list`,body,e=>{
            callback(e)
        })
    }

    /**
     * 获取历史告警
     * @param pageSize
     * @param pageIndex
     * @param callback
     */
    public getHistoryAlarm(body,callback){
        this.$proxy.post(`/itm/alarm/history/list`,body,e=>{
            callback(e)
        })
    }

    /**
     * 单个清除告警
     * @param alarmId
     * @param callback
     */
    public cleanAlarm(alarmId,callback){
        this.$proxy.put(`/itm/alarm/clean/${alarmId}`,{},e=>{
            callback(e)
        })

    }

    /**
     * 批量清除告警
     * @param body
     * @param callback
     */
    public cleanAlarmAll(body,callback){
        this.$proxy.put(`/itm/alarm/clean`,body,e=>{
            callback(e)
        })
    }

    /**
     * 单个确认告警
     * @param alarmId
     * @param callback
     */
    public confirmAlarm(alarmId,alarmStatus,callback){
        this.$proxy.put(`/itm/alarm/confirm/${alarmId}/${alarmStatus}`,{},e=>{
            callback(e)
        })
    }

    /**
     * 批量确认告警
     * @param body
     * @param callback
     */
    public confirmAlarmAll(alarmStatus,body,callback){
        this.$proxy.put(`/itm/alarm/confirm/${alarmStatus}`,body,e=>{
            callback(e)
        })
    }
}
