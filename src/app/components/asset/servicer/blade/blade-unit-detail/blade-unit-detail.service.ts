import { Injectable } from '@angular/core'
import { ProxyService } from "../../../../../proxy.service";

@Injectable()
export class BladeUnitDetailService {
    constructor(
        private $proxy: ProxyService
    ) {  }

    /**
     * 获取服务器信息
     * @param {number} roomId
     * @param callback
     */
    public getUnitDetailById(serverId: string, callback) {
        this.$proxy.get(`/itm/bladeUnit/${serverId}`, callback);
    }

    /**
     * 新增服务器信息
     * @param serverInfo
     * @param callback
     */
    public createServerInfo(serverInfo, callback) {
        this.$proxy.post(`/itm/bladeUnit`, serverInfo, callback);
    }

    /**
     * 修改服务器信息
     * @param serverInfo
     * @param callback
     */
    public modifyServerInfo(serverInfo, callback) {
        this.$proxy.put(`/itm/bladeUnit`, serverInfo, callback);
    }

    /**
     * 获取硬件信息
     * @param {number} roomId
     * @param callback
     */
    public getHardwareById(serverId: number, callback) {
        this.$proxy.get(`/itm/bladeUnit/hardware/${serverId}`, callback);
    }

    /**
     * 获取所有品牌
     */
    public getAllBrand(callback) {
        this.$proxy.get(`/itm/brand/1/100/`, callback);
    }

    /**
     * 获取所有系列
     * @param {number} parentId
     * @param callback
     */
    public getAllSeries(parentId: number, callback) {
        this.$proxy.get(`/itm/series/1/100/${parentId}`, callback);
    }

    /**
     * 获取所有型号
     * @param {number} parentId
     * @param callback
     */
    public getAllVersion(callback) {
        this.$proxy.get(`/itm/model`, callback);
    }

    /**
     * 查询所有责任人
     */
    public getAllUser(callback) {
        this.$proxy.get(`/itm/users/${100}/${1}`, callback);
    }

    /**
     * 获取所有机房
     * @param callback
     */
    public getAllRoom(callback) {
        this.$proxy.get(`/itm/rooms`, callback);
    }

    /**
     * 获取某一机房下所有机柜
     * @param {number} roomId
     * @param callback
     */
    public getCabinetById(roomId: string, callback) {
        this.$proxy.get(`/itm/rooms/queryRoom/${roomId}`, callback);
    }

    /**
     * 获取机柜下的所有可用U位
     * @param {number} cabinetId
     * @param {Function} callback
     */
    public getAbleStartUs(u: number, cabinetId: string, callback: Function) {
        this.$proxy.get(`/itm/cabinet/queryCabinetU/${u}/${cabinetId}`, callback);
    }

    /**
     * 获取刀片服务器槽位数
     * @param {number} body { bladeServerId, serverId}
     * @param {Function} callback
     */
    public getSlots(body, callback: Function) {
        this.$proxy.post(`/itm/bladeServer/slot`, body, callback);
    }
}
