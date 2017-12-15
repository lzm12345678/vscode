import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { BladeDetailService } from './blade-detail.service';
import { ActivatedRoute, Params} from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import {  Version } from "../../../../../models";

const ERROR_MSG = {
    require: '此项为必填项',
    max(len) {
        return `长度不超过${len}个字符`;
    },
    min(len) {
        return `长度至少为${len}个字符`
    }
}

@Component({
    selector: 'app-blade-detail',
    templateUrl: './blade-detail.component.html',
    styleUrls: [ './blade-detail.component.scss' ],
    providers: [ BladeDetailService ]
})

export class BladeDetailComponent implements OnInit {

    private bladeServerId: string; // 服务器id
    private isEdit; // 是否可编辑标识
    private detailInfo: ServerInfo = new ServerInfo();

    private basicProperty = [];   // 基本属性
    private shelfPosition = []; // 上架位置
    private agreementConfig = {
        'snmp': [],
        'ipmi': [],
        'redfish': [],
        'dnip': []
    }; // 协议配置

    private MemoInfo = []; // 备注信息
    private unitInfo = []; // 单元信息

    versions = []; // 所有型号
    version; // 所选型号
    users = []; // 所有用户
    leftUsers = [] // 剩余所有用户
    style = { // 样式
        'background': '#f7f7f7',
        'border-radius': '4px',
        'margin-bottom': '24px',
        'border': '0px'
    };
    data = [];

    rooms = []; // 所有机房
    roomId = null; // 所选机房Id
    cabinets = []; // 所在机房所有机柜
    cabinetId = null // 所选机柜id
    UList = []; // 根据机柜获取U位列表
    standard = 1;

    // 表格变量
    _allChecked = false;
    _disabledButton = true;
    _checkedNumber = 0;
    _displayData: Array<any> = [];
    _operating = false;
    _indeterminate = false;

    _displayDataChange($event) {
        this._displayData = $event;
    };

    _refreshStatus() {
        const allChecked = this._displayData.every(value => value.checked === true);
        const allUnChecked = this._displayData.every(value => !value.checked);
        this._allChecked = allChecked;
        this._indeterminate = (!allChecked) && (!allUnChecked);
        this._disabledButton = !this.detailInfo.units.some(value => value.checked);
        this._checkedNumber = this.detailInfo.units.filter(value => value.checked).length;
    };

    _checkAll(value) {
        if (value) {
            this._displayData.forEach(data => data.checked = true);
        } else {
            this._displayData.forEach(data => data.checked = false);
        }
        this._refreshStatus();
    };

    _operateData() {
        this._operating = true;
        setTimeout(_ => {
            this.detailInfo.units.forEach(value => value.checked = false);
            this._refreshStatus();
            this._operating = false;
        }, 1000);
    };

    constructor(
        private routerIonfo: ActivatedRoute,
        private $router: Router,
        private $message: NzMessageService,
        private $service: BladeDetailService
    ) { }

    ngOnInit() {

        this.routerIonfo.queryParams.subscribe(param => {
            console.log('param');
            // 获取刀片服务器id
            this.bladeServerId = param.bladeServerId;
            // 获取可编辑标识
            this.isEdit = param.isEdit;
            console.log(this.bladeServerId, this.isEdit);
            // 获取所有型号
            this.$service.getAllVersion(result => {
                console.log('versions');
                console.log(result);
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        this.versions[i] = {
                            'name': result[i].modelName,
                            'id': result[i].id
                        };
                    }
                }
            });

            // 获取所有责任人
            this.$service.getAllUser(result => {
                console.log('users');
                console.log(result);
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        this.users[i] = {
                            'name': result[i].userName,
                            'id': result[i].userId
                        };
                    }
                }
            });

            // 获取所有机房
            this.$service.getAllRoom(result => {
                console.log('rooms');
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        this.rooms[i] = {
                            'name': result[i].roomName,
                            'id': result[i].roomId
                        };
                    }
                }
                console.log(this.rooms);
            });



            if (this.bladeServerId === 'null') {
                // 点击新增进入详情页
                console.log('新增页');
                this.detailInfo = new ServerInfo();
                console.log('新增参数', this.detailInfo);
                this.init();
            }else {
                // 查看或修改进入详情页
                this.$service.getBladeDetail(this.bladeServerId, (data) => {
                    console.log('查看刀片服务器详情');
                    console.log(data);
                    this.detailInfo = data;

                    if (this.detailInfo.protocolList.length === 0) {
                        this.detailInfo.protocolList = new ServerInfo().protocolList;
                    }

                    this.roomId = this.detailInfo.computerRoomId;
                    this.cabinetId = this.detailInfo.cabinetId;
                    this.standard = this.detailInfo.standard ? this.detailInfo.standard : 1;

                    console.log('roomId');
                    console.log(this.roomId);

                    // 根据机房id获取所有机柜
                    if (this.roomId) {
                        this.$service.getCabinets(this.roomId, result => {
                            this.cabinets = result.cabinetSet;
                            this.shelfPosition.forEach(item => {
                                item.forEach(item => {
                                    if (item.key === 'cabinetId') {
                                        item.selectInfo = {
                                            data: this.cabinets,
                                            label: 'cabinetName',
                                            value: 'cabinetId'
                                        }
                                    }
                                });
                            });
                        });
                    }

                    // 根据机柜可选U位列表
                    if (this.cabinetId) {
                        let params = {
                            'serverId': this.bladeServerId,
                            'cabinetId': this.cabinetId,
                            'standard': this.standard
                        };
                        this.$service.getPosUList(params, result => {

                            this.UList = [];
                            if (result.length > 0) {
                                for (let i = 0; i < result.length; i++) {
                                    this.UList[i] = {
                                        'name': result[i],
                                        'id': result[i]
                                    };
                                }
                            }
                            this.shelfPosition.forEach(item => {
                                item.forEach(item => {
                                    if (item.key === 'startU') {
                                        item.selectInfo.data = this.UList;
                                    }
                                });
                            });


                            console.log('UList');
                            console.log(this.UList);
                        });
                    }

                    this.setBasic();
                    this.setSP();
                    this.setAgreements();
                });
            }
        });
    }

    roomChange(id, $this) {
        if (id === 'null') {
            $this.cabinets = [];
            $this.UList = [];
            $this.detailInfo.computerRoomId = null;
            $this.detailInfo.cabinetId = null;
            $this.detailInfo.startU = null;
            return;
        }
        $this['$service'].getCabinets(id, result => {
            console.log('机房发生变化', result);

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
            $this.detailInfo.cabinetId = null;
            $this.detailInfo.startU = null;
        });
    }

    /**
     * 监听机柜
     * @param id
     */
    cabinetChange(id, $this) {
        console.log(id, $this.standard);
        if (id === null) {
            console.log('cabinetNull');
            $this.UList = [];
            $this.detailInfo.cabinetId = null;
            $this.detailInfo.startU = null;
            return;
        }
        let params = {
            'serverId': $this.bladeServerId,
            'cabinetId': id,
            'standard': $this.standard
        };
        $this.$service.getPosUList(params, result => {
            $this.Ulist = [];
            result.forEach(item => {
                let _obj = {
                    label: item,
                    value: item
                };
                $this.Ulist.push(_obj);
            });
            $this.shelfPosition.forEach(item => {
                item.forEach(item => {
                    if (item.key === 'startU') {
                        item.selectInfo = {
                            data: $this.Ulist,
                            label: 'label',
                            value: 'value'
                        }
                    }
                });
            });
            $this.detailInfo.startU = null;
        });
    }

    /**
     * 保存详情页
     */
    saveBladeDetail() {
        let info = this.detailInfo;
        console.log('请求参数', info);
        if (this.validateBlade() === true) {
            if ( this.bladeServerId !== 'null' ) {
                this.$service.updateBladeSever(info, result => {
                    console.log('保存详情');
                    this.$message.success(`保存刀片服务器成功`);
                    this.backList();
                });
            }else {
                this.$service.addBladeSever(info, result => {
                    console.log('新增详情');
                    this.$message.success(`新增刀片服务器成功`);
                    this.backList();
                });
            }
        }

        // this.bladeServerId ? this.bladeService.updateBladeSever(body, callback) : this.bladeService.addBladeSever(body, callback);
    }

    /**
     * 配置一般属性
     * @returns {any}
     */
    setBasic() {
        this.basicProperty = [
            [
                {
                    key: 'bladeServerName',
                    title: '资产名称',
                    type: 'input',
                    required: true,
                    tip: true,
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
                {
                    key: 'bladeServerModelId',
                    title: '资产型号',
                    label: this.detailInfo.bladeServerModelName,
                    type: 'select',
                    required: true,
                    readonly: this.bladeServerId === 'null' ? false : true,
                    rules: [ { require: true } ],
                    selectInfo: {
                        data: this.versions,
                        label: 'name',
                        value: 'id'
                    },
                    change(value, $this) {
                        let flag = false;
                        $this.versions.forEach(item => {
                            if (value === item.id) {
                                if (!item.standard) {
                                    item.standard = 1;
                                }
                                $this.standard = parseInt(item.standard);
                                flag = true;
                                return false;
                            }
                        });
                        if (!flag) {
                            $this.standard = 0;
                        }
                    },
                    validate(value) {
                        if (!value) {
                            return {ok: false, msg: '资产型号不能为空'};
                        }
                        return {ok: true, msg: ''}
                    }
                },
                {
                    key: 'manageIp',
                    title: '管理IP',
                    type: 'input',
                    required: true,
                    readonly: this.bladeServerId === 'null' ? false : true,
                    tip: true,
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
                }
            ],
            [
                {
                    key: 'bladeServerCode',
                    title: '资产编号',
                    type: 'input',
                    required: false,
                    readonly: this.bladeServerId === 'null' ? false : true,
                    tip: true,
                    validate(value) {
                        if (value && value.length > 32) {
                            return {ok: false, msg: '资产编号长度过长'}
                        }
                        return {ok: true, msg: ''}
                    }
                },
                {
                    key: 'bladeServerProject',
                    title: '所属项目',
                    type: 'input',
                    required: false,
                    tip: true
                },
                {
                    key: 'firstPrincipalId',
                    title: '第一责任人',
                    label: this.detailInfo.firstPrincipalName,
                    type: 'select',
                    required: false,
                    selectInfo: {
                        data: this.users,
                        label: 'name',
                        value: 'id'
                    },
                    change(value, $this) {
                        let flag = false;
                        $this.users.forEach(item => {
                            if (value === item.id) {
                                if (!item.standard) {
                                    item.standard = 1;
                                }
                                $this.standard = parseInt(item.standard);
                                flag = true;
                                return false;
                            }
                        });
                        if (!flag) {
                            $this.standard = 0;
                        }
                    }
                },
                {
                    key: 'secondPrincipalId',
                    title: '第二责任人',
                    label: this.detailInfo.secondPrincipalName,
                    type: 'select',
                    required: false,
                    selectInfo: {
                        data: this.users,
                        label: 'name',
                        value: 'id'
                    },
                    change(value, $this) {
                        let flag = false;
                        $this.users.forEach(item => {
                            if (value === item.id) {
                                if (!item.standard) {
                                    item.standard = 1;
                                }
                                $this.standard = parseInt(item.standard);
                                flag = true;
                                return false;
                            }
                        });
                        if (!flag) {
                            $this.standard = 0;
                        }
                    }
                }
            ]
        ];
        this.addItemRuleTip(this.basicProperty, this.detailInfo);
    }

    /**
     * 配置上架位置
     */
    private setSP() {
        this.shelfPosition = [
            [
                {
                    key: 'computerRoomId',
                    title: '机房',
                    type: 'select',
                    required: false,
                    change: this.roomChange,
                    selectInfo: {
                        data: this.rooms,
                        label: 'name',
                        value: 'id'
                    }
                },
                {
                    key: 'cabinetId',
                    title: '机柜',
                    type: 'select',
                    required: false,
                    change: this.cabinetChange,
                    selectInfo: {
                        data: this.cabinets,
                        label: 'name',
                        value: 'id'
                    }
                },
                {
                    key: 'startU',
                    title: 'U位',
                    type: 'select',
                    required: false,
                    change() {},
                    selectInfo: {
                        data: this.UList,
                        label: 'name',
                        value: 'id'
                    }
                }
            ]
        ];
    }

    /**
     * 配置协议信息
     */
    private setAgreements() {
        this.agreementConfig.snmp = [
            [
                {
                    key: 'snmpType', label: '类型', type: 'select', required: true,
                    rules: [ { require: true } ],
                    selectInfo: {
                        data: [{label: 'V2C', value: 1}, {label: 'V3', value: 2}],
                        label: 'label',
                        value: 'value',
                        changeHook(value, $this) {
                            $this.xyTypeChange(value, $this.agreementConfig.snmp);

                        }
                    }
                },
                {
                    key: 'port', label: '端口', type: 'number', required: true, min: 1, max: 10000,
                    rules: [{ min: 1 }, { max: 10000 }, { require: true } ]

                }
            ],
            [
                {
                    key: 'retryTime', label: '重试时间', type: 'number', required: true, min: 1, max: 60,
                    rules: [{ min: 1 }, { max: 60 }, { require: true } ],
                    msg: '不能为空~'
                },
                {
                    key: 'retryCount', label: '重试次数', type: 'number', required: true, min: 1, max: 20,
                    rules: [{ min: 1 }, { max: 20 }, { require: true } ],
                    msg: '不能为空~'
                }
            ],
            [
                {
                    key: 'readGroupWord', label: '读团队字', type: 'input', required: false,
                    rules: [{ require: true }],
                    msg: ''
                },
                {
                    key: 'writeGroupWord', label: '写团队字', type: 'input', required: false,
                    rules: [{ require: true }],
                    msg: '不能为空~'
                }
            ],
            [
                {
                    key: 'confirmTrapGroupWord', label: 'Trap团队字', type: 'input', required: true,
                    rules: [{ require: true }],
                    msg: '不能为空~'
                },
                {
                    key: 'confirmTrapGroupWord', label: '确认Trap团队字', type: 'input', required: true,
                    rules: [{ require: true }],
                    msg: '不能为空~'
                }
            ],
            [
                {
                    key: 'userName', label: '用户名', type: 'input', required: true
                },
                {
                    key: 'authenticationPassword', label: '认证密码', type: 'input', required: true
                }
            ],
            [

                {
                    key: 'authenticationProtocol', label: '认证协议', type: 'select', required: true,
                    selectInfo: {
                        data: [{label: 'HMACSHA', value: 1}, {label: 'HMACMD5', value: 2}],
                        label: 'label',
                        value: 'value',
                        changeHook($event) { }
                    }
                },
                {
                    key: 'dataEncryption', label: '数据加密协议', type: 'select', required: true,
                    selectInfo: {
                        data: [{label: 'AES', value: 1}, {label: 'DES', value: 2}],
                        label: 'label',
                        value: 'value',
                        changeHook($event) {}
                    }
                }
            ],
            [
                {
                    key: 'dataEncryptioncipher', label: '数据加密密码', type: 'input', required: true
                }
            ]

        ];
        if (this.detailInfo.protocolList[0].snmpType === 1) {
            for (let row of this.agreementConfig.snmp) {
                for (let item of row) {
                    item.required = true;
                    if (
                        item.key === 'userName' ||
                        item.key === 'authenticationProtocol' ||
                        item.key === 'authenticationPassword' ||
                        item.key === 'dataEncryption' ||
                        item.key === 'dataEncryptioncipher'
                    ) {
                        item.required = false;
                    }
                }
            }
        }
        this.addItemRuleTip(this.agreementConfig.snmp, this.detailInfo.protocolList[0]);

        this.agreementConfig.ipmi = [
            [
                {
                    key: 'userName', label: '用户名', type: 'input', required: true,
                    rules: [{ require: true }]
                },
                {
                    key: 'password', label: '密码', type: 'input', required: true,
                    rules: [{ require: true }]
                }
            ],
            [
                {
                    key: 'trapGroupWord', label: 'Trap团队字', type: 'input', required: true,
                    rules: [{ require: true }]
                },
                {
                    key: 'confirmTrapGroupWord', label: '确认Trap团队字', type: 'input', required: true,
                    rules: [{ require: true }]
                }
            ]


        ];
        this.addItemRuleTip(this.agreementConfig.ipmi, this.detailInfo.protocolList[1]);

        this.agreementConfig.redfish = [
            [
                {
                    key: 'userName', label: '用户名', type: 'input', required: true,
                    rules: [{ require: true }]
                },
                {
                    key: 'password', label: '密码', type: 'input', required: true,
                    rules: [{ require: true }]
                },
            ],
            [
                {
                    key: 'port', label: '端口', type: 'number', required: true, min: 1, max: 10000,
                    rules: [{ min: 1 }, { max: 10000 }, { require: true }]
                }
            ]
        ];
        this.addItemRuleTip(this.agreementConfig.redfish, this.detailInfo.protocolList[2]);
    }

    /**
     * 协议类型切换
     * @param type : (1 V2C, 2 V3)
     * @param data
     */
    xyTypeChange(type, data) {
        if (type === 2) {
            for (let row of data) {
                for (let item of row) {
                    item.required = true;
                    if (item.key === 'readGroupWord' || item.key === 'writeGroupWord') {
                        item.required = false;
                    }
                }
            }
        }else {
            for (let row of data) {
                for (let item of row) {
                    item.required = true;
                    if (item.key === 'userName' ||
                        item.key === 'authenticationProtocol' ||
                        item.key === 'authenticationPassword' ||
                        item.key === 'dataEncryption' ||
                        item.key === 'dataEncryptioncipher'
                    ) {
                        item.required = false;
                    }
                }
            }
        }

    }

    /**
     * 跳转刀片单元详情页
     * @param bladeServerId
     * @param unitId
     * @param isEdit 单元详情是否可编辑
     */
    toUnitDetail(bladeServerId, unitId, isEdit: boolean, isBladeEdit) {
        this.$router.navigate(
            ['/asset/servicer/blade/unit-detail'],
            {
                queryParams: {
                    bladeServerId: bladeServerId,
                    unitId: unitId,
                    isEdit: isEdit,
                    isBladeEdit: isBladeEdit
                }
            }
        );
    }

    /**
     * 跳转刀片单元概览
     * @param unitId
     */
    toUnitPandect(unitId) {
        this.$router.navigate(
            ['/asset/servicer/blade/unit-pandect/base'],
            {
                queryParams: {
                    unitId: unitId
                }
            }
        );
    }

    /**
     * 返回列表页
     */
    backList() {
        this.$router.navigate(['/asset/servicer/blade']);
    }

    /**
     * 初始化
     */
    init() {
        this.roomId = this.detailInfo.computerRoomId;
        this.cabinetId = this.detailInfo.cabinetId;
        this.standard = this.detailInfo.standard ? this.detailInfo.standard : 1;
        console.log('roomId');
        console.log(this.roomId);

        // 根据机房id获取所有机柜
        if (this.roomId) {
            this.$service.getCabinets(this.roomId, result => {
                this.cabinets = result.cabinetSet;
                this.shelfPosition.forEach(item => {
                    item.forEach(item => {
                        if (item.key === 'cabinetId') {
                            item.selectInfo = {
                                data: this.cabinets,
                                label: 'cabinetName',
                                value: 'cabinetId'
                            }
                        }
                    });
                });
            });
        }

        // 根据机柜可选U位列表
        if (this.cabinetId) {
            let params = {
                'serverId': this.bladeServerId,
                'cabinetId': this.cabinetId,
                'standard': this.standard
            };
            this.$service.getPosUList(params, result => {

                this.UList = [];
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        this.UList[i] = {
                            'name': result[i],
                            'id': result[i]
                        };
                    }
                }
                this.shelfPosition.forEach(item => {
                    item.forEach(item => {
                        if (item.key === 'startU') {
                            item.selectInfo.data = this.UList;
                        }
                    });
                });


                console.log('UList');
                console.log(this.UList);
            });
        }

        this.setBasic();
        this.setSP();
        this.setAgreements();
    }

    /**
     * 确认删除单条刀片服务器
     * @param {string} id
     */
    public deleteUnit(unitId) {
        let unitIds = [];
        unitIds.push(unitId);
        this.$service.deleteUnitSevers(unitIds, result => {
            this.$message.success(`删除刀片单元成功`);
            this.refreshBlade();
        });
    }

    /**
     * 批量删除单元服务器
     */
    batchDelete() {
        this._operating = true;
        let ids: string[] = [];

        if (this.detailInfo.units.length > 0) {
            let units = this.detailInfo.units;
            units.forEach(item => {
                if (item.checked) {
                    ids.push(item.serverId);
                }
            });
        }

        console.log('ids', ids);
        this.$service.deleteUnitSevers(ids, result => {
            this._operating = false;
            this.$message.success(`删除刀片单元成功`);
            this.refreshBlade();
        });
    };

    /**
     * 更新刀片服务器列表
     */
    private refreshBlade() {

        this.$service.getBladeDetail(this.bladeServerId, (data) => {
            console.log('查看刀片服务器详情');
            console.log(data);
            this.detailInfo = data;
            this._refreshStatus();
        });
    }

    /**
     * 校验刀片服务器详情页
     */
    validateBlade() {
        let info = this.detailInfo;
        let requiredAllDone = true; // 必填项有空标识
        let result = false; // 验证通过标识

        if (
            this.validateItem(this.basicProperty, info) &&
            this.validateItem(this.agreementConfig.snmp, info.protocolList[0]) &&
            this.validateItem(this.agreementConfig.ipmi, info.protocolList[1]) &&
            this.validateItem(this.agreementConfig.redfish, info.protocolList[2])
        ) {
            if (info.secondPrincipalId && info.secondPrincipalId === info.firstPrincipalId) {
                this.$message.warning('第一责任人和第二责任人不能相同！');
                result = false
            }
            // 上架信息验证
            if (
                (info.computerRoomId && info.cabinetId && info.startU) ||
                (!info.computerRoomId && !info.cabinetId && !info.startU)
            ) {
                result = true;
            }else {
                this.$message.warning('上架信息不全');
                result = false;
            }
        }
        return result;
    }

    /**
     * 校验每项
     */
    validateItem(column, data) {
        let result;
        for (let row of column) {
            for (let item of row) {
                if (item.required ) {
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
        }
        return true;
    }

    /**
     * 校验规则
     * @param value
     * @param item
     */
    private validateRule(value, item) {
        item.isError = false;
        if (item.rules) {
            for (let rule of item.rules) {
                if (rule.require && !value) {
                    item.isError = true;
                    item.msg = rule.msg || ERROR_MSG.require;
                    break;
                }
                if (!rule.require && !value) {
                    break;
                }
                if (rule.min && value.length < rule.min) {
                    item.isError = true;
                    item.msg = rule.msg || ERROR_MSG.min(rule.min);
                    break;
                }
                if (rule.max && value.length > rule.max) {
                    item.isError = true;
                    item.msg = rule.msg || ERROR_MSG.max(rule.max);
                    break;
                }
                if (rule.regex) {
                    let regex = new RegExp(rule.regex, 'g');
                    if (!regex.test(value)) {
                        item.isError = true;
                        item.msg = rule.msg;
                        break;
                    }
                }
            }
        }
    }

    /**
     * 对规则项添加blur tooltip
     */
    addItemRuleTip(column, data) {
        console.log('addItemRuleTip Run');
        let $component = this;
        for (let row of column) {
            for (let item of row) {

                if (!item.trigger) {
                    item.trigger = 'blur';
                    item.blur = () => {};
                }
                if (!item.msg) {
                    item.msg = '';
                }
                if (!item.isError) {
                    item.isError = false;
                }
                if (item.rules && item.rules.length > 0) {
                    console.log('inRules');
                    item.blur = (value, $this) => {
                        $component.validateRule(value, item);
                    }
                }
            }
        }

    }
}

export class ServerInfo {
    public alarmLevel: string; // 告警级别
    public alarmNum: string; // 告警次数
    public biosFirmVersion: string; //
    public biosSoftVersion: string; //
    public bladeServerCode: string; // 刀片服务器编码
    public bladeServerId: string; // 刀片服务器id
    public bladeServerModelId: number; // 型号id
    public bladeServerModelName: number; // 型号名称
    public bladeServerName: number; // 刀片服务器名称
    public serverProject: string; // 所属项目
    public bladeServerProject: string; // 第一责任人用户id
    public bladeServerSerialNum: string; // 第二责任人id
    public serverMaxdisknumbe: string; // 最大磁盘托架数
    public bladeServerStatus: string; //
    public bmcSoftVersion: string; //
    public cabinetName: string; // 机柜名称
    public cabinetId: string; // 机柜id
    public computerRoomName: string; // 机房名称
    public computerRoomId: string; // 机房名称
    public firstPrincipalId: string; // 第一责任人Id
    public firstPrincipalName: string; // 第一责任人Id
    public manageIp: string; // 管理Ip
    public maxDiskTray: string; //
    public protocolList: Protocol[]; // 协议列表 1:(SNMP );2:(IPMI);3:(REDFISH);4:(带内)',
    public remarks: string; // 服务器上架ID
    public secondPrincipalId: string; // 第二责任人Id
    public secondPrincipalName: string; // 第二责任人名称
    public standard: number; //
    public startU: string; // 起始U位
    public units: Unit[]; // 单元列表

    constructor() {
        this.computerRoomId = '';
        this.bladeServerId = '';
        this.startU = '0';
        let p1 = new Protocol();
        p1.snmpType = 2;
        p1.port = 161;
        p1.retryCount = 3;
        p1.retryTime = 5;
        p1.authenticationProtocol = 1;
        p1.dataEncryption = 1;
        p1.trapGroupWord = 'public';
        p1.confirmTrapGroupWord = 'public';
        p1.protocolType = 1;
        let p2 = new Protocol();
        p2.trapGroupWord = 'public';
        p2.confirmTrapGroupWord = 'public';
        p2.protocolType = 2;
        p2.snmpType = null;
        let p3 = new Protocol();
        p3.protocolType = 3;
        p3.snmpType = null;
        this.protocolList = [p1, p2, p3];
        this.units = [];
        this.remarks = '';
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
class Unit {
    public alarmLevel: number;
    public bandIp: string;
    public bladeServerId: string;
    public cabinetId: string;
    public cabinetName: string;
    public computerRoomId: string;
    public computerRoomName: string;
    public model: string;
    public protocolList: Protocol[]; // 协议列表 1:(SNMP );2:(IPMI);3:(REDFISH);4:(带内)',
    public remarks: string;
    public serverCode: string;
    public serverFirstUserName: string;
    public serverFirstuser: string;
    public serverId: string;
    public serverIp: number;
    public serverModel: string;
    public serverName: string;
    public serverProject: string;
    public serverSecondUserName: string;
    public serverSeconduser: string;
    public shelvesId: string;
    public slotNum: number;
    public standard: string;
    public startU: string;
    public uName: string;
    public checked: boolean;

    constructor() {
        this.checked = false;
    }
}
