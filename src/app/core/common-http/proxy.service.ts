/**
 * Created by GyjLoveLh on  2017/12/6
 */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import {Result} from "../models-service/Result";

@Injectable()
export class ProxyServiceImpl<T, P> {
    constructor(
        private $http: HttpClient,
    ) {}



}

