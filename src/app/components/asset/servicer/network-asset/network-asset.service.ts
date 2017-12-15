import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ProxyService } from "../../../../proxy.service";

@Injectable()
export class NetworkAssetService {
    constructor(
        private $proxy: ProxyService,
        private $http: HttpClient
    ) {  }

    /**
     * 查询所有责任人
     */
    public getAllUser(callback) {
        this.$proxy.get(`/itm/users/${100}/${1}`, callback);
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
     * 获取机柜下所有的u位
     * @param cabinetId 
     * @param callback 
     */
    public getAllStartUs(cabinetId: string, callback: Function) {
        this.$proxy.get(`/itm/cabinet/queryCabinetAllU/${cabinetId}`, callback);
    }

    /**
     * 分页获取服务器信息
     * @param {number} pageIndex
     * @param {number} pageSize
     * @param search
     * @param callback
     */
    public getNetworkByField(pageIndex: number, pageSize: number, search, sortMap, callback: Function) {
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

    
}



