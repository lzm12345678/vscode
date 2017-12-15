/**
 * Created by WH1711028 on  2017/11/20
 */

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import {UnitProtoConfigService} from "./unit-proto-config.service";
import { Unit } from "../../../../../../models/unit";

@Component({
    selector: 'app-unit-proto-config',
    templateUrl: './unit-proto-config.component.html',
    styleUrls: ['./unit-proto-config.component.scss'],
    providers: [UnitProtoConfigService]
})

export class UnitProtoConfigComponent implements OnInit {
    serverId: string;
    protocols = new Unit().protocolList;
    snmpData = this.protocols[0];
    protocolSnmp = [
        { label: '类型', key: 'snmpType'},
        { label: '端口', key: 'port'},
        { label: '重试时间', key: 'retryTime'},
        { label: '重试次数', key: 'retryCount'},
        { label: '读团队字', key: 'readGroupWord'},
        { label: '写团队字', key: 'writeGroupWord'},
        { label: 'Trap团队字', key: 'trapGroupWord'},
        { label: '确认Trap团队字', key: 'confirmTrapGroupWord'},
        { label: '用户名', key: 'userName'},
        { label: '用户密码', key: 'authenticationPassword'},
        { label: '认证协议', key: 'authenticationProtocol'},
        { label: '数据加密协议', key: 'dataEncryption'},
        { label: '数据加密密码', key: 'dataEncryptioncipher'}
    ];
    ipmiData = this.protocols[1];
    protocolIpmi = [
        { label: '用户名', key: 'userName'},
        { label: '用户密码', key: 'authenticationPassword'},
        { label: 'Trap团队字', key: 'trapGroupWord'},
        { label: '确认Trap团队字', key: 'confirmTrapGroupWord'}
    ];
    redfishData = this.protocols[2];
    protocolRedfish = [
        { label: '用户名', key: 'userName'},
        { label: '用户密码', key: 'authenticationPassword'},
        { label: '端口', key: 'port'}
    ];

    dnipData = this.protocols[0];
    protocolDnip = [
        { label: '类型', key: 'snmpType'},
        { label: '端口', key: 'port'},
        { label: '重试时间', key: 'retryTime'},
        { label: '重试次数', key: 'retryCount'},
        { label: '读团队字', key: 'readGroupWord'},
        { label: '写团队字', key: 'writeGroupWord'},
        { label: 'Trap团队字', key: 'trapGroupWord'},
        { label: '确认Trap团队字', key: 'confirmTrapGroupWord'},
        { label: '用户名', key: 'userName'},
        { label: '用户密码', key: 'authenticationPassword'},
        { label: '认证协议', key: 'authenticationProtocol'},
        { label: '数据加密协议', key: 'dataEncryption'},
        { label: '数据加密密码', key: 'dataEncryptioncipher'}
    ];
    constructor(
        private $active: ActivatedRoute,
        private $service: UnitProtoConfigService
    ) {  }
    ngOnInit() {
        this.$active.queryParams.subscribe(params => {
            this.serverId = params.unitId;
            this.$service.getProtocolConfiguration(this.serverId, result => {
                console.log('protocols', result.protocolList);
                this.protocols = result.protocolList;
                this.snmpData = this.protocols[0];
                this.ipmiData = this.protocols[1];
                this.redfishData = this.protocols[2];
                this.dnipData = this.protocols[3];
            });
        });
    }
}


