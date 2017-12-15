import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { Role } from '../../../models'
import { UserService } from '../user.service'
import { MissionService } from '../../../mission-store/mission.service'
import { NzMessageService } from 'ng-zorro-antd'
import { NzModalService } from 'ng-zorro-antd'

@Component({
    selector: 'app-user-roles',
    templateUrl: './user-roles.component.html',
    styleUrls: ['./user-roles.component.scss'],
    providers: [ MissionService, UserService ]
})
export class UserRolesComponent implements OnInit {
    data: Role[] = [];
    search = {
        name: ''
    };
    pageSize: number = 20;
    pageIndex: number = 1;
    total: number = 0;

    // 表格交互
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
        this._disabledButton = !this.data.some(value => value.checked);
        this._checkedNumber = this.data.filter(value => value.checked).length;
    };

    _checkAll(value) {
        console.log(value);
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
            this.data.forEach(value => value.checked = false);
            this._refreshStatus();
            this._operating = false;
        }, 1000);
    };

    constructor(
        private $mission: MissionService,
        public $service: UserService,
        public $modal: NzModalService,
        public $message: NzMessageService,
        public $router: Router
    ) {
        $mission.pageChangeHook.subscribe(page => {
            this.pageSize = page.pageSize;
            this.pageIndex = page.pageIndex;
            this.refreshRoles();
        });
    }
    ngOnInit() {
    }
    public searchByField() {
        console.log(this.search);
        this.$service.getRolesByField(this.pageIndex, this.pageSize, this.search.name, result => {
            this.data = result.roles;
            this.total = result.total;
        });
    }

    /**
     * 修改用户角色信息
     * @param {Role} role
     */
    public routerToDetail(type: string, id: string) {
        this.$router.navigate([`/user/roles/${type}`], { queryParams: { id } });
    }

    /**
     * 取消
     */
    public cancel() { }

    /**
     * 删除角色
     * @param {Role} role
     */
    public confirmDelete(role: Role) {
        this.$modal.info({
            title: '删除角色',
            content: '12/8版本不做要求'
        })
    }

    /**
     * 刷新列表
     */
    private refreshRoles() {
        this.$service.getAllRoles(result => {
            this.data = result.data;
            this.total = 2;
        });
    }
}
