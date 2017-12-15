/**
 * Created by WH1711028 on  2017/11/20
 */

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { BladeProtocolConfigService } from './blade-proto-config.service'
import { Blade } from "../../../../../../models/blade";

@Component({
    selector: 'app-blade-proto-config',
    templateUrl: './blade-proto-config.component.html',
    styleUrls: ['./blade-proto-config.component.scss'],
    providers: [ BladeProtocolConfigService ]
})

export class BladeProtocolConfigComponent implements OnInit {
    serverId: string;
    protocols = new Blade().protocolList;
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
    constructor(
        private $active: ActivatedRoute,
        private $service: BladeProtocolConfigService,
    ) {  }
    ngOnInit() {
        this.$active.queryParams.subscribe(params => {
            this.serverId = params.id;
            console.log('serverId', this.serverId);
            this.$service.getProtocolConfiguration(this.serverId, result => {
                console.log('protocols', result.protocolList);
                this.protocols = result.protocols;
                this.snmpData = this.protocols[0];
                this.ipmiData = this.protocols[1];
                this.redfishData = this.protocols[2];
            });
        });
    }
}


