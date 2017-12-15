import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http'
import {  Result } from "../../../../models";
import {  ProxyService } from "../../../../proxy.service";

@Injectable()
export class BladeService {
    constructor(
        private proxyService: ProxyService
    ) {}

    /**
     * 新增刀片服务器单元
     * @param {any} body
     * @param {Function} callback
     */
    addBladeUnitSever(body: any, callback: Function) {
        this.proxyService.post(`/itm/bladeUnit`, body, callback);
    }

    /**
     * 修改刀片服务器单元信息
     * @param {any} body
     * @param {Function} callback
     */
    updateBladeUnitSever(body: any, callback: Function) {
        this.proxyService.put(`/itm/bladeUnit`, body, callback);
    }

    /**
     * 删除刀片服务器单元
     * @param {string} ids
     * @param {Function} callback
     */
    deleteBladeUnitSever(ids: string, callback: Function) {
        this.proxyService.delete(`/itm/bladeUnit/${ids}`, callback);
    }

    /**
     * 查看刀片服务器单元信息
     * @param {string} id
     * @param {Function} callback
     */
    getBladeUnitServer(id, callback: Function) {
        this.proxyService.get(`/itm/bladeUnit/${id}`, callback);
    }

    /**
     * 获取刀片服务器列表
     * @param {any} body {pageSize,pageNum,queryTerm}
     * @param {Function} callback
     */
    getBladeListServer(body, callback: Function) {
        this.proxyService.post(`/itm/bladeServer/queryAll`, body, callback);
    }
    /**
     * 查看刀片服务器详情
     * @param {string} bladeServerId
     * @param {Function} callback
     */
    getBladeServer(bladeServerId: string, callback: Function) {
        this.proxyService.get(`/itm/bladeServer/${bladeServerId}`, callback);
    }

    /**
     * 修改刀片服务器信息
     * @param {any} body
     * @param {Function} callback
     */
    updateBladeSever(body: any, callback: Function) {
        this.proxyService.put(`/itm/bladeServer`, body, callback);
    }

    /**
     * 删除刀片服务器
     * @param {string} id
     * @param {Function} callback
     */
    deleteBladeSever(id: any, callback: Function) {
        this.proxyService.delete(`/itm/bladeServer/${id}`, callback);
    }

    /**
     * 批量删除刀片服务器信息
     * @param {string[]} ids
     * @param callback
     */
    public deleteBladeSevers(ids: string[], callback) {
        let str = '';
        ids.forEach((item, index) => {
            str += item;
            if (index !== ids.length - 1) {
                str += '-';
            }
        });
        console.log(str);
        this.proxyService.delete(`/itm/bladeServer/${str}`, callback);
    }

    /**
     * 条件查询刀片服务器
     * @param {any} body {pageSize,pageNum,queryTerm}
     * @param {Function} callback
     */
    filterBladeSever(body: any, callback: Function) {
        this.proxyService.post(`/itm/bladeServer/term`, body, callback);
    }

    /**
     * 获取所有型号
     * @param {number} parentId
     * @param callback
     */
    public getAllVersion(callback) {
        this.proxyService.get(`/itm/model`, callback);
    }

    /**
     * 获取所有机房
     * @param callback
     */
    public getRooms(callback) {
        this.proxyService.get(`/itm/rooms`, callback);
    }

    /**
     * 根据机房id查机柜
     * @param callback
     */
    public getCabinets(roomId: string, callback) {
        this.proxyService.get(`/itm/rooms/queryRoom/${roomId}`, callback);
    }


    /**
     * 获取可选U位列表
     * @param body
     * @param callback
     */
    public getPosUList(body, callback) {
        this.proxyService.post(`/itm/cabinet/queryCabinetU`, body, callback);
    }

    /**
     * 根据机柜id查所有U位
     * @param callback
     */
    public getAllU(cabinetId, callback) {
        this.proxyService.get(`/itm/cabinet/queryCabinetAllU/${cabinetId}`, callback);
    }

    /**
     * 查询所有责任人
     */
    public getAllUser(callback) {
        this.proxyService.get(`/itm/users`, callback);
    }

    /**
     * 下架
     * @param {number} id （下架id shelvesId）
     * @param {Function} callback
     */
    public offShelves(id: string, callback: Function) {
        let uri = `/itm/bladeServer/shelves/${id}`;
        console.log(uri);
        this.proxyService.delete(uri, callback);
    }

    /**
     * 上架
     * @param {number} bserverId
     * @param {{computerRoomId: number; cabinetId: number; startU: number}} position
     * @param {Function} callback
     */
    public onShelves(shelfData, callback: Function) {
        let { serverId, computerRoomId, cabinetId, startU } = shelfData;
        this.proxyService.post(`/itm/bladeServer/shelves`, { serverId, computerRoomId, cabinetId, startU }, callback);
    }
}
