/**
 * Created by GyjLoveLh on  2017/12/13
 */
import { ServicerInterface } from "./servicer.interface"
import { Injectable, Inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { EntitiesResult, Result} from "../Result";
import { Servicer } from "./servicer.model";

@Injectable()
export class ServicerService implements ServicerInterface {
    prefixUrl: string;
    constructor(
        private $http: HttpClient,
        @Inject('apiUrl') private api
    ) {
        this.prefixUrl = `${api}/bsserver`
    }

    /**
     *
     * @override
     * @param page
     * @param search
     * @param sortMap
     * @returns {Promise<Result<EntitiesResult<Servicer>>>}
     */
    getServicerPagination(page, search, sortMap): Promise<Result<EntitiesResult<Servicer>>> {
        let body = Object.create({});
        body.pageNum = page.pageIndex;
        body.pageSize = page.pageSize;
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
        return new Promise((resolve, reject) => {
            this.$http.post(`${this.prefixUrl}`, body).subscribe((result: Result<EntitiesResult<Servicer>>) => {
                result.code === 0 ? resolve(result) : reject(result);
            });
        });
    }

    /**
     * 服务器上架
     * @override
     * @param body
     * @returns {Promise<any>}
     */
    onShelves(body): Promise<Result<any>> {
        return new Promise((resolve, reject) => {
            let { serverId, computerRoomId, cabinetId, startU } = body;
            this.$http.post(`/itom/bsserver/bsShelvesInsert`, { serverId, computerRoomId, cabinetId, startU })
                .subscribe((result: Result<any>) => {
                    result.code === 0 ? resolve(result) : reject(result);
                });
        });
    }

    /**
     * 服务器下架
     * @param {string} serverId
     * @returns {Promise<any>}
     */
    offShelves(serverId: string): Promise<Result<any>> {
        return new Promise((resolve, reject) => {
            this.$http.delete(`/itom/bsserver/bsShelvesDelete?bsshelvesId=${serverId}`)
                .subscribe((result: Result<any>) => {
                    result.code === 0 ? resolve(result) : reject(result);
                });
        });
    }

    /**
     * 新增服务器
     * @param {Servicer} servicer
     * @returns {Promise<Result<any>>}
     */
    insertServicer(servicer: Servicer): Promise<Result<any>> {
        return new Promise((resolve, reject) => {
            this.$http.post(`${this.prefixUrl}/insert`, servicer).subscribe((result: Result<any>) => {
                result.code === 0 ? resolve(result) : reject(result);
            });
        });
    }

    /**
     * 校验ip是否唯一
     * @param serverId
     * @param serverIp
     * @returns {Promise<Result<any>>}
     */
    validateIpDuplicated(serverId, serverIp): Promise<Result<any>> {
        return new Promise((resolve, reject) => {
            this.$http
                .get(`${this.prefixUrl}/isExistenceByIp?id=${serverId}&ip=${serverIp}`)
                .subscribe((result: Result<any>) => {
                    result.code === 0 ? resolve(result) : reject(result);
            });
        });
    }

    /**
     * 校验服务器名称是否唯一
     * @param serverId
     * @param serverName
     * @returns {Promise<Result<any>>}
     */
    validateServerNameDuplicated(serverId, serverName): Promise<Result<any>> {
        return new Promise((resolve, reject) => {
            this.$http.post(`${this.prefixUrl}/isExistenceByName`, { serverId, serverName })
                .subscribe((result: Result<any>) => {
                    result.code === 0 ? resolve(result) : reject(result);
                });
        });
    }

    /**
     * 批量删除服务器
     * @param {string[]} ids
     * @returns {Promise<any>}
     */
    deleteServers(ids: string[]): Promise<Result<any>> {
        let str = '';
        ids.forEach((item, index) => {
            str += item;
            if (index !== ids.length - 1) {
                str += '-';
            }
        });
        return new Promise((resolve, reject) => {
            this.$http.delete(`${this.prefixUrl}/${str}`).subscribe((result: Result<any>) => {
                result.code === 0 ? resolve(result) : reject(result);
            });
        });
    }

    /**
     * 根据id获取服务器详情
     * @param {string} serverId
     * @returns {Promise<Result<Servicer>>}
     */
    getServiceById(serverId: string): Promise<Result<Servicer>> {
        return new Promise((resolve, reject) => {
            this.$http.get(`${this.prefixUrl}/${serverId}`).subscribe((result: Result<Servicer>) => {
                result.code === 0 ? resolve(result) : reject(result);
            });
        });
    }

    /**
     * 修改服务器信息
     * @param {Servicer} servicer
     * @returns {Promise<any>}
     */
    modifyService(servicer: Servicer): Promise<Result<any>> {
        return new Promise((resolve, reject) => {
            this.$http.put(`${this.prefixUrl}/update`, servicer).subscribe((result: Result<any>) => {
                result.code === 0 ? resolve(result) : reject(result);
            });
        });
    }
}
