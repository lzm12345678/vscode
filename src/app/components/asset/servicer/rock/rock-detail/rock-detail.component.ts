import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { RockDetailService } from "./rock-detail.service";
import { Brand, Series, Version, User } from "../../../../../models";
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { Observable } from 'rxjs/Observable';
import jQ from 'jquery';
import {Result} from "../../../../../models/result";
@Component({
    selector: 'app-rock-detail',
    templateUrl: './rock-detail.component.html',
    styleUrls: [ './rock-detail.component.scss' ],
    providers: [ RockDetailService ]
})
export class RockDetailComponent implements OnInit {
    style = {
        'background': '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        'border': '0px'
    };
    rockServerId;
    dealType;
    data = [];
    versions: Version[];
    users: User[];
    cabinets;
    rooms;
    startUs = [];
    isLoading: boolean = false;
    serverInfo: ServerInfo = new ServerInfo();

    generalProperty = [];   // 一般属性
    shelfPosition = []; // 上架位置
    // 协议配置
    protocolConfig = {
        snmp: [],
        ipmi: [],
        redfish: [],
        dnip: []
    };

    remark = [{label: '备注', key: 'remarks', type: 'textarea', require: false, rules: [ { max: 200 } ]}];
    standard: number = 0; // 选择型号后  查出服务器高度
    private snmp_type;
    private dnip_type;

    generalPropertyColumn = [];
    timer;
    constructor(
        private $router: Router,
        private $active: ActivatedRoute,
        private $service: RockDetailService,
        private $message: NzMessageService
    ) {

    }

    ngOnInit() {
        let $component = this;
        this.$active.params.subscribe(params => {
            this.dealType = params.type;
            this.$active.queryParams.subscribe(params => {
                this.rockServerId = params.id;
                if (this.dealType === 'insert') {
                    this.serverInfo = new ServerInfo();
                    this.initColumn();
                } else {
                    this.$service.getRockDetailById(this.rockServerId, result => {
                        this.serverInfo = result;
                        $component.standard = $component.serverInfo.standard;
                        $component.initColumn();
                        if ($component.serverInfo.computerRoomId) {
                            $component['$service'].getCabinetById($component.serverInfo.computerRoomId, result => {
                                if (result) {
                                    $component.cabinets = result.cabinetSet || [];
                                    // 更新机柜列表
                                    $component.shelfPosition.forEach(item => {
                                        if (item.key === 'cabinetId') {
                                            item.selectInfo.data = $component.cabinets || [];
                                        }
                                    });
                                    // 更新可用U位
                                    $component.$service.getUnuseStartUs($component.serverInfo.serverId, $component.standard,
                                        $component.serverInfo.cabinetId, result => {
                                            if (result) {
                                                $component.startUs = result;
                                                let _result = [];
                                                result.forEach(item => {
                                                    _result.push({ label: item, value: item });
                                                });
                                                $component.shelfPosition.forEach(item => {
                                                    if (item.key === 'startU') {
                                                        item.selectInfo.data = _result;
                                                    }
                                                })
                                            }
                                        });
                                }
                            });
                        }
                    });
                }


            });
        });
    }
    /**
     * 保存服务信息
     */
    public saveServerInfo() {
        this.validateServerInfo().then(() => {
            if (!this.isLoading) {
                this.isLoading = true;
                if (this.dealType === 'insert') {
                    this.$service.createServerInfo(this.serverInfo).then(success => {
                        this.isLoading = false;
                        this.$message.success('新增服务器成功');
                        this.$router.navigate([`/asset/servicer/rock`]);
                    }, failed => {
                        this.isLoading = false;
                        this.$message.error(failed.msg);
                    });
                } else if (this.dealType === 'modify') {
                    this.serverInfo['serverId'] = this.serverInfo.serverId;
                    this.$service.modifyServerInfo(this.serverInfo).then(() => {
                        this.isLoading = false;
                        this.$message.success('修改服务器成功');
                        this.$router.navigate([`/asset/servicer/rock`]);
                    }, failed => {
                        this.isLoading = false;
                        this.$message.error(failed.msg);
                    });
                }
            }
        }, () => {
            // 定位到错误行
            setTimeout(() => {
                if (document.getElementsByClassName('form-error')[0]) {
                    let _from = document.getElementsByClassName('form-error')[0].getBoundingClientRect().top;
                    let _html = document.getElementsByTagName('html')[0].getBoundingClientRect().top;
                    jQ('html').eq(0).animate({scrollTop: _from - _html - 100}, 400)
                }
            }, 100);
        });
    }

    /**
     * 配置一般属性
     * @returns {any}
     */
    private setGeneral() {
        let $component = this;
        this.generalProperty = [
            { key: 'serverName', label: '名称', type: 'input', require: true,
                rules: [
                    { require: true },
                    { min: 6 },
                    { max: 32 },
                    { event(value) {
                        return new Promise((resolve, reject) => {
                            $component.$service.validateServerNameDuplicate($component.serverInfo.serverId || "", value || "")
                                .then((result: Result) => {
                                result.data ? resolve() : reject(result.msg);
                            }, failed => {
                                reject();
                            });
                        });
                    }, msg: '该名称已经存在~' }
                ]
            },
            { key: 'serverCode', label: '资产编号', type: 'input', require: false,
                rules: [
                    { max: 32 }
                ]
            },
            { key: 'serverModel', label: '型号', disabled: $component.dealType === 'modify', type: 'select', require: true,
                rules: [
                    { require: true }
                ],
                selectInfo: {
                    data: $component.versions,
                    label: 'modelName',
                    value: 'id',
                    changeHook(value, $this) {
                        $component.serverInfo.computerRoomId = null;
                        $component.serverInfo.cabinetId = null;
                        $component.cabinets = [];
                        $component.serverInfo.startU = null;
                        $component.startUs = [];
                        for (let item of $component.versions) {
                            if (value === item.id) {
                                if (!item.standard) {
                                    alert('规格有误')
                                }
                                $component.standard = item.standard;
                                return;
                            }
                        }
                    }
                }
            },
            { key: 'serverIp', label: '管理IP', type: 'input', require: true,
                rules: [
                    { require: true },
                    { regex: "^((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.)" +
                    "{3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))$", msg: 'IP格式错误',
                    },
                    { event(value) {
                        return new Promise((resolve, reject) => {
                            if (value === $component.serverInfo.bandIp && value) {
                                reject('带内Ip和管理IP不可重复');
                            } else {
                                $component.$service.validateIpDuplicate($component.serverInfo.serverId || "", value || "")
                                    .then((success: Result) => {
                                    success.data ? resolve() : reject(success.msg);
                                }, failed => {
                                    reject();
                                });
                            }
                        });
                    }, msg: 'IP不可重复~' }
                ]
            },
            { key: 'bandIp', label: '带内IP', type: 'input', require: true,
                rules: [ { require: true },
                    {regex: "^((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.)" +
                    "{3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))$", msg: 'IP格式错误' },
                    { event(value) {
                        return new Promise((resolve, reject) => {
                            if (value === $component.serverInfo.serverIp && value) {
                                reject('带内Ip和管理IP不可重复');
                            } else {
                                $component.$service.validateIpDuplicate($component.serverInfo.serverId || "", value || "")
                                    .then((success: Result) => {
                                    // let msg = success
                                    success.data ? resolve() : reject(success.msg);
                                }, failed => {
                                    reject();
                                });
                            }
                        });

                    }, msg: 'IP不可重复~' }
                ]
            },
            { key: 'serverProject', label: '所属项目', type: 'input', require: false },
            { key: 'serverFirstuser', label: '第一责任人', type: 'select', require: false,
                selectInfo: {
                    data: $component.users,
                    label: 'userName',
                    value: 'userId',
                    changeHook(value, $this) {
                        $component.users.forEach(item => {
                            if (item.userId === value) {
                                item['nzDisabled'] = true;
                            } else if (item.userId !== $component.serverInfo.serverSeconduser) {
                                item['nzDisabled'] = false;
                            }
                        });
                    }
                }
            },
            { key: 'serverSeconduser', label: '第二责任人', type: 'select', require: false,
                selectInfo: {
                    data: $component.users,
                    label: 'userName',
                    value: 'userId',
                    changeHook(value, $this) {
                        $component.users.forEach(item => {
                            if (item.userId === value) {
                                item['nzDisabled'] = true;
                            } else if (item.userId !== $component.serverInfo.serverFirstuser) {
                                item['nzDisabled'] = false;
                            }
                        });
                    }
                }
            }
        ];
    }

    /**
     * 配置上架位置
     */
    private setSP() {
        let $component = this;
        this.shelfPosition = [
            { key: 'computerRoomId', label: '机房', type: 'select', require: false,
                rules: [],
                selectInfo: {
                    data: this.rooms,
                    label: 'roomName',
                    value: 'roomId',
                    changeHook(value, $this) {
                        $component['$service'].getCabinetById(value, result => {
                            $component.serverInfo.cabinetId = null;
                            $component.serverInfo.startU = null;
                            $component.cabinets = result.cabinetSet || [];
                            $component.shelfPosition.forEach(item => {
                                if (item.key === 'cabinetId') {
                                    item.selectInfo.data = $component.cabinets;
                                }
                            });
                        });
                    }
                }
            },
            { key: 'cabinetId', label: '机柜', type: 'select', require: false,
                selectInfo: {
                    data: this.cabinets,
                    label: 'cabinetName',
                    value: 'cabinetId',
                    changeHook(value, $this) {
                        $component.$service.getUnuseStartUs($component.rockServerId, $component.standard , value, result => {
                            $component.serverInfo.startU = null;
                            $component.startUs = result;
                            let _result = [];
                            result.forEach(item => {
                                let _obj = {
                                    label: item,
                                    value: item
                                };
                                _result.push(_obj);
                            });
                            $component.shelfPosition.forEach(item => {
                                if (item.key === 'startU') {
                                    item.selectInfo.data = _result;
                                }
                            })
                        });
                    }
                }
            },
            { key: 'startU', label: 'U位', type: 'select', require: false,
                selectInfo: {
                    data: [],
                    label: 'label',
                    value: 'value',
                    changeHook() {}
                }
            }
        ];
    }

    /**
     * 配置协议相关
     */

    private setProSNMI() {
        let $component = this;
        this.snmp_type = this.serverInfo.protocolList[0].snmpType;
        this.dnip_type = this.serverInfo.protocolList[3].snmpType;
        this.protocolConfig.snmp = [
            { key: 'snmpType', label: '类型', type: 'select', require: true,
                selectInfo: {
                    data: [{label: 'V2C', value: 1}, {label: 'V3', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook(value, $this) {
                        if (value !== $component.snmp_type) {
                            $component.snmp_type = value;
                            if (value === 2) {
                                $component.changeToV3($component.protocolConfig.snmp, 'snmp');
                            } else {
                                $component.changeToV2C($component.protocolConfig.snmp, 'snmp');
                            }
                        }
                    }
                }
            },
            { key: 'retryCount', label: '重试次数', type: 'number', require: true,
                rules: [ { require: true } ],
                min: 1,
                max: 20
            },
            { key: 'retryTime', label: '重试时间', type: 'number', require: true,
                rules: [ { require: true } ],
                min: 1, max: 60
            },
            { key: 'port', label: '端口', type: 'number', min: 1, max: 10000, require: true,
                rules: [ { require: true } ],
            },
            { key: 'userName', label: '用户名', type: 'input', require: true, rules: [ { require: true }] },
            { key: 'authenticationProtocol', label: '认证协议', type: 'select', require: false,
                selectInfo: {
                    data: [{label: 'HMACSHA', value: 1}, {label: 'HMACMD5', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook() { }
                }
            },
            { key: 'authenticationPassword', label: '认证密码', type: 'password', require: true, rules: [ { require: true }] },
            { key: 'dataEncryption', label: '数据加密协议', type: 'select', require: false,
                selectInfo: {
                    data: [{label: 'AES', value: 1}, {label: 'DES', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook() {}
                }
            },
            { key: 'dataEncryptioncipher', label: '数据加密密码', type: 'password', require: true, rules: [ { require: true }] },
            { key: 'trapGroupWord', label: 'Trap团体字', type: 'input', require: false },
            { key: 'confirmTrapGroupWord', label: '确认Trap团体字', type: 'input', require: false },
        ];
        if ($component.serverInfo.protocolList[0].snmpType === 1) {
            this.changeToV2C($component.protocolConfig.snmp, 'snmp');
        }
        this.protocolConfig.ipmi = [
            { key: 'userName', label: '用户名', type: 'input', require: true,
                rules: [ { require: true } ],
            },
            { key: 'password', label: '密码', type: 'password', require: true,
                rules: [ { require: true } ],
            },
            { key: 'trapGroupWord', label: 'Trap团体字', type: 'input', require: true,
                rules: [ { require: true } ],
            },
            { key: 'confirmTrapGroupWord', label: '确认Trap团体字', type: 'input', require: true,
                rules: [ { require: true } ],
            }
        ];
        this.protocolConfig.redfish = [
            { key: 'userName', label: '用户名', type: 'input', require: true,
                rules: [ { require: true } ],
            },
            { key: 'password', label: '密码', type: 'password', require: true,
                rules: [ { require: true } ],
            },
            { key: 'port', label: '端口', type: 'number', min: 1, max: 10000, require: true,
                rules: [ { require: true } ],
            }
        ];
        this.protocolConfig.dnip = [
            { key: 'snmpType', label: '类型', type: 'select', require: true,
                selectInfo: {
                    data: [{label: 'V2C', value: 1}, {label: 'V3', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook(value, $this) {
                        if (value !== $component.dnip_type) {
                            $component.dnip_type = value;
                            if (value === 2) {
                                $component.changeToV3($component.protocolConfig.dnip, 'dnip');
                            } else {
                                $component.changeToV2C($component.protocolConfig.dnip, 'dnip');
                            }
                        }
                    }
                }
            },
            { key: 'retryCount', label: '重试次数', type: 'number', require: true,
                rules: [ { require: true } ],
                min: 1,
                max: 20
            },
            { key: 'retryTime', label: '重试时间', type: 'number', require: true,
                rules: [ { require: true } ],
                min: 1, max: 60
            },
            { key: 'port', label: '端口', type: 'number', min: 1, max: 10000, require: true,
                rules: [ { require: true } ],
            },
            { key: 'userName', label: '用户名', type: 'input', require: true, rules: [ { require: true }] },
            { key: 'authenticationProtocol', label: '认证协议', type: 'select', require: false,
                selectInfo: {
                    data: [{label: 'HMACSHA', value: 1}, {label: 'HMACMD5', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook() { }
                }
            },
            { key: 'authenticationPassword', label: '认证密码', type: 'password', require: true, rules: [ { require: true }] },
            { key: 'dataEncryption', label: '数据加密协议', type: 'select', require: false,
                selectInfo: {
                    data: [{label: 'AES', value: 1}, {label: 'DES', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook() {}
                }
            },
            { key: 'dataEncryptioncipher', label: '数据加密密码', type: 'password', require: true, rules: [ { require: true }] },
            { key: 'trapGroupWord', label: 'Trap团体字', type: 'input', require: false },
            { key: 'confirmTrapGroupWord', label: '确认Trap团体字', type: 'input', require: false },
        ];
        if ($component.serverInfo.protocolList[3].snmpType === 1) {
            $component.changeToV2C($component.protocolConfig.dnip, 'dnip');
        }
    }

    /**
     * 校验serverInfo是否填写正确
     * @returns {Promise<any>}
     */
    private validateServerInfo() {
        return new Promise((resolve, reject) => {
            this.validateServerName().then(s => {
                this.validateItem(this.generalProperty, this.serverInfo).then(() => {
                    this.validateItem(this.protocolConfig.snmp, this.serverInfo.protocolList[0]).then(() => {
                        this.validateItem(this.protocolConfig.ipmi, this.serverInfo.protocolList[1]).then(() => {
                            this.validateItem(this.protocolConfig.redfish, this.serverInfo.protocolList[2]).then(() => {
                                this.validateItem(this.protocolConfig.dnip, this.serverInfo.protocolList[3]).then(() => {
                                    resolve();
                                }, () => {
                                    reject();
                                });
                            }, () => {
                                reject();
                            });
                        }, () => {
                            reject();
                        });
                    }, () => {
                        reject();
                    });
                }, () => {
                    reject();
                });
            }, f => {
                reject();
            });
        });
    }

    /**
     * 分批验证
     * @param column
     * @param data
     * @returns {Promise<any>}
     */
    private validateItem(column, data) {
        return new Promise((resolve, reject) => {
            let isError = false;
            for (let item of column) {
                if (item.key === 'serverName' || item.key === 'serverIp' || item.key === 'bandIP') {
                    resolve();
                } else {
                    if (item.change) {
                        item.change(data[item.key]);
                    }
                    if (item.blur) {
                        item.blur(data[item.key]);
                    }
                    if (item.isError) {
                        isError = true;
                        break;
                    }
                }
            }
            if (isError) {
                reject();
            } else {
                resolve();
            }
        });
    }

    private validateServerName() {
        return new Promise((resolve, reject) => {
            let serverNameItem = this.generalProperty.filter(item => item.key === 'serverName')[0];
            serverNameItem.rules.filter(item => item.event)[0].event(this.serverInfo.serverName).then(success => {
                this.validateServerIp().then(() => {
                    this.validateBandIp().then(() => {
                        resolve();
                    }, () => reject());
                }, () => reject());
            }, failed => {
                serverNameItem.isError = true;
                serverNameItem.msg = failed || serverNameItem.rules.filter(item => item.event)[0].msg;
                reject();
            });
        });
    }

    private validateServerIp() {
        return new Promise((resolve, reject) => {
            let serverIpItem = this.generalProperty.filter(item => item.key === 'serverIp')[0];
            let ruleItem = serverIpItem.rules.filter(item => item.event)[0];
            ruleItem.event(this.serverInfo.serverIp).then(() => {
                resolve();
            }, failed => {
                serverIpItem.isError = true;
                serverIpItem.msg = failed || ruleItem.msg;
                reject();
            });
        });
    }

    private validateBandIp() {
        return new Promise((resolve, reject) => {
            let BandIpItem = this.generalProperty.filter(item => item.key === 'bandIp')[0];
            let ruleItem = BandIpItem.rules.filter(item => item.event)[0];
            ruleItem.event(this.serverInfo.bandIp).then(() => {
                resolve();
            }, failed => {
                BandIpItem.isError = true;
                BandIpItem.msg = failed || ruleItem.msg;
                reject();
            });
        });
    }


    /**
     * 初始化column
     */
    private initColumn() {
        let $component = this;
        /**
         * 一般属性
         */
        this.$service.getAllVersion(result => {
            this.versions = result;

            this.$service.getAllUser(result => {
                this.users = result.data;
                this.setGeneral();
                $component.generalPropertyColumn = [
                    { label: '名称', type: 'input', key: 'serverName', required: true, col: 4,
                        rules: [
                            { required: true },
                            { minLength: 6 },
                            { maxLength: 32 },
                        ],
                        asyncRules: [
                            { asyncRule: (control: FormControl) => {
                                return Observable.create(function (observer) {
                                    clearTimeout($component.timer);
                                    $component.timer = setTimeout(() => {
                                        $component.$service.validateServerNameDuplicate($component.serverInfo.serverId || "", control.value || "")
                                            .then((result: Result) => {
                                                result.data ? observer.next(null) : observer.next({error: true, duplicated: true});
                                                observer.complete();
                                            }, failed => {
                                                observer.next({error: true, duplicated: true});
                                                observer.complete();
                                            });
                                    }, 500);
                                });
                            }, asyncCode: 'duplicated', msg: '此名称已经存在' }
                        ]
                    },
                    { label: '资产编号', type: 'input', key: 'serverCode', col: 4, rules: [ { maxLength: 32 } ] },
                    { label: '型号', type: 'select', key: 'serverModel', required: true,
                        selectInfo: {
                            data: $component.versions,
                            label: 'modelName',
                            value: 'id',
                        },
                        modelChange: (controls, event) => {
                            $component.serverInfo.computerRoomId = null;
                            $component.serverInfo.cabinetId = null;
                            $component.cabinets = [];
                            $component.serverInfo.startU = null;
                            $component.startUs = [];
                            for (let item of $component.versions) {
                                if (event === item.id) {
                                    if (!item.standard) {
                                        alert('规格有误')
                                    }
                                    $component.standard = item.standard;
                                    return;
                                }
                            }
                        },
                        rules: [ { required: true } ]
                    },
                    { label: '管理IP', key: 'serverIp', type: 'input', col: 4, required: true, rules: [
                        { required: true },
                        { pattern: "^((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.)" +
                            "{3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))$", msg: 'IP格式错误' },
                            ], asyncRules: [
                        { asyncRule: (control: FormControl) => {
                            return Observable.create(observer => {
                                if (control.value === $component.serverInfo.serverIp && control.value) {
                                    observer.next({ error: true, duplicated: true });
                                    observer.complete();
                                } else {
                                    $component.$service.validateIpDuplicate($component.serverInfo.serverId || "", control.value || "")
                                        .then((success: Result) => {
                                            // let msg = success
                                            success.data ? observer.next(null) : observer.next({ error: true, duplicated: true });
                                            observer.complete();
                                        }, failed => {
                                            observer.next(null);
                                            observer.complete();
                                        });
                                }
                            });
                        }, asyncCode: 'duplicated', msg: '带内Ip和管理IP不可重复' }
                    ] },
                    { label: '带内IP', key: 'bandIp', type: 'input', col: 4, required: true, rules: [
                        { required: true },
                        { pattern: "^((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.)" +
                        "{3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))$", msg: 'IP格式错误' },
                    ], asyncRules: [
                        { asyncRule: (control: FormControl) => {
                            return Observable.create(observer => {
                                if (control.value === $component.serverInfo.bandIp && control.value) {
                                    observer.next({ error: true, duplicated: true });
                                    observer.complete();
                                } else {
                                    $component.$service.validateIpDuplicate($component.serverInfo.serverId || "", control.value || "")
                                        .then((success: Result) => {
                                            // let msg = success
                                            success.data ? observer.next(null) : observer.next({ error: true, duplicated: true });
                                            observer.complete();
                                        }, failed => {
                                            observer.next(null);
                                            observer.complete();
                                        });
                                }
                            });
                        }, asyncCode: 'duplicated', msg: '带内Ip和管理IP不可重复' }
                    ] },
                    { label: '所属项目', key: 'serverProject', type: 'input' },
                    { label: '第一责任人', key: 'serverFirstuser', type: 'select',
                        selectInfo: {
                            data: $component.users,
                            label: 'userName',
                            value: 'userId',
                            modelChange: (controls, event) => {
                                $component.users.forEach(item => {
                                    if (item.userId === event) {
                                        item['nzDisabled'] = true;
                                    } else if (item.userId !== $component.serverInfo.serverSeconduser) {
                                        item['nzDisabled'] = false;
                                    }
                                });
                            }
                        }
                    },
                    { label: '第二责任人', key: 'serverSeconduser', type: 'select',
                        selectInfo: {
                            data: $component.users,
                            label: 'userName',
                            value: 'userId',
                            modelChange: (controls, event) => {
                                $component.users.forEach(item => {
                                    if (item.userId === event) {
                                        item['nzDisabled'] = true;
                                    } else if (item.userId !== $component.serverInfo.serverSeconduser) {
                                        item['nzDisabled'] = false;
                                    }
                                });
                            }
                        }
                    }
                ];
            });
        });
        /**
         * 上架位置
         */
        this.$service.getAllRoom(result => {
            this.rooms = result;
            this.setSP();
        });
        /**
         * 协议配置
         */
        this.setProSNMI();
    }

    /**
     * 切换至V2C
     * @param column
     */
    private changeToV2C(column, param) {
        let _temp = [];
        const V3 = ['userName', 'authenticationProtocol', 'authenticationPassword',
            'dataEncryption', 'dataEncryptioncipher'];
        let trap_array = [ 'trapGroupWord', 'confirmTrapGroupWord'];
        column.forEach(item => {
            if (!V3.includes(item.key) && !trap_array.includes(item.key)) {
                _temp.push(item);
            }
        });
        _temp.push( { key: 'writeGroupWord', label: '写团体字', type: 'input', require: true,
                rules: [ { require: true } ]
            });
        _temp.push({ key: 'readGroupWord', label: '读团体字', type: 'input', require: true,
            rules: [ { require: true } ],
        });
        _temp.push({ key: 'trapGroupWord', label: 'Trap团体字', type: 'input', require: true,
            rules: [ { require: true } ]
        });
        _temp.push({ key: 'confirmTrapGroupWord', label: '确认Trap团体字', type: 'input', require: true,
            rules: [ { require: true } ],
        });
        // 清除数据
        let _num = param === 'snmp' ? 0 : 3;
        V3.forEach(item => {
             this.serverInfo.protocolList[_num][item] = null;
             if (item === 'authenticationProtocol' || item === 'dataEncryption') {
                 this.serverInfo.protocolList[_num][item] = 1;
             }
        });
        this.protocolConfig[param] = _temp;
    }

    /**
     * 切换至V3
     * @param column
     */
    private changeToV3(column, param) {
        let _temp = [];
        let v2_array = ['writeGroupWord', 'readGroupWord'];
        let trap_array = [ 'trapGroupWord', 'confirmTrapGroupWord'];
        column.forEach(item => {
            if (!v2_array.includes(item.key) && !trap_array.includes(item.key)) {
                _temp.push(item);
            }
        });
        _temp.push({ key: 'userName', label: '用户名', type: 'input', require: true, rules: [ { require: true } ] });
        _temp.push({ key: 'authenticationProtocol', label: '认证协议', type: 'select', require: false,
            selectInfo: {
                data: [{label: 'HMACSHA', value: 1}, {label: 'HMACMD5', value: 2}],
                label: 'label',
                value: 'value',
                changeHook() { }
            }
        });
        _temp.push({ key: 'authenticationPassword', label: '认证密码', type: 'password', require: true, rules: [ { require: true } ] });
        _temp.push({ key: 'dataEncryption', label: '数据加密协议', type: 'select', require: false,
            selectInfo: {
                data: [{label: 'AES', value: 1}, {label: 'DES', value: 2}],
                label: 'label',
                value: 'value',
                changeHook() {}
            }
        });
        _temp.push({ key: 'dataEncryptioncipher', label: '数据加密密码', type: 'password', require: true, rules: [ { require: true } ] });
        _temp.push({ key: 'trapGroupWord', label: 'Trap团体字', type: 'input', require: false,
            rules: [  ]
        });
        _temp.push({ key: 'confirmTrapGroupWord', label: '确认Trap团体字', type: 'input', require: false,
            rules: [ ]
        });
        let _num = param === 'snmp' ? 0 : 3;
        v2_array.forEach(item => {
            this.serverInfo.protocolList[_num][item] = null;
        });
        this.protocolConfig[param] = _temp;
    }
}

export class ServerInfo {
    public serverId: string;
    public serverCode: string; // 服务器编号
    public serverName: string; // 服务器名称
    public serverKey: string; // 序列号
    public serverBmc: string; // BMCIP
    public serverIp: string; // 管理ip
    public serverBrand: number; // 品牌id
    public serverSeries: number; // 系列id
    public serverModel: number; // 型号id
    public serverProject: string; // 所属项目
    public serverFirstuser: string; // 第一责任人用户id
    public serverSeconduser: string; // 第二责任人id
    public serverMaxdisknumbe: string; // 最大磁盘托架数
    public occupyU: string; // 服务器所占U位
    public remarks: string; // 备注
    public protocolList: Protocol[];
    public brandName: string; // 品牌
    public seriesName: string; // 系列
    public model: string; // 型号
    public computerroomName: string; // 机房
    public cabinetName: string; // 机柜
    public uName: string; // 起始U位
    public shelvesId: string; // 服务器上架ID
    public computerRoomId: string; // 机房ID
    public cabinetId: string; // 机柜ID
    public startU: number; // 起始U位
    public standard: number = 0;
    public protocolType: string; // 类型          1:(SNMP );2:(IPMI);3:(REDFISH);4:(带内)',
    public snmpType: string; // SNMP类型 1:(V2C);2:(V3);
    public port: string; // 端口(1-65535）
    public groupWord: string; // 团体字
    public userName: string; // 用户名
    public authenticationPassword: string; // 认证密码
    public authenticationProtocol: string; // 认证协议（1:HMACSHA;2:HMACMD5）
    public dataEncryption: string; // 数据加密协议(1:AES;2:DES)
    public dataEncryptioncipher: string; // 数据加密密码
    public password: string; // 密码
    public bandIp: string; // 带内IP

    constructor() {
        this.computerRoomId = '';
        this.cabinetId = '';
        this.startU = 0;
        let p1 = new Protocol();
        p1.snmpType = 2;
        p1.port = 161;
        p1.retryCount = 3;
        p1.retryTime = 5;
        p1.authenticationProtocol = 1;
        p1.dataEncryption = 1;
        p1.trapGroupWord = 'public';
        p1.confirmTrapGroupWord = 'public';
        let p2 = new Protocol();
        p2.trapGroupWord = 'public';
        p2.confirmTrapGroupWord = 'public';
        let p3 = new Protocol();
        let p4 = new Protocol();
        p4.snmpType = 2;
        p4.port = 161;
        p4.retryCount = 3;
        p4.retryTime = 5;
        p4.authenticationProtocol = 1;
        p4.dataEncryption = 1;
        p4.trapGroupWord = 'public';
        p4.confirmTrapGroupWord = 'public';
        this.protocolList = [p1, p2, p3, p4];
    }
}

class Protocol {
    public id: number;
    public protocolType: number; // 类型          1:(SNMP );2:(IPMI);3:(REDFISH);4:(带内)',
    public snmpType: number; // SNMP类型 1:(V2C);2:(V3);
    public port: number; // 端口(1-65535）
    public trapGroupWord: string; // Trap团体字
    public userName: string; // 用户名
    public authenticationPassword: string; // 认证密码
    public authenticationProtocol: number; // 认证协议（1:HMACSHA;2:HMACMD5）
    public dataEncryption: number; // 数据加密协议(1:AES;2:DES)
    public dataEncryptioncipher: string; // 数据加密密码
    public password: string; // 密码
    public retryTime: number; // 重试时间
    public retryCount: number; // 重试次数
    public readGroupWord: string; // 读团体字
    public writeGroupWord: string; // 写团体字
    public confirmTrapGroupWord: string; // 确认Trap团体字

    constructor() {

    }
}

