import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ProxyService } from "../../../../proxy.service";

@Injectable()
export class RockService {
    constructor(
        private $proxy: ProxyService,
        private $http: HttpClient
    ) {

    }

    /**
     * 分页获取服务器信息
     * @param {number} pageIndex
     * @param {number} pageSize
     * @param search
     * @param callback
     */
    public getRockByField(pageIndex: number, pageSize: number, search, sortMap, callback: Function) {
        let body = Object.create({});
        body.pageNum = pageIndex;
        body.pageSize = pageSize;
        let queryTerm = {};
        for (let key in search) {
            if (key && search[key] && search[key].length !== 0) {
                queryTerm[key] = search[key];
            }
        }
        body.queryTerm = queryTerm;
        if (sortMap.sortWay !== -1) {
            let { sortItem, sortWay } = sortMap;
            body = Object.assign(body, { sortItem, sortWay });
        }
        console.log(body);
        this.$proxy.post(`/itm/bsserver`, body, callback);
    }

    /**
     * 同步服务器
     * @param {string[]} ids
     * @param {Function} callback
     */
    public synchronization(ids: string[], callback: Function) {
        this.$http.post(`/itom/syncServer`, ids).subscribe(result => {
            callback(result);
        });
    }

    /**
     * 批量删除服务器信息
     * @param {string[]} ids
     * @param callback
     */
    public deleteServers(ids: string[], callback) {
        let str = '';
        ids.forEach((item, index) => {
            str += item;
            if (index !== ids.length - 1) {
                str += '-';
            }
        });
        this.$proxy.delete(`/itm/bsserver/${str}`, callback);
    }

    /**
     * 下架
     * @param {number} id
     * @param {Function} callback
     */
    public offShelves(id: string, callback: Function) {
        let uri = `/itm/bsserver/bsShelvesDelete?bsshelvesId=${id}`;
        console.log(uri);
        this.$proxy.delete(uri, callback);
    }

    /**
     * 上架
     * @param {number} bserverId
     * @param {{computerRoomId: number; cabinetId: number; startU: number}} position
     * @param {Function} callback
     */
    public onShelves(shelfData, callback: Function) {
        let { serverId, computerRoomId, cabinetId, startU } = shelfData;
        this.$proxy.post(`/itm/bsserver/bsShelvesInsert`, { serverId, computerRoomId, cabinetId, startU }, callback);
    }

    /**
     * 获取所有机房
     * @param callback
     */
    public getAllRoom(callback) {
        this.$proxy.get(`/itm/rooms`, callback);
    }

    /**
     * 查询所有责任人
     */
    public getAllUser(callback) {
        this.$proxy.get(`/itm/users/${100}/${1}`, callback);
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
    public getAllSeries(parentId: string, callback) {
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
     * 获取机房下所有的机柜
     * @param {number} roomId
     * @param callback
     */
    public getAllCabinet(roomId: string, callback) {
        this.$proxy.get(`/itm/rooms/queryRoom/${roomId}`, callback);
    }

    /**
     * 获取机柜下的所有可用U位
     * @param {number} cabinetId
     * @param {Function} callback
     */
    public getUnuseStartUs(serverId: string, standard: number, cabinetId: string, callback: Function) {
        this.$proxy.post(`/itm/cabinet/queryCabinetU`, {serverId, standard, cabinetId}, callback);
    }

    public getAllStartUs(cabinetId: string, callback: Function) {
        this.$proxy.get(`/itm/cabinet/queryCabinetAllU/${cabinetId}`, callback);
    }
}



