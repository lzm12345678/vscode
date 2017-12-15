/**
 * Created by WH1709055 on  2017/11/16 17:57
 */

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { ProtocolConfigurationService } from "./protocol-configuration.service";

@Component({
    selector: 'app-protocol-configuration',
    templateUrl: './protocol-configuration.component.html',
    styleUrls: ['./protocol-configuration.component.scss'],
    providers: [ ProtocolConfigurationService ]
})

export class ProtocolConfigurationComponent implements OnInit {
    serverId: string;
    protocolList = [];
    column1 = [];
    data1 = [];
    column2 = [
        { label: '用户名', key: 'userName' },
        { label: '密码', key: 'password' },
        { label: 'Trap团体字', key: 'trapGroupWord' },
        { label: '确认Trap团体字', key: 'confirmTrapGroupWord' }
    ];
    data2 = [];
    column3 = [
        { label: '用户名', key: 'userName' },
        { label: '密码', key: 'password' },
        { label: '端口', key: 'port' }
    ];
    data3 = [];
    column4 = [];
    data4 = [];

    row = 2;
    constructor(
        private $active: ActivatedRoute,
        private $service: ProtocolConfigurationService
    ) {  }
    ngOnInit() {
        this.$active.queryParams.subscribe(params => {
            this.serverId = params.id;
            this.$service.getProtocolConfiguration(this.serverId, result => {
                this.protocolList = result.protocolList;
                if (this.protocolList[0].snmpType + '' === '2') {
                    this.column1 = [
                        { label: '类型', key: 'snmpType',
                            selectData: {
                                data: [{label: 'V2C', value: 1}, {label: 'V3', value: 2}],
                                label: 'label',
                                value: 'value'
                            }
                        },
                        { label: '端口', key: 'port' },
                        { label: '重试次数', key: 'retryCount' },
                        { label: '重试时间', key: 'retryTime' },

                        { label: '用户名', key: 'userName' },
                        { label: '认证协议', key: 'authenticationProtocol' },
                        { label: '认证密码', key: 'authenticationPassword' },
                        { label: '数据加密协议', key: 'dataEncryption' },
                        { label: '数据加密密码', key: 'dataEncryptioncipher' },

                        { label: 'Trap团体字', key: 'trapGroupWord' },
                        { label: '确认Trap团体字', key: 'confirmTrapGroupWord' }
                    ]
                } else {
                    this.column1 = [
                        { label: '类型', key: 'snmpType',
                            selectData: {
                                data: [{label: 'V2C', value: 1}, {label: 'V3', value: 2}],
                                label: 'label',
                                value: 'value'
                            }
                        },
                        { label: '重试次数', key: 'retryCount' },
                        { label: '重试时间', key: 'retryTime' },
                        { label: '端口', key: 'port' },
                        { label: '读团体字', key: 'readGroupWord' },
                        { label: '写团体字', key: 'writeGroupWord' },
                        { label: 'Trap团体字', key: 'trapGroupWord' },
                        { label: '确认Trap团体字', key: 'confirmTrapGroupWord' }
                    ];
                }
                this.data1 = this.protocolList[0];
                this.data2 = this.protocolList[1];
                this.data3 = this.protocolList[2];
                if (this.protocolList[3].snmpType + '' === '2') {
                    this.column4 = [
                        { label: '类型', key: 'snmpType',
                            selectData: {
                                data: [{label: 'V2C', value: 1}, {label: 'V3', value: 2}],
                                label: 'label',
                                value: 'value'
                            }
                        },
                        { label: '端口', key: 'port' },
                        { label: '重试次数', key: 'retryCount' },
                        { label: '重试时间', key: 'retryTime' },

                        { label: '用户名', key: 'userName' },
                        { label: '认证协议', key: 'authenticationProtocol' },
                        { label: '认证密码', key: 'authenticationPassword' },
                        { label: '数据加密协议', key: 'dataEncryption' },
                        { label: '数据加密密码', key: 'dataEncryptioncipher' },

                        { label: 'Trap团体字', key: 'trapGroupWord' },
                        { label: '确认Trap团体字', key: 'confirmTrapGroupWord' }
                    ]
                } else {
                    this.column4 = [
                        { label: '类型', key: 'snmpType',
                            selectData: {
                                data: [{label: 'V2C', value: '1'}, {label: 'V3', value: '2'}],
                                label: 'label',
                                value: 'value'
                            }
                        },
                        { label: '重试次数', key: 'retryCount' },
                        { label: '重试时间', key: 'retryTime' },
                        { label: '端口', key: 'port' },
                        { label: '读团体字', key: 'readGroupWord' },
                        { label: '写团体字', key: 'writeGroupWord' },
                        { label: 'Trap团体字', key: 'trapGroupWord' },
                        { label: '确认Trap团体字', key: 'confirmTrapGroupWord' }
                    ];
                }
                this.data4 = this.protocolList[3];
            });
        });
    }
}


