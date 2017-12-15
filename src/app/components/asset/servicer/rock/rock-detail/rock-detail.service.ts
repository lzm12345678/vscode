import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ProxyService } from "../../../../../proxy.service";
import {Result} from "../../../../../models/result";

@Injectable()
export class RockDetailService {
    constructor(
        private $http: HttpClient,
        private $proxy: ProxyService
    ) {  }

    /**
     * 获取服务器信息
     * @param {number} roomId
     * @param callback
     */
    public getRockDetailById(serverId: string, callback = null) {
        this.$proxy.get(`/itm/bsserver/${serverId}`, callback);
    }

    /**
     * 新增服务器信息
     * @param serverInfo
     * @param callback
     */
    public createServerInfo(serverInfo, callback = null) {
        // return this.$proxy.post(`/itm/bsserver/insert`, serverInfo);
        return new Promise((resolve, reject) => {
            this.$http.post(`/itom/bsserver/insert`, serverInfo).subscribe((result: Result) => {
                if (result.code === 0 && result.data) {
                    resolve(result);
                } else {
                    reject(result);
                }
            });
        });
    }

    /**
     * 修改服务器信息
     * @param serverInfo
     * @param callback
     */
    public modifyServerInfo(serverInfo, callback = null) {
        // return this.$proxy.put(`/itm/bsserver/update`, serverInfo);
        return new Promise((resolve, reject) => {
            this.$http.put(`/itom/bsserver/update`, serverInfo).subscribe((result: Result) => {
                if (result.code === 0 && result.data) {
                    resolve(result);
                } else {
                    reject(result);
                }
            });
        });
    }


    /**
     * 获取所有型号
     * @param {number} parentId
     * @param callback
     */
    public getAllVersion(callback) {
        if (typeof callback === 'function') {
            this.$proxy.get(`/itm/model`, callback);
        } else {
            return this.$proxy.get(`/itm/model`);
        }
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
    public getAbleStartUs(serverId: string, cabinetId: string, callback: Function) {
        this.$proxy.get(`/itm/cabinet/queryCabinetU/${serverId}/${cabinetId}`, callback);
    }

    /**
     * 获取可用机柜列表
     * @param {string} serverId
     * @param {number} standard
     * @param {string} cabinetId
     * @param callback
     */
    public getUnuseStartUs(serverId: string, standard: number, cabinetId: string, callback) {
        this.$proxy.post(`/itm/cabinet/queryCabinetU`, { serverId, standard, cabinetId }, callback);
    }

    /**
     * 查询ip是否重复
     * @param ip
     * @returns {Promise<any>}
     */
    public validateIpDuplicate(id, ip) {
        // return this.$proxy.get(`/itom/bsserver/isExistenceByIp?id=${id}&ip=${ip}`);
        return new Promise((resolve, reject) => {
            this.$http.get(`/itom/bsserver/isExistenceByIp?id=${id}&ip=${ip}`).subscribe((result: Result) => {
                result.code === 0 ? resolve(result) : reject(result);
            });
        });
    }

    /**
     * 校验服务名称是否重复
     * @param id
     * @param serverName
     * @returns {Promise<any>}
     */
    public validateServerNameDuplicate(id, serverName) {
        return new Promise((resolve, reject) => {
            // this.$http.get(`/itom/bsserver/isExistenceByName?id=${id}&serverName=${serverName}`).subscribe((result: Result) => {
            //     result.code === 0 ? resolve(result) : reject(result);
            // })
            this.$http.post(`/itom/bsserver/isExistenceByName`, { id, serverName })
                .subscribe((result: Result) => {
                    result.code === 0 ? resolve(result) : reject(result);
                });
        });
    }
}
