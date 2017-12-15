/**
 * Created by WH1709055 on  2017/11/13 19:02
 */

import {Component, OnInit} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'
import {VersionDetailService} from "./version-detail.service";
import {Version} from "../../../../../models";
import {NzMessageService} from "_ng-zorro-antd@0.5.5@ng-zorro-antd";
import {Result} from "../../../../../models/result";

@Component({
    selector: 'app-version-detail',
    templateUrl: './version-detail.component.html',
    styleUrls: ['./version-detail.component.scss'],
    providers: [VersionDetailService]
})

export class VersionDetailComponent implements OnInit {
    version: Version = new Version();
    versionId: string = "";
    dealType;
    column = [];
    assetType;
    isLoading: boolean = false;

    constructor(private $active: ActivatedRoute,
                public $router: Router,
                private $service: VersionDetailService,
                private $message: NzMessageService) {
    }

    ngOnInit() {
        this.$active.params.subscribe(params => {
            this.dealType = params.type;
            this.$active.queryParams.subscribe(params => {
                this.versionId = params.id;
                if (this.dealType !== 'insert') {
                    this.$service.getVersionById(this.versionId, result => {
                        this.version = result;
                        this.assetType = this.version.assetType;
                        this.initColumn();
                        if (this.version.isOccupy === 1) {
                            this.column.forEach(item => {
                                if (item.key === 'standard'
                                    || item.key === 'assetType'
                                    || item.key === 'maxSlotNum'
                                ) {
                                    item.disabled = true;
                                }
                            })
                        }
                    });
                } else {
                    this.initColumn();
                }
            });
        });
    }

    /**
     * 提交表单
     */
    public saveVersion() {
        console.log('version', this.version);
        this.validateModelName().then(s => {
            this.validateColumn(this.column, this.version).then(() => {
                if (!this.isLoading) {
                    this.isLoading = true;
                    if (this.dealType !== 'insert') {
                        this.$service.saveVersion(this.version).then(success => {
                            this.isLoading = false;
                            this.$message.success('修改成功~');
                            this.$router.navigate(['/asset/manager/version']);
                        }, failed => {
                            this.$message.error('修改失败~');
                            this.isLoading = false;
                        });
                    }else {
                        this.$service.addVersion(this.version).then(success => {
                            this.isLoading = false;
                            this.$message.success('新增成功~');
                            this.$router.navigate(['/asset/manager/version']);
                        }, failed => {
                            this.isLoading = false;
                            this.$message.error('新增失败~');
                        });
                    }
                }
            }, () => {
            });
        }, () => {
        });

    }

    /**
     * 验证型号填写是否正确
     * @param column
     * @param data
     * @returns {Promise<any>}
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
     * 校验型号名称
     * @returns {Promise<any>}
     */
    private validateModelName() {
        return new Promise((resolve, reject) => {
            let modelNameItem = this.column.filter(item => item.key === 'modelName')[0];
            modelNameItem.rules.filter(item => item.event)[0].event(this.version.modelName || "").then(() => {
                resolve();
            }, failed => {
                modelNameItem.isError = true;
                modelNameItem.msg = failed || modelNameItem.rules.filter(item => item.event)[0].msg;
                reject();
            });
        });
    }

    /**
     * 初始化表单数据
     */
    private initColumn() {
        let $component = this;
        this.column = [
            { label: '型号', key: 'modelName', type: 'input', require: true,
                rules: [
                    {require: true},
                    { max: 50 },
                    { event(value) {
                        return new Promise((resolve, reject) => {
                            $component.$service.validateModelNameDulp($component.versionId || "", value || "")
                                .then((result: Result) => {
                                    result.data ? resolve() : reject(result.msg);
                                }, failed => {
                                    if (failed.code === 20101) {
                                        reject(failed.msg);
                                    } else {
                                        reject();
                                    }
                                });
                        });
                    }, 'msg': '该名称已经存在~' }
                ]
            },
            {label: '品牌', key: 'brandName', type: 'input', require: true, rules: [ {require: true}, { max: 50 } ] },
            {label: '系列', key: 'seriesName', type: 'input', require: true, rules: [ {require: true}, { max: 50 } ] },
            {label: '规格', key: 'standard', type: 'number', require: true, rules: [ {require: true}, { max: 50 } ] },
            {
                label: '类别', key: 'assetType', type: 'select', require: true, rules: [ {require: true} ], selectInfo: {
                    data: [
                        {label: '网络设备', value: 1},
                        {label: '机架服务器', value: 2},
                        {label: '刀片服务器', value: 3},
                        {label: '刀片服务器单元 ', value: 4}
                    ], label: 'label', value: 'value',
                    changeHook(value, $this) {
                        if (value === 3) {
                            if ($component.assetType !== value) {
                                $component.column.push({label: '最大槽位数', key: 'maxSlotNum', type: 'number', require: true,
                                    rules: [ {require: true} ]});
                            }
                            $component.assetType = value;
                        } else {
                            if ($component.assetType === 3) {
                                let _temp = [];
                                $component.column.forEach(item => {
                                    if (item.key !== 'maxSlotNum') {
                                        _temp.push(item);
                                    }
                                });
                                $component.column = _temp;
                                $component.version.maxSlotNum = 0;
                            }
                            $component.assetType = value;
                        }
                    }
                }
            }
        ];
        if (this.version.assetType === 3) {
            this.column.push({label: '最大槽位数', key: 'maxSlotNum', type: 'number', require: true, rules: [ {require: true} ]});
        }
    }
}
