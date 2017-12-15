import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ProxyService } from "../../../../../proxy.service";
// import {Result} from "../../../../../models/result";

@Injectable()
export class NetworkDetailService {
    constructor(
        private $http: HttpClient,
        private $proxy: ProxyService
    ) {  }

   
}
