/**
 * Created by WH1711028 on  2017/11/20
 */

import { Injectable, OnInit} from '@angular/core'
import { ProxyService } from "../../../../../../proxy.service";

@Injectable()
export class BladeProtocolConfigService {
    constructor(
        private $proxy: ProxyService
    ) { }

    public getProtocolConfiguration(serverId: string, callback: Function) {
        this.$proxy.get(`/itm/bladeServer/${serverId}`, callback);
    }
}



