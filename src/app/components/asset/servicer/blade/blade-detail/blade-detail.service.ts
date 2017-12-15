import { Injectable } from '@angular/core'
import { ProxyService } from "../../../../../proxy.service";

@Injectable()
export class BladeDetailService {
    constructor(
        private $proxy: ProxyService
    ) {}

    /**
     * 查看刀片服务器详情
     * @param {string} bladeServerId
     * @param {Function} callback
     */
    getBladeDetail(bladeServerId: string, callback: Function) {
        this.$proxy.get(`/itm/bladeServer/${bladeServerId}`, callback);
    }

    /**
     * 新增刀片服务器
     * @param {any} body
     * @param {Function} callback
     */
    addBladeSever(body: any, callback: Function) {
        this.$proxy.post(`/itm/bladeServer`, body, callback);
    }

    /**
     * 修改刀片服务器信息
     * @param {any} body
     * @param {Function} callback
     */
    updateBladeSever(body: any, callback: Function) {
        this.$proxy.put(`/itm/bladeServer`, body, callback);
    }

    /**
     * 新增服务器信息
     * @param serverInfo
     * @param callback
     */
    public createServerInfo(serverInfo, callback) {
        this.$proxy.post(`/itm/bsserver/insert`, serverInfo, callback);
    }

    /**
     * 修改服务器信息
     * @param serverInfo
     * @param callback
     */
    public modifyServerInfo(serverInfo, callback) {
        this.$proxy.put(`/itm/bsserver/update`, serverInfo, callback);
    }

    /**
     * 获取硬件信息
     * @param {number} roomId
     * @param callback
     */
    public getHardwareById(roomId: number, callback) {
        this.$proxy.get(`/itm/bsserver/queryServerInfo?bmcIp=${roomId}`, callback);
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
     * @param callback
     */
    public getAllVersion(callback) {
        this.$proxy.get(`/itm/model`, callback);
    }

    /**
     * 获取所有责任人
     * @param callback
     */
    public getAllUser(callback) {
        this.$proxy.get(`/itm/users`, callback);
    }

    /**
     * 获取所有机房
     * @param callback
     */
    public getAllRoom(callback) {
        this.$proxy.get(`/itm/rooms`, callback);
    }

    /**
     * 根据机房id查机柜
     * @param callback
     */
    public getCabinets(roomId: string, callback) {
        this.$proxy.get(`/itm/rooms/queryRoom/${roomId}`, callback);
    }

    /**
     * 获取可选U位列表
     * @param body
     * @param callback
     */
    public getPosUList(body, callback) {
        this.$proxy.post(`/itm/cabinet/queryCabinetU`, body, callback);
    }

    /**
     * 批量删除单元服务器信息
     * @param {string[]} ids
     * @param callback
     */
    public deleteUnitSevers(ids: string[], callback) {
        let str = '';
        ids.forEach((item, index) => {
            str += item;
            if (index !== ids.length - 1) {
                str += '-';
            }
        });
        console.log(str);
        this.$proxy.delete(`/itm/bladeUnit/${str}`, callback);
    }

}
