/**
 * Created by WH1711028 on  2017/11/27
 */

import { Injectable } from '@angular/core';
import { ProxyService } from "../../../../../proxy.service";

@Injectable()
export class RoleTabService {
    constructor(
        private $proxy: ProxyService
    ) {

    }



    /**
     * 获取表格数据
     * @param {string} uri
     * @param {any} body {roleId, pageSize, pageNum}
     * @param {Function} callback
     */
    public getTabData(uri, body, callback: Function) {
        this.$proxy.post(uri, body, callback);
    }
}



