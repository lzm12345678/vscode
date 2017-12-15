import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ProxyService } from "../../proxy.service";
import {Result} from "../../models/result";

@Injectable()
export class LoginService {

    constructor(
        private $proxy: ProxyService,
        private $http: HttpClient
    ) { }

    /**
     * 登录
     * @param {string} userCode
     * @param {string} password
     * @param {string} imageCode
     * @param {string} imageKey
     * @returns {Promise<any>}
     */
    public login(userCode: string, password: string, imageCode: string, imageKey: string) {
        let isTimeOut = true;
        return new Promise((resolve, reject) => {
            let body = { userCode, password, imageCode, imageKey };
            this.$http.post(`/itom/login`, body).subscribe((result: Result) => {
                if (result.code === 0) {
                    let Authorization = result.data['Authorization'];
                    sessionStorage.setItem('authorization', Authorization);
                    isTimeOut = false;
                    resolve(result.data.user);
                } else {
                    isTimeOut = false;
                    reject(result.msg);
                }
            });
            setTimeout(() => {
                if (isTimeOut) {
                    reject('登录超时，请稍后再试~');
                }
            }, 15000);
        });
    }

}
