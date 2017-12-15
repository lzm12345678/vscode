import { Injectable } from '@angular/core';
import { User } from '../../models/index'
import { ProxyService } from "../../proxy.service";

@Injectable()
export class UserService {
    constructor(
        private $proxy: ProxyService
    ) {

    }

    /**
     * 分页获取用户信息
     * @param {number} pageIndex
     * @param {number} pageSize
     * @returns {{users: User[]; total: number}}
     */
    public getUserPagination(pageIndex: number, pageSize: number, callback) {
        this.$proxy.get(`/itm/users/${ pageSize }/${ pageIndex }`, result => {
            callback({users: result.data, total: result.totalCount});
        });
    }

    /**
     * 模糊查询用户列表
     * @param {{userCode: string; userName: string; userStatus: string; pageSize: number; pageNum: number}} query
     * @param callback
     */
    public getUserByField(query: {
            userCode: string,
            userName: string,
            userStatus: string,
            pageSize: number,
            pageNum: number}, callback
        ) {
        console.log(query);
        this.$proxy.post(`/itm/users/termQuery`, query, result => {
            callback({
                users: result.data,
                total: result.totalCount
            })
        });
    }

    /**
     * 获取所有角色
     * @returns {any}
     */
    public getAllRoles(callback: Function) {
        this.$proxy.post(`/itm/roles/list`, {}, result => {
            callback(result);
        });
    }

    /**
     * 分页查询角色列表
     * @param {number} pageIndex
     * @param {number} pageSize
     * @param callback
     */
    public getRolesPagination(pageIndex: number, pageSize: number, callback) {
        this.$proxy.get(`/itm/roles/${pageSize}/${pageIndex}`, result => {
            callback({ roles: result.data, total: result.totalCount });
        });
    }

    /**
     * 新增用户
     * @param {User} user
     */
    public insertUser(user: User, callback = null) {
        if (typeof callback === 'function') {
            this.$proxy.post(`/itm/users`, user, callback);
        } else {
            return this.$proxy.post(`/itm/users`, user);
        }
    }

    /**
     * 获取用户详情
     * @param id
     * @param callback
     */
    public getUserById(id, callback) {
        this.$proxy.get(`/itm/users/${id}`, callback);
    }

    /**
     * 用户名校验
     * @param {string} userName
     */
    public userNameValidate(userName: string, userId: string, callback) {
        this.$proxy.get(`/itm/users/userName/${userName}/${userId}`, result => {
            callback(result);
        });
    }

    /**
     * 修改用户信息
     * @param {User} user
     * @param callback
     */
    public modifyUser(user: User, callback = null) {
        if (typeof callback === 'function') {
            this.$proxy.put(`/itm/users`, user, callback);
        } else {
            return this.$proxy.put(`/itm/users`, user);
        }
    }

    /**
     * 删除多条用户
     * @param {string[]} ids
     * @param callback
     */
    public deleteUsers(userIds: string[], callback) {
        this.$proxy.post(`/itm/users/deleteUsers`, userIds, callback);
    }

    /**
     * 停用/启用状态
     * @param {string} status 0:停用  1:启用
     * @param {number} id
     * @param callback
     */
    public changeStatus(userId: string, callback) {
        this.$proxy.put(`/itm/users/status/${userId}`, {}, callback)
    }

    /**
     * 修改密码
     * @param {number} userId
     * @param {string} password
     * @param callback
     */
    public modifyPassword(userId: string, password: string, callback) {
        this.$proxy.put(`/itm/users/reset`, { userId: userId, password: password }, callback);
    }

    /**
     * 查询在线用户
     * @param {number} pageSize
     * @param {number} pageIndex
     * @param callback
     */
    public getOnlineUserPagination(pageSize: number, pageIndex: number, callback) {
        this.$proxy.get(`/itm/queryOnline/${pageSize}/${pageIndex}`, callback);
    }

    /**
     * 强制下线
     * @param {number} userId
     * @param callback
     */
    public offline(userName: string, callback) {
        this.$proxy.delete(`/itm/offline/${userName}`, callback);
    }

    /**
     * 模糊查询角色
     * @param {string} pageIndex
     * @param {string} pageSize
     * @param {string} roleName
     * @param callback
     */
    public getRolesByField(pageIndex: number, pageSize: number, roleName: string, callback) {
        this.$proxy.post(`/itm/roles/termQuery`, {pageSize, pageNum: pageIndex, roleName}, callback);
    }
}
