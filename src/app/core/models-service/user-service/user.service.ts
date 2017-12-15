/**
 * Created by GyjLoveLh on  2017/12/6
 */
import { Injectable } from '@angular/core';
import { User } from "./user.model"
import { Observable } from 'rxjs/Observable';
import { Result, EntitiesResult } from "../Result"
import { ProxyServiceImpl } from "../../common-http/proxy.service"

export interface UserService {
    /**
     * 分页/模糊查询用户列表
     * @param pageIndex
     * @param pageSize
     * @param queryItem
     * @param sortItem
     * @returns {Observable<Result<EntitiesResult<User>>>}
     */
    getUsers(pageIndex, pageSize, queryItem, sortItem): Observable<Result<EntitiesResult<User>>>;

    /**
     * 查询用户详情
     * @param {string} id
     * @returns {Observable<Result<User>>}
     */
    getUserById(id: string): Observable<Result<User>>;

    /**
     * 修改用户
     * @param {User} user
     * @returns {Observable<Result<any>>}
     */
    modifyUser(user: User): Observable<Result<any>>;

    /**
     * 删除用户
     * @param {string} id
     * @returns {Observable<Result<any>>}
     */
    deleteUser(id: string): Observable<Result<any>>;
}

// @Injectable()
// export class UserServiceImpl implements UserService {
//
//     constructor(
//         private $proxy: ProxyServiceImpl<EntitiesResult<User>, User>
//     ) {
//
//     }
//
//     /**
//      *
//      * @param pageIndex
//      * @param pageSize
//      * @param queryItem
//      * @param sortItem
//      * @returns {Observable<Result<EntitiesResult<User>>>}
//      */
//     getUsers(pageIndex, pageSize, queryItem, sortItem): Observable<Result<EntitiesResult<User>>> {
//         return null;
//     }
//
//     /**
//      *
//      * @param {string} id
//      * @returns {Observable<Result<User>>}
//      */
//     getUserById(id: string): Observable<Result<User>> {
//         return null;
//     }
//
//     /**
//      *
//      * @param {User} user
//      * @returns {Observable<Result<any>>}
//      */
//     modifyUser(user: User): Observable<Result<any>> {
//         return null;
//     }
//
//     /**
//      *
//      * @param {string} id
//      * @returns {Observable<Result<any>>}
//      */
//     deleteUser(id: string): Observable<Result<any>> {
//         return null;
//     }
// }

