import {Component, OnInit} from '@angular/core'
import {MissionService} from "../../../../mission-store/mission.service";
import {ManagerService} from "../manager.service";
import {NzMessageService} from 'ng-zorro-antd';
import {Version, Utils} from "../../../../models";
import { Router } from '@angular/router'

@Component({
    selector: 'app-version',
    templateUrl: './version.component.html',
    styleUrls: ['./version.component.scss'],
    providers: [MissionService, ManagerService, NzMessageService]
})
export class VersionComponent implements OnInit {

    data = [];
    pageIndex: number = 1;
    pageSize: number = 20;
    total: number = 0;
    search = {
        name: '',
        code: ''
    };
    searchName;
    assetType;
    VersionModalType;
    VersionDetailShow;
    currentVersion;
    selectedBrand;
    selectedSeries;
    brand;
    series;

    allChecked = false; // 是否全选
    disabledButton = true;
    checkedNumber = 0;  // 选中数量
    operating = false; // 批量删除延迟
    indeterminate = false;
    constructor(
        private $router: Router,
        private $mission: MissionService,
        private $service: ManagerService,
        private $message: NzMessageService
    ) {
        $mission.pageChangeHook.subscribe(page => {
            this.pageIndex = page.pageIndex;
            this.pageSize = page.pageSize;
            this.getVersionList();
        });
    }

    ngOnInit() {
        // this.getBrand();
        this.getVersionList();
    }

    quickRouter(type, id) {
        this.$router.navigate([`/asset/manager/version/${type}`], {
            queryParams: { id }
        })
    }

    /**
     * 删除型号
     */
    confirmDelete(version: Version) {
        this.$service.deleteVersion(version.id).then(() => {
            this.$message.success('删除成功');
            this.getVersionList();
        }, failed => {
            this.$message.error(failed.msg);
        });
    }
    /**
     *批量删除
     */
    batchDelete() {
        let ids: any[] = [];
        this.data.forEach(item => {
            if (item.checked) {
                ids.push(item.id)
            }
        });
        let str = ids.join('-');
        this.$service.deleteVersion(str).then(() => {
            this.$message.success('删除成功');
            this.getVersionList();
            this.disabledButton = true;
            this.indeterminate = false;
        }, failed => {
            this.data.forEach(item => {
                item.checked = false;
            });
            this.refreshStatus();
            this.disabledButton = true;
            this.indeterminate = false;
            this.$message.error(failed.msg);
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
            this.data.forEach(item => {
                item.checked = true;
            });
        } else {
            this.data.forEach(item => {
                item.checked = false;
            });
        }
        this.refreshStatus();
    };
    /**
     * 获取型号列表
     */
    getVersionList() {
        this.$service.getVersionPagination(this.pageIndex, this.pageSize, result => {
            this.data = result.data;
            this.total = result.totalCount;
        })
    }

    /**
     * 清空查询
     */
    public clearSearch() {
        this.searchName = '';
        this.assetType = null;
        this.$service.getVersionByField(this.pageIndex, this.pageSize, this.searchName, this.assetType, result => {
            this.data = result.data;
            this.total = result.totalCount;
        })
    }

    /**
     * 查询功能
     */
    getSeriesByField() {
        this.$service.getVersionByField(this.pageIndex, this.pageSize, this.searchName, this.assetType, result => {
            this.data = result.data;
            this.total = result.totalCount;
        })
    }

}
