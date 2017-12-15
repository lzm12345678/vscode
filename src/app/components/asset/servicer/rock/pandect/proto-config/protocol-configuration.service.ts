/**
 * Created by WH1709055 on  2017/11/16 18:01
 */

import { Injectable, OnInit} from '@angular/core'
import { ProxyService } from "../../../../../../proxy.service";

@Injectable()
export class ProtocolConfigurationService {
    constructor(
        private $proxy: ProxyService
    ) { }

    public getProtocolConfiguration(serverId: string, callback: Function) {
        this.$proxy.get(`/itm/bsserver/${serverId}`, callback);
    }
}



