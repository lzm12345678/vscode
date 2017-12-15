/**
 * Created by GyjLoveLh on  2017/12/13
 */
import { Result, EntitiesResult } from "../Result"
import { Servicer } from "./servicer.model";

export interface ServicerInterface {
    /**
     * 分页+模糊+排序查询服务器列表
     * @param page
     * @param query
     * @param sort
     * @returns {Result<EntitiesResult<Servicer>>}
     */
    getServicerPagination(page, query, sort): Promise<Result<EntitiesResult<Servicer>>>;

    /**
     * 服务器上架
     * @param shelfInfo
     * @returns {Promise<Result<any>>}
     */
    onShelves(shelfInfo): Promise<Result<any>>;

    /**
     * 服务器下架
     * @param {string} id
     * @returns {Promise<Result<any>>}
     */
    offShelves(id: string): Promise<Result<any>>;

    /**
     * 新增服务器
     * @param {Servicer} servicer
     * @returns {Promise<Result<any>>}
     */
    insertServicer(servicer: Servicer): Promise<Result<any>>;

    /**
     * 校验IP是否唯一
     * @param serviceId
     * @param serviceIp
     * @returns {Promise<Result<any>>}
     */
    validateIpDuplicated(serviceId, serviceIp): Promise<Result<any>>;

    /**
     * 校验服务器名称是否唯一
     * @param serverId
     * @param serverName
     * @returns {Promise<Result<any>>}
     */
    validateServerNameDuplicated(serverId, serverName): Promise<Result<any>>;

    // getUnShelves(): Promise<Result<any>> ;
    //
    /**
     * 批量删除服务器
     * @param {string[]} ids
     * @returns {Promise<Result<any>>}
     */
    deleteServers(ids: string[]): Promise<Result<any>>;

    /**
     * 根据主键查询服务器详情
     * @param {string} id
     * @returns {Promise<Result<Servicer>>}
     */
    getServiceById(id: string): Promise<Result<Servicer>>;

    /**
     * 修改服务器信息
     * @param {Servicer} servicer
     * @returns {Promise<Result<any>>}
     */
    modifyService(servicer: Servicer): Promise<Result<any>>;


}
