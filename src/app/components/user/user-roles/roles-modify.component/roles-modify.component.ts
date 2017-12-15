/**
 * Created by WH1709055 on  2017/11/11 13:54
 */

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RolesModifyService } from "./roles-modify.service";
import { NzModalService } from 'ng-zorro-antd';
import { CustomTreeComponent } from "../../../custom-modal/custom-tree/custom-tree.component";
import {MissionService} from "../../../../mission-store/mission.service";

@Component({
    selector: 'app-roles-modify',
    templateUrl: './roles-modify.component.html',
    styleUrls: ['./roles-modify.component.scss'],
    providers: [ RolesModifyService, NzModalService, CustomTreeComponent ]
})

export class RolesModifyComponent implements OnInit {
    pageIndex: number = 1;
    pageSize: number = 20;
    total: number = 0;

    // 权限表格
    funcPageIndex: number = 1;
    funcPageSize: number = 20;
    funcTotal: number = 0;

    roleId: string;
    functionList = [];
    roleFunctionList = [];



    isVisible: boolean = false;

    userList = []; // 用户列表
    userThs = [
        '用户名称',
        '用户描述'
    ];
    userTds = [
        'userName',
        'userdesc'
    ];
    funcThs = [
        '操作',
        '路径信息'
    ];
    funcTds = [
        'name',
        'urlDesc'
    ];
    roleName = ''; // 角色名称
    roleDes = ''; // 角色描述
    constructor(
        private $active: ActivatedRoute,
        private $service: RolesModifyService,
        private $modal: NzModalService,
        private $mission: MissionService,
        private customTree: CustomTreeComponent
    ) {

    }
    ngOnInit() {
        this.$active.queryParams.subscribe(params => {
            this.roleId = params.id;
            let $this = this;
            this.$service.getRoleById(this.roleId, result => {
                console.log('role--', result);
                this.roleName = result.roleName;
                this.roleDes = result.roleDescribe;
            });

            // // 查询角色权限分页接口参数
            // let funcTressParams = {
            //     pageSize: this.funcPageSize,
            //     pageNum: this.funcPageIndex,
            //     queryTerm: {
            //         roleId: this.roleId
            //     }
            // };
            // // 获取权限列表数据据
            // this.$service.getRoleFunctionTree(funcTressParams, result => {
            //     console.log('funcTree', result);
            //
            //     let _result = [];
            //     this.recursionFunc(result.data, _result);
            //     this.functionList = _result;
            //
            //     let __result = [];
            //     result.data.forEach(item => {
            //         let obj = {
            //             id: item.id,
            //             title: item.name,
            //             parent: item.parent,
            //             status: item.status,
            //             children: [],
            //             expand: true,
            //             toggle: false,
            //             checked: 0
            //         };
            //         if (!item.child || item.child.length === 0) {
            //             obj.expand = false;
            //         }
            //         this.recursion(item, obj);
            //         __result.push(obj);
            //         this.roleFunctionList = __result;
            //         // this.changeBosom(this.roleFunctionList);
            //         this.roleFunctionList.forEach(item => {
            //             if (item.children && item.children.length !== 0) {
            //                 this.changeBosom(item.children);
            //             }
            //         });
            //         this.roleFunctionList.forEach(item => {
            //             if (item.children && item.children.length !== 0) {
            //                 this.changeOverstory(item.children);
            //             }
            //         });
            //     });
            // });


            // 获取角色用户分页数据
            // this.refreshRoleDetail();

            // 获取角色权限表格数据
            this.$service.getRoleFunctionTree(this.roleId, result => {
                console.log('roleRunc', result);
                let _result = [];
                this.recursionFunc(result, _result);
                this.functionList = _result;

                let __result = [];
                result.forEach(item => {
                    let obj = {
                        id: item.id,
                        title: item.name,
                        parent: item.parent,
                        status: item.status,
                        children: [],
                        expand: true,
                        toggle: false,
                        checked: 0
                    };
                    if (!item.child || item.child.length === 0) {
                        obj.expand = false;
                    }
                    this.recursion(item, obj);
                    __result.push(obj);
                    this.roleFunctionList = __result;
                    // this.changeBosom(this.roleFunctionList);
                    this.roleFunctionList.forEach(item => {
                        if (item.children && item.children.length !== 0) {
                            this.changeBosom(item.children);
                        }
                    });
                    this.roleFunctionList.forEach(item => {
                        if (item.children && item.children.length !== 0) {
                            this.changeOverstory(item.children);
                        }
                    });
                });
            });
            this.$service.getAllFunction(result => {
                console.log(result);
                // let _result = [];
                // result.forEach(item => {
                //     let obj = {
                //         id: item.id,
                //         title: item.name,
                //         parent: item.parent,
                //         children: [],
                //         expand: true,
                //         toggle: false,
                //         checked: 0
                //     };
                //     if (!item.child || item.child.length === 0) {
                //         obj.expand = false;
                //     }
                //     this.recursion(item, obj);
                //     _result.push(obj);
                //     this.demo = _result;
                // });
            })
        });

    }

    public openInsertModal() {
        this.isVisible = true;
        // this.$modal.info({
        //     title: '操作组列表',
        //     content: this.customTree,
        //     componentParams: {
        //         data: this.demo,
        //         allData: this.demo
        //     }
        // })
    }

    /**
     * 保存按钮
     */
    public saveFunction() {
        this.isVisible = false;
    }

    /**
     * 递归格式化数据
     * @param item
     * @param result
     */
    private recursion(item, result) {
        if (item.child && item.child.length !== 0) {
            item.child.forEach(item => {
                let obj = {
                    id: item.id,
                    title: item.name,
                    parent: item.parent,
                    status: item.status,
                    children: [],
                    expand: true,
                    toggle: false,
                    checked: 0
                };
                if (item.child && item.child.length !== 0) {
                    this.recursion(item, obj);
                } else {
                    obj.expand = false;
                }
                result.children.push(obj);
            });
        }
    }

    /**
     * 改变最底层的checked状态
     * @param data
     */
    private changeBosom(data) {
        data.forEach(item => {
            if (!item.children || item.children.length === 0) {
                item.checked = 2;
            } else {
                this.changeBosom(item.children);
            }
        });
    }

    /**
     * 向上递归改变顶层状态
     * @param data
     */
    private changeOverstory(data) {
        data.forEach(item => {
            if (!item.children || item.children.length === 0) {
                this.changeParentCheck(item.parent, this.roleFunctionList);
            } else {
                this.changeOverstory(item.children);
            }
        });
    }

    private recursionFunc(data, result) {
        data.forEach(item => {
            if (item.status === '1') {
                result.push(item);
            }
            if (item.child && item.child.length !== 0) {
                this.recursionFunc(item.child, result);
            }
        });
    }

    /**
     * 向上递归 动态改变父级checked状态
     * @param parentId
     * @param data
     */
    private changeParentCheck(parentId, data) {
        let _parentId: string = '0';
        data.forEach(item => {
            // 遍历出目标父级 由子级列表选中状态改变目标父级状态
            if (item.id + '' === parentId + '') {
                let flag = [];
                item.children.forEach(child => {
                    flag.push(child.checked);
                });
                if (!flag.includes(2) && !flag.includes(1)) {
                    item.checked = 0;
                } else if (!flag.includes(0) && !flag.includes(1)) {
                    item.checked = 2;
                } else {
                    item.checked = 1;
                }
                _parentId = item.parent;
                return false;
            } else {
                // 若该层级未找到目标父级   则继续向下遍历
                this.changeParentCheck(parentId, item.children);
            }
        });
        // 若目标父级存在更上一级的父级  则继续向上递归
        if (_parentId !== '0') {
            this.changeParentCheck(_parentId, this.roleFunctionList);
        }
    }

    private refreshRoleDetail() {
        // 查询角色用户分页接口参数
        let userTressParams = {
            pageSize: this.pageSize,
            pageNum: this.pageIndex,
            queryTerm: {
                roleId: this.roleId
            }
        };
        this.$service.getUserTree(userTressParams, result => {
            console.log('userTree', result);
            this.userList = result.data;
            this.total = result.totalCount;
        });
        // 查询角色权限分页接口参数
        let funcTressParams = {
            pageSize: this.funcPageSize,
            pageNum: this.funcPageIndex,
            queryTerm: {
                roleId: this.roleId
            }
        };
        this.$service.getRoleFunctionPage(funcTressParams, result => {
            console.log('funcPage', result);
            this.functionList = result.data;
            this.funcTotal = result.totalCount;
        });
    }
}
