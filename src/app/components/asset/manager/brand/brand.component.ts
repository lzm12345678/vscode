import { Component, OnInit } from '@angular/core'
import { MissionService } from "../../../../mission-store/mission.service";
import { ManagerService } from "../manager.service";
import { NzMessageService } from 'ng-zorro-antd';
import { Brand, Utils} from "../../../../models";
import { Router } from '@angular/router'

@Component({
    selector: 'app-brand',
    templateUrl: './brand.component.html',
    styleUrls: [ './brand.component.scss' ],
    providers: [ MissionService, ManagerService, NzMessageService ]
})

export class BrandComponent implements OnInit {
    data = [];
    pageIndex: number = 1;
    pageSize: number = 20;
    total: number = 0;
    currentBrand: Brand;
    search = {
        name: '',
        code: ''
    };
    allChecked = false; // 是否全选
    indeterminate = false;
    disabledButton = true;
    checkedNumber = 0;
    isBrandDetailShow: boolean = false;
    brandModalType: string = 'detail';
    constructor(
        private $router: Router,
        private $mission: MissionService,
        private $service: ManagerService,
        private $message: NzMessageService
    ) {
        $mission.pageChangeHook.subscribe(page => {
            this.pageIndex = page.pageIndex;
            this.pageSize = page.pageSize;
            this.refreshBrand();
        });
    }
    ngOnInit() {
        //页面第一次加载列表数据
        this.refreshBrand();
    }

    /**
     * 点击新增按钮跳转
     */
    // showBrand(param: string, brand: Brand = new Brand()) {
    //     this.brandModalType = param;
    //     this.isBrandDetailShow = true;
    //     this.currentBrand = Utils.cloneModel(brand);
    // }
    showBrand(type, id) {
        this.$router.navigate([`/asset/manager/brand/${type}`], {
            queryParams: { id }
        })
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
     * 新增/修改 品牌
     */
    saveBrand() {
        if (this.currentBrand.id) {
            this.$service.modifyBrand(this.currentBrand, result => {
                this.isBrandDetailShow = false;
                this.refreshBrand();
            });
        } else {
            this.$service.insertBrand(this.currentBrand, result => {
                this.isBrandDetailShow = false;
                this.refreshBrand();
            });
        }
    }


    /**
     * 清空查询
     */
    clearSearch() {
        this. search = {
            name: '',
            code: ''
        };
        //调用方法
    }


    /**
     * 模糊查询
     */
    getBrandByField() {
        this.$service.getBrandByField(this.pageIndex, this.pageSize, this.search, result => {

        });
    }

    /**
     * 确认删除品牌
     * @param {Brand} brand
     */
    confirmDelete(brand: Brand) {
        this.$service.deleteBrand(brand.id, result => {
            this.$message.success('删除成功');
            this.refreshBrand();
        });
    }
    cancel() {}

    /**
     * 刷新列表
     */
    private refreshBrand() {
        let body = {
            pageNum : this.pageIndex,
            pageSize : this.pageSize,
            queryTerm: {
                 "modelName" : "",
                 "modelLevel" : 1
            }
        };
        this.$service.getBrandPagination(body, result => {

            this.data = result.data;
            this.total = result.totalCount;
            console.log(result);
        })
    }
}



