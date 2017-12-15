/*
品牌详细页面服务
 */
import {Injectable} from "@angular/core";
import {ProxyService} from "../../../../../proxy.service";
import { HttpClient } from '@angular/common/http';
@Injectable()
export class BrandDetailService {
    constructor(
        private $proxy: ProxyService,
        private $http: HttpClient
    ) {
    }
}
