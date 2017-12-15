/**
 * Created by WH1709055 on  2017/11/13 20:13
 */

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { UserService } from "../../user.service";
import { User, Role } from "../../../../models";
import {Utils} from "../../../../models/utils";
import { NzMessageService } from 'ng-zorro-antd'
@Component({
    selector: 'app-user-manager-detail',
    templateUrl: './user-manager-detail.component.html',
    styleUrls: ['./user-manager-detail.component.scss'],
    providers: [ UserService, NzMessageService ]
})

export class UserManagerDetailComponent implements OnInit {
    currentUser: User = new User();
    roles = [];
    dealType;
    userId;
    column = [];
    isLoading: boolean = false;


    constructor(
        private $active: ActivatedRoute,
        private $service: UserService,
        public $router: Router,
        private $message: NzMessageService
    ) { }
    ngOnInit() {
        this.$active.params.subscribe(params => {
            this.dealType = params.type;
            this.$active.queryParams.subscribe(params => {
                this.userId = params.id;
                // this.initColumn();
                this.$service.getAllRoles(result => {
                    this.roles = result.data;
                    console.log(this.roles);
                    this.initColumn();
                });
                if (this.dealType !== 'insert') {
                    this.$service.getUserById(this.userId, (result: User) => {
                        this.currentUser = result;
                        this.currentUser.roleId = this.currentUser.role.roleId;
                    });
                } else {

                }
            });
        });
    }

    /**
     * 点击保存按钮
     */
    public saveUser() {

        this.validateColumn(this.column, this.currentUser).then(() => {
            if (!this.isLoading) {
                this.isLoading = true;
                let role = new Role();
                let _user = Utils.cloneModel(this.currentUser);
                role.roleId = this.currentUser.roleId;
                _user.role = role;
                delete _user.role.checked;
                delete _user.roleId;
                delete _user.checked;
                console.log(_user);
                if (this.dealType === 'insert') {
                    this.$service.insertUser(_user).then(success => {
                        this.isLoading = false;
                        this.$router.navigate([`/user/manager`]);
                    }, failed => {
                        this.isLoading = false;
                        this.$message.error(failed.msg)
                    });
                } else if (this.dealType === 'modify') {
                    this.$service.modifyUser(_user).then(success => {
                        this.isLoading = false;
                        this.$router.navigate([`/user/manager`]);
                    }, failed => {
                        this.isLoading = false;
                        this.$message.error(failed.msg)
                    });
                }
            }
        }, () => {

        });

    }

    /**
     * 校验表单数据
     */
    private validateColumn(column, data) {
        return new Promise((resolve, reject) => {
            let isError = false;
            for (let item of column) {
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
            if (isError) {
                reject();
            } else {
                resolve();
            }
        });
    }

    /**
     * 初始化表单数据
     */
    private initColumn() {
        let $component = this;
        if (this.dealType === 'insert') {
            let $component = this;
            this.column = [
                { label: '用户代码', key: 'userCode', require: true, type: 'input',
                    rules: [
                        { require: true, msg: '此项为必填项' },
                        { max: 32, msg: '长度不超过32个字符' }
                    ],
                    trigger: 'blur',
                    msg: ''
                },
                { label: '用户名称', key: 'userName', require: true, type: 'input',
                    rules: [
                        { require: true, msg: '此项为必填项' },
                        { min: 6, msg: '长度不少于6个字符' },
                        { max: 32, msg: '长度不超过32个字符' },
                        { regex: "^[a-zA-Z0-9_\\-\\u4e00-\\u9fa5\\\"\"]+$", msg: '只能由中文、字母、数字、”-”、”_”组成' }
                    ],
                    msg: ''
                },
                { label: '用户状态', key: 'userStatus', require: true, type: 'select',
                    selectInfo: {
                        data: [{ label: '启用', value: '1' }, { label: '停用', value: '0'}], label: 'label', value: 'value',
                        changeHook() { }

                    },
                    rules: [
                        { require: true, msg: '此项为必填项' }
                    ],
                    msg: ''
                },
                { label: '角色', key: 'roleId', require: true, type: 'select',
                    selectInfo: {
                        data: this.roles, label: 'roleName', value: 'roleId',
                        changeHook(value, $this) {
                            console.log(value);
                        }
                    },
                    rules: [
                        { require: true }
                    ]
                },
                { label: '手机号', key: 'phonenumber', type: 'input', require: false,
                    rules: [
                        { regex: "^((13[0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}$", msg: '手机格式有误' }
                    ],
                    msg: ''
                },
                { label: '邮箱', key: 'email', type: 'input', require: false,
                    rules: [
                        { regex: "^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$", msg: '邮箱格式有误' }
                    ],
                    msg: ''
                },
                { label: '密码', key: 'password', require: true, type: 'input',
                    rules: [
                        { require: true, msg: '此项为必填项' },
                        { min: 8, msg: '长度至少8位' },
                        { max: 16, msg: '长度最多不超过16位' },
                        { regex: /(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{8,16}$/, msg: '密码必须包含字母、数字、符号中至少两种，不能包括空格。'}
                    ],
                    msg: ''
                },
                { label: '描述', key: 'userdesc', type: 'textarea',
                    rules: [
                        { max: 200, msg: '长度不超过200个字符' }
                    ],
                    change(value) {
                        $component.currentUser['userdesc'] = value;
                        console.log($component.currentUser);
                        console.log(value, '....');
                    }
                }
            ];
        } else {
            this.column = [
                { label: '用户代码', key: 'userCode', require: true, type: 'input',
                    rules: [
                        { require: true, msg: '此项为必填项' },
                        { max: 32, msg: '长度不超过32个字符' }
                    ],
                    trigger: 'blur',
                    msg: ''
                },
                { label: '用户名称', key: 'userName', require: true, type: 'input',
                    rules: [
                        { require: true, msg: '此项为必填项' },
                        { min: 6, msg: '长度不少于6个字符' },
                        { max: 32, msg: '长度不超过32个字符' },
                        { regex: "^[a-zA-Z0-9_\\-\\u4e00-\\u9fa5\\\"\"]+$", msg: '只能由中文、字母、数字、”-”、”_”或空格组成' }
                    ],
                    msg: ''
                },
                { label: '用户状态', key: 'userStatus', require: true, type: 'select',
                    selectInfo: {
                        data: [{ label: '启用', value: '1' }, { label: '停用', value: '0'}], label: 'label', value: 'value',
                        changeHook() { }
                    },
                    rules: [
                        { require: true, msg: '此项为必填项' }
                    ],
                    msg: ''
                },
                { label: '角色', key: 'roleId', require: true, type: 'select',
                    selectInfo: {
                        data: this.roles, label: 'roleName', value: 'roleId',
                        changeHook(value, $this) {}
                    },
                    rules: [
                        { require: true }
                    ]
                },
                { label: '手机号', key: 'phonenumber', type: 'input', require: false,
                    rules: [
                        { regex: "^((13[0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}$", msg: '手机格式有误' }
                    ],
                    msg: ''
                },
                { label: '邮箱', key: 'email', type: 'input', require: false,
                    rules: [
                        { regex: "^([a-zA-Z0-9]+[-|\\.]?)+[a-zA-Z0-9]@([a-zA-Z0-9]+(-[a-zA-Z0-9]+)?\\.)+[a-zA-Z]{2,}$", msg: '邮箱格式有误' }
                    ],
                    msg: ''
                },
                { label: '描述', key: 'userdesc', type: 'textarea',
                    rules: [
                        { max: 200, msg: '长度不超过200个字符' }
                    ],
                    change(value) {
                        console.log(value, '....');
                    }
                }
            ];
        }

    }
}


