/**
 * Created by WH1709055 on  2017/11/14 13:32
 */

import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {ProxyService} from "../../../../../proxy.service";
import { Result } from "../../../../../models/result"
@Injectable()
export class VersionDetailService {
    constructor(
        private $proxy: ProxyService,
        private $http: HttpClient
    ) {
    }

    /**
     * 查询型号详情
     * @param id
     * @param callback
     */
    public getVersionById(id, callback) {
        this.$proxy.get(`/itm/model/${id}`, callback);
    }

    public saveVersion(body) {
        // this.$proxy.put(`/itm/model`, body, callback);
        return new Promise((resolve, reject) => {
            this.$http.put(`/itom/model`, body).subscribe((result: Result) => {
                if (result.code === 0) {
                    resolve(result.data);
                } else {
                    reject(result.msg);
                }
            });
        });
    }

    public addVersion(body) {
        // this.$proxy.post(`/itm/model`, body, callback);
        return new Promise((resolve, reject) => {
            this.$http.post(`/itom/model`, body).subscribe((result: Result) => {
                if (result.code === 0) {
                    resolve(result.data);
                } else {
                    reject(result.msg);
                }
            });
        });
    }

    /**
     * 验证模型名是否已存在
     * @param id
     * @param modelName
     * @returns {Promise<any>}
     */
    public validateModelNameDulp(id, modelName) {
        return new Promise((resolve, reject) => {
            this.$http.post(`/itom/model/validate`, { id, modelName }).subscribe((result: Result) => {
                if (result.code === 0) {
                    resolve(result);
                } else {
                    reject(result);
                }
            });
        });
    }
}


