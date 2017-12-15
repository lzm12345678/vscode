/**
 * Created by WH1709055 on  2017/11/09 16:16
 */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { Result } from "./models";
import { NzModalService, NzNotificationService } from '_ng-zorro-antd@0.5.5@ng-zorro-antd'

const ERROR_CODE = {
    FAIL: 20101, //  "名称已存在"),
    CodeFAIL: 20102, // "编码已存在"),
    DELETE_ERROR: 20100, // "删除失败"),
    WEAK_NET_WORK: -1, // "网络异常，请稍后重试"),
    PASSWORD_ERROR: 10001, // "用户名或密码错误"),
    PARAMETER_ERROR: 10101, // "参数错误"),
    AUTHENTICATION_FAILED: 9999, //  "认证未通过"),
    UNAUTHORIZED: 10000, //  "未授权"),
    USERNAME_EXIST: 10111, // "用户名已存在"),
    USERCODE_EXIST: 10112, // "用户代码已存在"),
    IMAGECODE_ERROR: 10113, // "验证码错误"),
    IMAGECODE_NULL: 10114, // "验证码不存在"),
    IMAGECODE_TIMEOUT: 10115, // "验证码过期"),
    USERLOGIN: 10116, // "用户在线"),
    KAFKAFAILE: 10117, // "kafka发送信息失败"),
};

@Injectable()
export class ProxyService {
    private isError: boolean = false;

    constructor(
        private $http: HttpClient,
        private $router: Router,
        private $modal: NzModalService
    ) { }


    /**
     * GET请求
     * @param uri
     * @param callback
     * @returns {Promise<any>}
     */
    public get(uri, callback: any = null) {
        uri = this.rePrefix(uri);
        if (typeof callback === 'function') {
            this.$http.get(uri).subscribe((result: Result) => {
                this.validate(result, { method: 'GET', uri }, callback);
            });
        } else {
            return new Promise((resolve, reject) => {
                this.$http.get(uri).subscribe((result: Result) => {
                    this.validatePromise(result).then(success => {
                        resolve(success);
                    }, failed => {
                        reject(failed);
                    });
                });
            });
        }

    }

    /**
     * POST请求
     * @param {string} uri
     * @param body
     * @param {Function} callback
     * @returns {Promise<any>}
     */
    public post(uri: string, body: any, callback: Function = null) {
        uri = this.rePrefix(uri);
        if (typeof callback === 'function') {
            this.$http.post(uri, body).subscribe((result: Result) => {
                this.validate(result, { method: 'POST', uri, body }, callback);
            });
        } else {
            return new Promise((resolve, reject) => {
                this.$http.post(uri, body).subscribe((result: Result) => {
                    this.validatePromise(result).then(success => {
                        resolve(success);
                    }, failed => {
                        reject(failed);
                    });
                });
            });
        }
    }

    /**
     * DELETE请求
     * @param {string} uri
     * @param {Function} callback
     * @returns {Promise<any>}
     */
    public delete(uri: string, callback: Function = null) {
        uri = this.rePrefix(uri);
        if (typeof callback === 'function') {
            this.$http.delete(uri).subscribe((result: Result) => {
                this.validate(result, { method: 'DELETE', uri }, callback);
            });
        } else {
            return new Promise((resolve, reject) => {
                this.$http.delete(uri).subscribe((result: Result) => {
                    this.validatePromise(result).then(success => {
                        resolve(success);
                    }, failed => {
                        reject(failed);
                    });
                });
            });
        }
    }

    /**
     * PUT请求
     * @param {string} uri
     * @param body
     * @param {Function} callback
     */
    public put(uri: string, body: any, callback: Function = null) {
        uri = this.rePrefix(uri);
        if (typeof callback === 'function') {
            this.$http.put(uri, body).subscribe((result: Result) => {
                this.validate(result, { method: 'PUT', uri, body }, callback);
            });
        } else {
            return new Promise((resolve, reject) => {
                this.$http.put(uri, body).subscribe((result: Result) => {
                    this.validatePromise(result).then(success => {
                        resolve(success);
                    }, failed => {
                        reject(failed);
                    });
                });
            });
        }
    }


    /**
     * 错误处理
     * @param {Result} result
     * @param {Function} callback
     */
    private validate(result: Result, param, callback: Function) {
        let $this = this;
        if (result.code === 0) {
            callback(result.data);
        } else if (result.code === ERROR_CODE.AUTHENTICATION_FAILED) {
            // 认证未通过
            if (!this.isError) {
                this.isError = true;
                this.$modal.error({
                    title: `错误提示`,
                    content: `${result.msg}`,
                    okText: `确定`,
                    onOk() {
                        $this.isError = false;
                        $this.$router.navigate(['/login']);
                    }
                });
            }
        } else if (result.code === ERROR_CODE.USERLOGIN) {
            // 下线在线用户
            if (!this.isError) {
                this.isError = true;
                this.$modal.error({
                    title: `错误提示`,
                    content: `该在线用户、请先将其下线再进行操作`,
                    okText: `确定`,
                    onOk() {
                        $this.isError = false;
                    }
                });
            }
        }else if (result.msg === '密码错误') {
            // 密码错误
            if (!this.isError) {
                this.isError = true;
                this.$modal.error({
                    title: `错误提示`,
                    zIndex: 1200,
                    content: `${result.msg}`,
                    okText: `确定`,
                    onOk() {
                        $this.isError = false;
                    }
                });
            }
        }else if (result.msg === '不能下线自己！') {
            // 下线自己
            if (!this.isError) {
                this.isError = true;
                this.$modal.error({
                    title: `错误提示`,
                    zIndex: 1200,
                    content: `${result.msg}`,
                    okText: `确定`,
                    onOk() {
                        $this.isError = false;
                    }
                });
            }
        } else {
            if (!this.isError) {
                this.isError = true;
                // this.$modal.error({
                //     title: `错误提示`,
                //     content: `${result.msg}`,
                //     okText: `确定`,
                //     onOk() {
                //         $this.isError = false;
                //     }
                // });
                console.log(result.msg);
            }
        }
    }

    /**
     * Promise校验
     * @param result
     * @returns {Promise<any>}
     */
    private validatePromise(result) {
        return new Promise((resolve, reject) => {
            if (result.code === 0) {
                resolve(result.data);
            } else {
                reject(result);
            }
        });
    }

    /**
     * 置换请求prefix
     * @param {string} uri
     * @returns {string}
     */
    private rePrefix(uri: string) {
        return uri.replace(`/itm/`, `/itom/`);
    }
}



