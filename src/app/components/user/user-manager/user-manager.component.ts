import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'
import { UserService } from '../user.service'
import { User, Password, Role, Utils } from '../../../models';
import { NzMessageService } from 'ng-zorro-antd';
import { MissionService } from "../../../mission-store/mission.service";

@Component({
    selector: 'app-user-manager',
    templateUrl: './user-manager.component.html',
    styleUrls: ['./user-manager.component.scss'],
    providers: [ UserService, MissionService ]
})
export class UserManagerComponent implements OnInit {
    data: User[] = [];
    search: { code: string, name: string, state: string } = {
        code: '',
        name: '',
        state: null
    };
    isModalShow: boolean = false;
    password: Password;
    isModifyPasswordShow: boolean = false;
    dealUser: User;
    pageSize: number = 20;
    pageIndex: number = 1;
    total: number = 0;
    roles: Role[] = [];
    newMsg: string;
    reMsg: string;

    constructor(
        private $service: UserService,
        private $router: Router,
        private $message: NzMessageService,
        private $mission: MissionService
    ) {
        // 订阅页码改变事件
        $mission.pageChangeHook.subscribe(page => {
            this.pageSize = page.pageSize;
            this.pageIndex = page.pageIndex;
            this.refreshUser();
        });
        $mission.alarmChangeHook.subscribe(result => {
            console.log('bread', result);
        });
    }

    allChecked = false; // 是否全选
    disabledButton = true;
    checkedNumber = 0;  // 选中数量
    operating = false; // 批量删除延迟
    indeterminate = false;

    public detailRouter(type: string, id: string) {
        this.$router.navigate([`/user/manager/${type}`], {
            queryParams: { id }
        });
    }

    /**
     * 变更选中状态
     */
    refreshStatus() {
        const _allChecked = this.data.every(user => user.checked === true);
        const _allUnChecked = this.data.every(user => !user.checked);
        this.allChecked = _allChecked;
        // 非全选  非全不选
        this.indeterminate = (!_allChecked) && (!_allUnChecked);
        this.disabledButton = !this.data.some(value => value.checked);
        this.checkedNumber = this.data.filter(value => value.checked).length;
    };

    /**
     * 全选按钮
     * @param value
     */
    checkAll(value) {
        if (value) {
            this.data.forEach(user => {
                user.checked = true;
            });
        } else {
            this.data.forEach(user => {
                user.checked = false;
            });
        }
        this.refreshStatus();
    };

    /**
     * 批量删除
     */
    batchDelete() {
        this.operating = true;
        let userIds: string[] = [];
        this.data.forEach(user => {
            if (user.checked) {
                userIds.push(user.userId);
            }
        });
        this.$service.deleteUsers(userIds, result => {
            console.log('sdfsefsefes', result);
            this.operating = false;
            this.refreshUser();
            this.disabledButton = true;
            this.indeterminate = false;
        });
    };

    /**
     * 模糊查询
     */
    searchByField() {
        // if (this.search.code.trim() || this.search.name.trim() || this.search.state) {
            console.log(this.search);
            this.$service.getUserByField({
                userCode: this.search.code,
                userName: this.search.name,
                userStatus: this.search.state,
                pageSize: this.pageSize,
                pageNum: this.pageIndex
            }, result => {
                this.data = result.users;
                this.total = result.total;
                console.log('searchResult', result);
            })
        // }
    }

    /**
     * 清空查询
     */
    clearField() {
        this.search = {
            code: '',
            name: '',
            state: null
        };
    }

    /**
     * 打开修改密码弹框
     * @param {User} user
     */
    public modifyPassword(user: User) {
        this.isModifyPasswordShow = true;
        this.password = new Password();
        this.dealUser = Utils.cloneModel(user);
    }

    /**
     * 关闭修改密码弹框
     */
    public closePwdModel() {
        this.newMsg = '';
        this.reMsg = '';
        this.isModifyPasswordShow = false;
    }

    blur(param) {
        if (param === 'new') {
            if (this.password.newPwd    ) {
                let regex = new RegExp(/(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{8,16}$/, 'g');
                if (this.password.newPwd.length < 8 || this.password.newPwd.length > 16) {
                    this.newMsg = '密码长度为8-16位~';
                } else if (!regex.test(this.password.newPwd)) {
                    this.newMsg = '密码必须包含字母、数字、符号中至少两种，不能包括空格';
                }
            } else {
                this.newMsg = '密码不能为空~';
            }
        } else if (param === 're') {
            if (this.password.rePwd !== this.password.newPwd) {
                this.reMsg = '新旧密码必须一致~';
            } else {
                this.reMsg = '';
            }
        }
    }

    /**
     * 保存密码
     */
    savePassword() {
        this.blur('new');
        this.blur('re');
        if (!this.newMsg && !this.reMsg) {
            this.$service.modifyPassword(this.dealUser.userId, this.password.newPwd, result => {
                this.isModifyPasswordShow = false;
                this.$message.success('修改密码成功~');
            });
        }
    }
    cancel(): void {
        // this.$message.info('取消~')
    }

    /**
     * 确认删除用户
     * @param {User} user
     */
    confirmDelete(user: User) {
        this.$service.deleteUsers([user.userId], result => {
            this.refreshUser();
        });
    };

    // /**
    //  * 启用/停用
    //  * @param {User} user
    //  */
    // confirmState(user: User) {
    //     this.$service.changeStatus(user.userId, result => {
    //         this.refreshUser();
    //     });
    // }
    /**
     * 启用/停用
     * @param {User} user
     */
    toggleUserStatus(user: User) {
        if (user.userStatus === '1') {
            user.userStatus = '0';
        }else {
            user.userStatus = '1';
        }
        this.$service.changeStatus(user.userId, result => {
            console.log('改变用户状态成功')
        });
    }
    ngOnInit() {
        this.$service.getAllRoles(result => {
            console.log('roles:', result);
            this.roles = result;
        });
    }

    /**
     * fsefsef
     */
    public refreshUser() {
        this.$service.getUserPagination( this.pageIndex, this.pageSize, result => {
            console.log('current', result);
            this.data = result.users;
            this.total = result.total;
        });
    }

}
