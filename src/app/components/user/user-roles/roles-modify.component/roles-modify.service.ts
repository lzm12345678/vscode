/**
 * Created by WH1709055 on  2017/11/11 13:54
 */

import { Injectable } from '@angular/core';
import { ProxyService } from "../../../../proxy.service";

@Injectable()
export class RolesModifyService {
    constructor(
        private $proxy: ProxyService
    ) {

    }

    /**
     * 获取用户非树形初始权限
     * @param {any} body {roleId, pageSize, pageNum}
     * @param {Function} callback
     */
    public getRoleFunctionPage(body, callback: Function) {
        this.$proxy.post(`/itm/function/roleFunctionPage`, body, callback);
    }

    /**
     * 获取所有权限树形展示
     * @param {Function} callback
     */
    public getAllFunction(callback: Function) {
        this.$proxy.get(`/itm/function`, callback);
    }

    /**
     * 获取角色所有权限树形展示
     * @param {string} roleId
     * @param {Function} callback
     */
    public getRoleFunctionTree(roleId, callback: Function) {
        this.$proxy.get(`/itm/function/roleFunctionTree/${roleId}`, callback);
    }

    /**
     * 查询角色详情
     * @param {string} roleId
     * @param {Function} callback
     */
    public getRoleById(roleId: string, callback: Function) {
        this.$proxy.get(`/itm/roles/${roleId}`, callback);
    }

    /**
     * 查询角色用户分页展示
     * @param {any} body {roleId, pageSize, pageNum}
     * @param {Function} callback
     */
    public getUserTree(body, callback: Function) {
        this.$proxy.post(`/itm/roles/getAllUsers`, body, callback);
    }
}



