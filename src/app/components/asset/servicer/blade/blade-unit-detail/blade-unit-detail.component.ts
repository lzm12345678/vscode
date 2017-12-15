import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { BladeUnitDetailService } from "./blade-unit-detail.service";
import { Brand, Series, Version, User } from "../../../../../models";
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-blade-unit-detail',
    templateUrl: './blade-unit-detail.component.html',
    styleUrls: [ './blade-unit-detail.component.scss' ],
    providers: [ BladeUnitDetailService ]
})
export class BladeUnitDetailComponent implements OnInit {

    style = {
        'background': '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        'border': '0px'
    };
    bladeServerId; // 刀片服务器id
    bladeUnitId; // 单片单元id
    isEdit; // 单元是否可编辑标识
    isBladeEdit; // 返回刀片详情是否可编辑标识
    data = [];
    brands: Brand;
    serieses: Series;
    versions: Version[];
    users: User; // 用户列表
    cabinets; // 机柜列表
    rooms; // 机房列表
    slots = []; // 槽位数列表
    startUs = [];
    serverInfo: ServerInfo = new ServerInfo();
    hardwareInfo = null;

    generalProperty = [];   // 一般属性
    shelfPosition = []; // 上架位置
    protocolConfig = {
        snmp: [],
        ipmi: [],
        redfish: [],
        dnip: []
    }; // 协议配置
    MemoInfo = []; // 备注信息
    standard: number = 1; // 选择型号后  查出服务器高度
    constructor(
        private $router: Router,
        private $active: ActivatedRoute,
        private $service: BladeUnitDetailService,
        private $message: NzMessageService
    ) { }

    ngOnInit() {
        let $component = this;
        this.$active.queryParams.subscribe(params => {
            console.log('params', params);
            this.bladeServerId = params.bladeServerId;
            this.bladeUnitId = params.unitId;
            this.isEdit = params.isEdit;
            this.isBladeEdit = params.isBladeEdit;
            // 获取槽位数列表
            this.$service.getSlots({
                bladeServerId: this.bladeServerId,
                serverId: this.bladeUnitId
            }, result => {
                this.slots = [];
                console.log('槽位数接口', result);
                if (result.length > 0) {

                    result.forEach(item => {
                        this.slots.push({
                            label: item,
                            value: item
                        })
                    });
                    console.log('slots', this.slots);
                    console.log(typeof result[0]);
                }

                if (this.bladeUnitId === 'null') {
                    console.log('addUnit');
                    this.serverInfo = new ServerInfo();
                    this.serverInfo.bladeServerId = this.bladeServerId;
                    this.initColumn();
                } else {
                    console.log('修改unit');
                    this.$service.getUnitDetailById(this.bladeUnitId, result => {
                        this.serverInfo = result;
                        if (this.serverInfo.protocolList.length === 0) {
                            this.serverInfo.protocolList = new ServerInfo().protocolList;
                            console.log('serverInfo.protocolList', this.serverInfo.protocolList);
                        }
                        console.log('查看unit', result);
                        console.log('slotNum', typeof result.slotNum);
                        this.initColumn();
                        if (this.serverInfo.computerRoomId) {
                            this['$service'].getCabinetById(this.serverInfo.computerRoomId, result => {
                                console.log('机房发生变化', result);
                                // $this.serverInfo.cabinetId = 0;
                                $component.cabinets = result.cabinetSet;
                                $component.shelfPosition.forEach(item => {
                                    item.forEach(item => {
                                        if (item.key === 'cabinetId') {
                                            item.selectInfo = {
                                                data: $component.cabinets,
                                                label: 'cabinetName',
                                                value: 'cabinetId'
                                            }
                                        }
                                    });
                                });
                                this.$service.getAbleStartUs(this.standard, this.serverInfo.cabinetId, result => {
                                    this.startUs = result;
                                    let _result = [];
                                    result.forEach(item => {
                                        let _obj = {
                                            label: item,
                                            value: item
                                        };
                                        _result.push(_obj);
                                    });
                                    this.shelfPosition.forEach(item => {
                                        item.forEach(item => {
                                            if (item.key === 'startU') {
                                                item.selectInfo = {
                                                    data: _result,
                                                    label: 'label',
                                                    value: 'value'
                                                }
                                            }
                                        });
                                    })
                                });
                            });
                        }
                    });
                    // this.$service.getHardwareById(this.bladeUnitId, result => {
                    //     // this.hardwareInfo = result;
                    //     console.log('hard', result);
                    // });
                }
            });



        });

    }
    /**
     * 保存服务信息
     */
    public saveServerInfo() {
        // let result = this.validateServerInfo();
        let result = this.serverInfo;
        console.log('serverInfo', result);
        if (this.validateUnit()) {
            if (this.bladeUnitId === 'null') {
                console.log('新增单元');
                this.$service.createServerInfo(result, result => {
                    console.log(result);
                    this.$message.success(`新增刀片单元服务器成功`);
                    this.toDetail(this.bladeServerId, this.isEdit);
                });
            } else  {
                // 修改或查看单元

                result['serverId'] = this.serverInfo.serverId;
                if (this.isEdit === 'true') {
                    console.log('修改单元');
                    this.$service.modifyServerInfo(result, result => {
                        console.log(result);
                        this.$message.success(`修改刀片单元服务器成功`);
                        this.toDetail(this.bladeServerId, this.isEdit);
                    });
                } else {
                    console.log('查看单元');
                }
            }
        }
    }

    /**
     * 监听机房
     * @param id
     */
    roomChange(id, $this) {
        $this['$service'].getCabinetById(id, result => {
            console.log('机房发生变化', result);
            // $this.serverInfo.cabinetId = 0;
            $this.cabinets = result.cabinetSet;
            $this.shelfPosition.forEach(item => {
                item.forEach(item => {
                    if (item.key === 'cabinetId') {
                        item.selectInfo = {
                            data: $this.cabinets,
                            label: 'cabinetName',
                            value: 'cabinetId'
                        }
                    }
                });
            });
        });
    }

    /**
     * 监听机柜
     * @param id
     */
    cabinetChange(id, $this) {
        console.log(id, $this.standard);
        $this.$service.getAllStartUs($this.standard, id, result => {
            $this.startUs = result;
            let _result = [];
            result.forEach(item => {
                let _obj = {
                    label: item,
                    value: item
                };
                _result.push(_obj);
            });
            $this.shelfPosition.forEach(item => {
                item.forEach(item => {
                    if (item.key === 'startU') {
                        item.selectInfo = {
                            data: _result,
                            label: 'label',
                            value: 'value'
                        }
                    }
                });
            })
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
                    { max: 32 }
                ],
                validate(value) {
                    if (!value) {
                        return {ok: false, msg: '资产名称不能为空'};
                    }
                    if (value.length < 6 || value.length > 32) {
                        return {ok: false, msg: '资产名称长度应为6-32位'}
                    }
                    return {ok: true, msg: ''}
                }
            },
            { key: 'serverModel', label: '型号', type: 'select', require: true,
                rules: [
                    { require: true }
                ],
                selectInfo: {
                    data: this.versions,
                    label: 'modelName',
                    value: 'id',
                    changeHook(value, $this) {
                        let flag = false;
                        $component.versions.forEach(item => {
                            if (value === item.id) {
                                if (!item.standard) {
                                    item.standard = 1;
                                }
                                $this.standard = item.standard;
                                flag = true;
                                return false;
                            }
                        });
                        if (!flag) {
                            $this.standard = 0;
                        }
                    }
                },
                validate(value) {
                    if (!value) {
                        return {ok: false, msg: '型号不能为空'};
                    }
                    return {ok: true, msg: ''}
                }
            },
            { key: 'serverIp', label: '设备IP', type: 'input', require: true,
                rules: [
                    { require: true },
                    { min: 6 },
                    { max: 32 }
                ],
                validate(value) {
                    if (!value) {
                        return {ok: false, msg: '管理IP不能为空'};
                    }
                    if (value.length < 6 || value.length > 32) {
                        return {ok: false, msg: '管理IP长度不对'}
                    }
                    return {ok: true, msg: ''}
                }
            },
            { key: 'bandIp', label: '带内IP', type: 'input', require: true,
                rules: [
                    { require: true },
                    { min: 6 },
                    { max: 32 }
                ],
                validate(value) {
                    if (!value) {
                        return {ok: false, msg: '带内IP不能为空'};
                    }
                    if (value.length < 6 || value.length > 32) {
                        return {ok: false, msg: '带内IP长度不对'}
                    }
                    return {ok: true, msg: ''}
                }
            },
            { key: 'slotNum', label: '槽位数', type: 'select', require: true,
                selectInfo: {
                    data: $component.slots,
                    label: 'label',
                    value: 'value',
                    changeHook(value, $this) {
                        console.log(value);
                    }
                },
                validate(value) {
                    if (!value) {
                        return {ok: false, msg: '槽位数不能为空'};
                    }
                    return {ok: true, msg: ''}
                }
            },
            { key: 'serverCode', label: '资产编号', type: 'input', require: false,
                rules: [
                    { max: 32 }
                ]
            },
            { key: 'serverProject', label: '所属项目', type: 'input', require: false },
            { key: 'serverFirstuser', label: '第一责任人', type: 'select', require: false,
                selectInfo: {
                    data: $component.users,
                    label: 'userName',
                    value: 'userId',
                    changeHook(value, $this) {
                        console.log(value);
                    }
                }
            },
            { key: 'serverSeconduser', label: '第二责任人', type: 'select', require: false,
                selectInfo: {
                    data: $component.users,
                    label: 'userName',
                    value: 'userId',
                    changeHook(value, $this) {
                        console.log(value);
                    }
                }
            }
        ];
    }

    // /**
    //  * 配置上架位置
    //  */
    // private setSP() {
    //     let $component = this;
    //     this.shelfPosition = [
    //         { key: 'computerRoomId', label: '机房', type: 'select', require: false,
    //             rules: [],
    //             selectInfo: {
    //                 data: this.rooms,
    //                 label: 'roomName',
    //                 value: 'roomId',
    //                 changeHook(value, $this) {
    //                     $component['$service'].getCabinetById(value, result => {
    //                         console.log('机房发生变化', result);
    //                         // $this.serverInfo.cabinetId = 0;
    //                         $component.cabinets = result.cabinetSet;
    //                         $component.shelfPosition.forEach(item => {
    //                             if (item.key === 'cabinetId') {
    //                                 item.selectInfo.data = $component.cabinets;
    //                             }
    //                         });
    //                     });
    //                 }
    //             }
    //         },
    //         { key: 'cabinetId', label: '机柜', type: 'select', require: false,
    //             selectInfo: {
    //                 data: this.cabinets,
    //                 label: 'cabinetName',
    //                 value: 'cabinetId',
    //                 changeHook(value, $this) {
    //                     $component.$service.getAbleStartUs($component.standard, value, result => {
    //                         $component.startUs = result;
    //                         let _result = [];
    //                         result.forEach(item => {
    //                             let _obj = {
    //                                 label: item,
    //                                 value: item
    //                             };
    //                             _result.push(_obj);
    //                         });
    //                         $component.shelfPosition.forEach(item => {
    //                             if (item.key === 'startU') {
    //                                 item.selectInfo.data = _result;
    //                             }
    //                         })
    //                     });
    //                 }
    //             }
    //         },
    //         { key: 'startU', label: 'U位', type: 'select', require: false,
    //             selectInfo: {
    //                 data: [],
    //                 label: 'label',
    //                 value: 'value',
    //                 changeHook() {}
    //             }
    //         }
    //     ];
    // }

    /**
     * 配置协议相关
     */
    private setProSNMI() {
        this.protocolConfig.snmp = [
            { key: 'snmpType', label: '类型', type: 'select', require: true,
                rules: [ { require: true } ],
                selectInfo: {
                    data: [{label: 'V2C', value: 1}, {label: 'V3', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook() { }
                }
            },
            { key: 'retryTime', label: '重试时间', type: 'number', require: true,
                rules: [ { require: true } ],
                min: 1, max: 60
            },
            { key: 'retryCount', label: '重试次数', type: 'number', require: true,
                rules: [ { require: true } ],
                min: 1,
                max: 20
            },
            { key: 'confirmTrapGroupWord', label: '确认Trap团队字', type: 'input', require: true,
                rules: [ { require: true } ],
            },
            { key: 'writeGroupWord', label: '写团队字', type: 'input', require: true,
                rules: [ { require: true } ]
            },
            { key: 'readGroupWord', label: '读团队字', type: 'input', require: true,
                rules: [ { require: true } ],
            },
            { key: 'userName', label: '用户名', type: 'input', require: false },
            { key: 'port', label: '端口', type: 'number', min: 1, max: 10000, require: true,
                rules: [ { require: true } ],
            },
            { key: 'authenticationPassword', label: '认证密码', type: 'input', require: false },
            { key: 'authenticationProtocol', label: '认证协议', type: 'select', require: false,
                selectInfo: {
                    data: [{label: 'HMACSHA', value: 1}, {label: 'HMACMD5', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook() { }
                }
            },
            { key: 'dataEncryptioncipher', label: '数据加密密码', type: 'input', require: false },
            { key: 'dataEncryption', label: '数据加密协议', type: 'select', require: false,
                selectInfo: {
                    data: [{label: 'AES', value: 1}, {label: 'DES', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook() {}
                }
            }
        ];
        this.protocolConfig.ipmi = [
            { key: 'userName', label: '用户名', type: 'input', require: true,
                rules: [ { require: true } ],
            },
            { key: 'password', label: '密码', type: 'input', require: true,
                rules: [ { require: true } ],
            },
            { key: 'trapGroupWord', label: 'Trap团队字', type: 'input', require: true,
                rules: [ { require: true } ],
            },
            { key: 'confirmTrapGroupWord', label: '确认Trap团队字', type: 'input', require: true,
                rules: [ { require: true } ],
            }
        ];
        this.protocolConfig.redfish = [
            { key: 'userName', label: '用户名', type: 'input', require: true,
                rules: [ { require: true } ],
            },
            { key: 'password', label: '密码', type: 'input', require: true,
                rules: [ { require: true } ],
            },
            { key: 'port', label: '端口', type: 'number', min: 1, max: 10000, require: true,
                rules: [ { require: true } ],
            }
        ];
        this.protocolConfig.dnip = [
            { key: 'snmpType', label: '类型', type: 'select', require: true,
                rules: [ { require: true } ],
                selectInfo: {
                    data: [{label: 'V2C', value: 1}, {label: 'V3', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook() {}
                }
            },
            { key: 'retryTime', label: '重试时间', type: 'number', min: 1, max: 60, require: true,
                rules: [ { require: true } ]
            },
            { key: 'retryCount', label: '重试次数', type: 'number', min: 1, max: 20, require: true,
                rules: [ { require: true } ]
            },
            { key: 'port', label: '端口', type: 'number', min: 1, max: 10000, require: true,
                rules: [ { require: true } ]
            },
            {
                key: 'userName',
                label: '用户名',
                type: 'input',
                require: false
            },
            {
                key: 'authenticationProtocol',
                label: '认证协议',
                type: 'select',
                selectInfo: {
                    data: [{label: 'HMACSHA', value: 1}, {label: 'HMACMD5', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook() { }
                },
                require: false
            },
            {
                key: 'authenticationPassword',
                label: '认证密码',
                type: 'input',
                require: false
            },
            {
                key: 'dataEncryption',
                label: '数据加密协议',
                type: 'select',
                selectInfo: {
                    data: [{label: 'AES', value: 1}, {label: 'DES', value: 2}],
                    label: 'label',
                    value: 'value',
                    changeHook() { }
                },
                require: false
            },
            {
                key: 'dataEncryptioncipher',
                label: '数据加密密码',
                type: 'input',
                require: false
            },
            {
                key: 'trapGroupWord',
                label: 'Trap团队字',
                type: 'input',
                require: true,
                rules: [ { require: true } ]
            },
            {
                key: 'confirmTrapGroupWord',
                label: '确认Trap团队字',
                type: 'input',
                require: true,
                rules: [ { require: true } ]
            },
            {
                key: 'readGroupWord',
                label: '读团队字',
                type: 'input',
                require: true,
                rules: [ { require: true } ]
            },
            {
                key: 'writeGroupWord',
                label: '写团队字',
                type: 'input',
                require: true,
                rules: [ { require: true } ]
            }
        ];
    }

    // /**
    //  * 验证填写信息是否正确
    //  */
    // private validateServerInfo() {
    //     let _result = {};
    //     this.generalProperty.forEach(item => {
    //
    //             if (item.require) {
    //                 if (item.validate) {
    //                     let result = item.validate(item.value);
    //                     console.log(result);
    //                 } else {
    //                     console.log('为定义validate');
    //                 }
    //             }
    //             _result[item.key] = item.value;
    //
    //     });
    //     this.shelfPosition.forEach(item => {
    //
    //             if (item.require) {
    //                 if (item.validate) {
    //                     let result = item.validate(item.value);
    //                     console.log(result);
    //                 } else {
    //                     console.log('为定义validate');
    //                 }
    //             }
    //             _result[item.key] = item.value;
    //
    //     });
    //     _result['protocolList'] = [];
    //     let pro_snmp = new Protocol();
    //     this.protocolConfig.snmp.forEach(item => {
    //
    //             if (item.require) {
    //                 if (item.validate) {
    //                     let result = item.validate(item.value);
    //                     console.log(result);
    //                 } else {
    //                     console.log('为定义validate');
    //                 }
    //             }
    //             pro_snmp[item.key] = item.value;
    //
    //     });
    //     pro_snmp['protocolType'] = 1;
    //     _result['protocolList'].push(pro_snmp);
    //
    //     let pro_impi = new Protocol();
    //     this.protocolConfig.ipmi.forEach(item => {
    //
    //             if (item.require) {
    //                 if (item.validate) {
    //                     let result = item.validate(item.value);
    //                     console.log(result);
    //                 } else {
    //                     console.log('为定义validate');
    //                 }
    //             }
    //             pro_impi[item.key] = item.value;
    //
    //     });
    //     pro_impi['protocolType'] = 2;
    //     _result['protocolList'].push(pro_impi);
    //
    //     let pro_redfish = new Protocol();
    //     this.protocolConfig.redfish.forEach(item => {
    //
    //             if (item.require) {
    //                 if (item.validate) {
    //                     let result = item.validate(item.value);
    //                     console.log(result);
    //                 } else {
    //                     console.log('为定义validate');
    //                 }
    //             }
    //             pro_redfish[item.key] = item.value;
    //
    //     });
    //     pro_redfish['protocolType'] = 3;
    //     _result['protocolList'].push(pro_redfish);
    //
    //     let pro_dn = new Protocol();
    //     this.protocolConfig.dnip.forEach(item => {
    //
    //             if (item.require) {
    //                 if (item.validate) {
    //                     let result = item.validate(item.value);
    //                     console.log(result);
    //                 } else {
    //                     console.log('为定义validate');
    //                 }
    //             }
    //             pro_dn[item.key] = item.value;
    //
    //     });
    //     pro_dn['protocolType'] = 4;
    //     _result['protocolList'].push(pro_dn);
    //     return _result;
    // }

    /**
     * 校验刀片服务器详情页
     */
    validateUnit() {
        let info = this.serverInfo;
        let requiredAllDone = true; // 必填项有空标识
        let result = false; // 验证通过标识

        if (
            this.validateItem(this.generalProperty, info) &&
            this.validateItem(this.protocolConfig.snmp, info.protocolList[0]) &&
            this.validateItem(this.protocolConfig.ipmi, info.protocolList[1]) &&
            this.validateItem(this.protocolConfig.redfish, info.protocolList[2]) &&
            this.validateItem(this.protocolConfig.dnip, info.protocolList[3])
        ) {
            result = true;
        }
        return result;
    }

    /**
     * 校验每项
     */
    validateItem(column, data) {
        let result;

        for (let item of column) {
            if (item.require) {
                if (data[item.key] === null || data[item.key] === '') {
                    this.$message.warning('必填项不能为空!');
                    console.log(item.key);
                    return false;
                }
            }
            if (item.validate) {
                result = item.validate(data[item.key]);
                if (result.ok !== undefined && !result.ok) {
                    // 验证不通过
                    this.$message.warning(result.msg);
                    return false;
                }
            }
        }

        return true;
    }

    private initColumn() {

        /**
         * 一般属性
         */
        this.$service.getAllVersion(result => {
            this.versions = result;
            this.$service.getAllUser(result => {
                this.users = result.data;
                console.log(this.users);
                this.setGeneral();
            });
        });
        // /**
        //  * 上架位置
        //  */
        // this.$service.getAllRoom(result => {
        //     this.rooms = result;
        //     this.setSP();
        // });

        /**
         * 协议配置
         */
        this.setProSNMI();
    }


    /**
     * 跳转刀片服务器详情页
     */
    toDetail(bladeServerId, isEdit: boolean) {
        this.$router.navigate(['/asset/servicer/blade/detail'], {
            queryParams: {
                bladeServerId: bladeServerId,
                isEdit: isEdit
            }
        });
    }
}

export class ServerInfo {
    public bladeServerId: string;
    public serverId: string;
    public serverCode: string; // 服务器编号
    public serverName: string; // 服务器名称
    public serverKey: string; // 序列号
    public serverBmc: string; // BMCIP
    public serverIp: string; // 带内ip
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
    public slotNum: number; // 槽位数

    constructor() {
        this.computerRoomId = '';
        this.cabinetId = '';
        this.startU = 0;
        let p1 = new Protocol();
        p1.protocolType = 1;
        p1.snmpType = 2;
        p1.port = 161;
        p1.retryCount = 3;
        p1.retryTime = 5;
        p1.authenticationProtocol = 1;
        p1.dataEncryption = 1;
        p1.trapGroupWord = 'public';
        p1.confirmTrapGroupWord = 'public';
        let p2 = new Protocol();
        p2.protocolType = 2;
        p2.trapGroupWord = 'public';
        p2.confirmTrapGroupWord = 'public';
        let p3 = new Protocol();
        p3.protocolType = 3;
        let p4 = new Protocol();
        p4.protocolType = 4;
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
    public readGroupWord: string; // 读团队字
    public writeGroupWord: string; // 写团体字
    public confirmTrapGroupWord: string; // 确认Trap团体字

    constructor() {

    }
}
