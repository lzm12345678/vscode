import { Component, OnInit } from '@angular/core'
import { MissionService } from "../../../../mission-store/mission.service";
import { ManagerService } from "../manager.service";
import { NzMessageService } from 'ng-zorro-antd';
import { Utils, Brand, Series } from "../../../../models";
import {Router} from "@angular/router";
@Component({
    selector: 'app-series',
    templateUrl: './series.component.html',
    styleUrls: [ './series.component.scss' ],
    providers: [ MissionService, ManagerService, NzMessageService ]

})

export class SeriesComponent implements OnInit {
    // data = [];
    // pageIndex: number = 1;
    // pageSize: number = 20;
    // total: number = 0;
    currentSeries: Series;
    search = {
        name: '',
        parentId: -1
    };
    // series: Series[] = [];
    isSeriesDetailShow: boolean = false;
    seriesModalType: string = 'detail';

    //自己的---------------------------------------------------------------------
    data = [];
    pageIndex: number = 1;
    pageSize: number = 20;
    total: number = 0;
    queryTerm:object={
        modelName:'',
        modelLevel: 2
    }
    series: Series[] = [];

    //全选和反选--------------
    allChecked = false; // 是否全选
    checkedNumber:number=0;
    disabledButton = true;
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
            this.initSeries();
        });
    }
    ngOnInit() {
        //this.refreshSeries();
        // this.$service.getAllBrand(result => {
        //     this.series = result;
        // });

        //------------------------------------------------------
        this.initSeries();
    }

    /**
     * 模糊分页查询
     */
    public getBrandByField() {
        console.log(this.search);
        this.$service.getSeriesByField(this.pageIndex, this.pageSize, this.search, result => {
            this.data = result.data;
            this.total = result.totalCount;
        });
    }

    /**
     * 打开系列弹框
     * @param {string} param
     * @param {Series} series
     */
    public showSeries(param: string, series: Series = new Series()) {
        this.isSeriesDetailShow = true;
        this.currentSeries = Utils.cloneModel(series);
        this.seriesModalType = param;
    }

    /**
     * 新增/修改系列
     */
    // public saveSeries() {
    //     if (this.currentSeries.id) {
    //         console.log(this.currentSeries);
    //         this.$service.modifySeries(this.currentSeries, result => {
    //             this.isSeriesDetailShow = false;
    //             this.refreshSeries();
    //         });
    //     } else {
    //         this.$service.insertSeries(this.currentSeries, result => {
    //             this.isSeriesDetailShow = false;
    //             this.refreshSeries();
    //         });
    //     }
    // }

    /**
     * 确认删除系列
     * @param {Series} series
     */
    // public confirmDelete(series: Series) {
    //     this.$service.deleteSeries(series, result => {
    //         this.refreshSeries();
    //     });
    // }

    //初始化table数据-------------------------------------
    private refreshSeries() {
        this.$service.getSeriesPagination(this.pageIndex, this.pageSize, result => {
            console.log(result);
            this.data = result.data;
            this.total = result.totalCount;
        });
    }


    /**
     * 自己的================== start ============================================
     * 
     */

    //获取table表格的data 
    initSeries(){
        // let url=`/itom/newModel/queryAll`
        let body = {
                pageNum:this.pageIndex,
                pageSize:this.pageSize,
                queryTerm:this.queryTerm
           }
        this.$service.getSerieslist(body,res=>{
            console.log(118798707070)
            console.log(res)
            this.data = res.data;
            this.total = res.totalCount;
        })
    }

    //新增系列---------------------------- 
    addSeries(type,id){
        // this.$router.navigate([`/asset/manager/version/${type}`], {
        //     queryParams: { id }
        // })
        this.$router.navigate([`/asset/manager/series/${type}`])
    }

    //清空查询----------------------------
    clearField(){
        this.queryTerm={
            modelName:'',
            modelLevel: 2
        }
    }

    //修改--------------------------------
    editSeries(){

    }
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
     *批量删除
     */
    batchDelete() {
        let ids: any[] = [];
        this.data.forEach(item => {
            if (item.checked) {
                ids.push(item.modelId)
            }
        });
        let str = ids.join('-');
        this.$service.deleteSeries(str).then(() => {
            this.$message.success('删除成功');
            this.initSeries();
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
        const _allChecked = this.data.every(item => item.checked === true);
        const _allUnChecked = this.data.every(item => !item.checked);
        this.allChecked = _allChecked;
        // 非全选  非全不选
        this.indeterminate = (!_allChecked) && (!_allUnChecked);
        this.disabledButton = !this.data.some(value => value.checked);
        this.checkedNumber = this.data.filter(value => value.checked).length;
    };

    /**
     * 删除型号
     */
    confirmDeleteSeries(series: Series) {
        
        this.$service.deleteSeries(series.modelId).then(() => {
            this.$message.success('删除成功');
             this.initSeries();
        }, failed => {
            this.$message.error(failed.msg);
        });
    }
    

    //======================== end  ======================================================








}


