import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NetworkDetailService } from "./network-detail.service";
// import { Brand, Series, Version, User } from "../../../../../models";
import { NzMessageService } from 'ng-zorro-antd';
import jQ from 'jquery';
import {Result} from "../../../../../models/result";
@Component({
    selector: 'app-network-detail',
    templateUrl: './network-detail.component.html',
    styleUrls: [ './network-detail.component.scss' ],
    providers: [ NetworkDetailService ]
})
export class NetworkDetailComponent implements OnInit {
    // style = {
    //     'background': '#f7f7f7',
    //     'border-radius': '4px',
    //     'margin-bottom': '24px',
    //     'border': '0px'
    // };
    generalProperty = [];   // 一般属性
    shelfPosition = []; // 上架位置
    constructor(
        private $router: Router,
        private $active: ActivatedRoute,
        private $service: NetworkDetailService,
        private $message: NzMessageService
    ) { }

    ngOnInit() {
        
    }
    //返回---------------------------
    backNetwork(){
        window.history.go(-1);
        
    }

    saveNetworkDetail(){
        alert("保存")
    }

    

    /**
     * 配置一般属性
     * @returns {any}
     */
    private setGeneral() {
        let $component = this;
        this.generalProperty = [
            { key: 'serverName', label: '名称', type: 'input', require: true,
                
            },
            { key: 'serverCode', label: '资产编号', type: 'input', require: false,
                rules: [
                    { max: 32 }
                ]
            },
            { key: 'serverModel', label: '型号',  type: 'select', require: true,
                rules: [
                    { require: true }
                ],
                
            },
            { key: 'serverIp', label: '管理IP', type: 'input', require: true,
                // rules: [
                //     { require: true },
                //     { regex: "^((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.)" +
                //     "{3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))$", msg: 'IP格式错误',
                //     },
                //     { event(value) {
                //         return new Promise((resolve, reject) => {
                //             if (value === $component.serverInfo.bandIp && value) {
                //                 reject('带内Ip和管理IP不可重复');
                //             } else {
                //                 $component.$service.validateIpDuplicate($component.serverInfo.serverId || "", value || "")
                //                     .then((success: Result) => {
                //                     success.data ? resolve() : reject(success.msg);
                //                 }, failed => {
                //                     reject();
                //                 });
                //             }
                //         });
                //     }, msg: 'IP不可重复~' }
                // ]
            },
            { key: 'bandIp', label: '带内IP', type: 'input', require: true,
                // rules: [ { require: true },
                //     {regex: "^((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.)" +
                //     "{3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))$", msg: 'IP格式错误' },
                //     { event(value) {
                //         return new Promise((resolve, reject) => {
                //             if (value === $component.serverInfo.serverIp && value) {
                //                 reject('带内Ip和管理IP不可重复');
                //             } else {
                //                 $component.$service.validateIpDuplicate($component.serverInfo.serverId || "", value || "")
                //                     .then((success: Result) => {
                //                     // let msg = success
                //                     success.data ? resolve() : reject(success.msg);
                //                 }, failed => {
                //                     reject();
                //                 });
                //             }
                //         });

                //     }, msg: 'IP不可重复~' }
                // ]
            },
            { key: 'serverProject', label: '所属项目', type: 'input', require: false },
            { key: 'serverFirstuser', label: '第一责任人', type: 'select', require: false,
                // selectInfo: {
                //     data: $component.users,
                //     label: 'userName',
                //     value: 'userId',
                //     changeHook(value, $this) {
                //         $component.users.forEach(item => {
                //             if (item.userId === value) {
                //                 item['nzDisabled'] = true;
                //             } else if (item.userId !== $component.serverInfo.serverSeconduser) {
                //                 item['nzDisabled'] = false;
                //             }
                //         });
                //     }
                // }
            },
            { key: 'serverSeconduser', label: '第二责任人', type: 'select', require: false,
                // selectInfo: {
                //     data: $component.users,
                //     label: 'userName',
                //     value: 'userId',
                //     changeHook(value, $this) {
                //         $component.users.forEach(item => {
                //             if (item.userId === value) {
                //                 item['nzDisabled'] = true;
                //             } else if (item.userId !== $component.serverInfo.serverFirstuser) {
                //                 item['nzDisabled'] = false;
                //             }
                //         });
                //     }
                // }
            }
        ];
    }

   
}

