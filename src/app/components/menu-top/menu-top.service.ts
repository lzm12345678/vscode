import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ProxyService } from "../../proxy.service";
import {  MissionService } from "../../mission-store/mission.service";
import { Result } from "../../models/result";
import { NzModalService } from '_ng-zorro-antd@0.5.5@ng-zorro-antd'

@Injectable()
export class MenuTopService {

    constructor(
        private $http: HttpClient,
        private $mission: MissionService,
        private $proxy: ProxyService,
        private $modal: NzModalService
    ) { }

    public mockMenu(userId: string, callback: Function) {
        console.log('topmenu', userId);
        this.$proxy.get(`/itm/function/${userId}`, callback);
        // return [
        //     {
        //         name: '首页',
        //         router: '/index',
        //         items: []
        //     },
        //     {
        //         name: '资源',
        //         router: '/asset',
        //         items: [
        //             { name: '网管概览', items: [] },
        //             { name: '机柜', items: []},
        //             { name: '主机', items: [
        //                 { name: '设备', items: [
        //                     { name: '网络设备', items: []},
        //                     { name: '单卡', items: []},
        //                     { name: '子卡', items: []}
        //                 ]},
        //                 { name: '配置', items: [
        //                     { name: 'SVF配置管理', items: []},
        //                     { name: '设备软件管理', items: []},
        //                     { name: '智能配置工具', items: []}
        //                 ]},
        //                 { name: '业务', items: []},
        //             ]},
        //             { name: 'BMC', items: []}
        //         ]
        //     },
        //     {
        //         name: '拓扑',
        //         router: '/asset',
        //         items: [
        //             { name: '业务图', items: [
        //                 { name: '告警', items: []},
        //                 { name: '拖拽', items: []},
        //                 { name: '修改属性', items: []}
        //             ] },
        //             { name: '机房布局图', items: []},
        //             { name: '机柜图', items: []}
        //         ]
        //     },
        //     {
        //         name: '机房',
        //         router: '/machine/room/1',
        //         items: []
        //     },
        //     {
        //         name: '监控',
        //         router: '/asset',
        //         items: []
        //     },
        //     {
        //         name: '报表',
        //         router: '/asset',
        //         items: []
        //     },
        //     {
        //         name: '系统',
        //         router: '/asset',
        //         items: [
        //             { name: '用户', items: [] },
        //             { name: '日志', items: [] }
        //         ]
        //     },
        //     {
        //         name: '资产管理',
        //         router: '/asset',
        //         items: []
        //     }
        // ]
    }

    /**
     * 修改密码
     * @param {number} userId
     * @param {string} oldPassword
     * @param {string} password
     * @param {Function} callback
     */
    public modifyPwd(userId: string, oldPassword: string, password: string, callback: Function) {
        let body = { userId, oldPassword, password };
        console.log(body);
        this.$proxy.put(`/itm/users/password`, body, callback);

        // this.$http.put(`/itom/users/password`, body).subscribe((result: Result) => {
        //     console.log(result);
        //     if (result.code === 0) {
        //         callback(result.data);
        //     }else if (result.code === 10001) {
        //         console.log('code10101');
        //         this.$modal.error({
        //             title: `错误提示`,
        //             content: `${result.msg}`,
        //             okText: `确定`,
        //             onOk() {
        //
        //             }
        //         });
        //     };
        // });
    }

    public logout(callback: Function) {
        this.$proxy.delete(`/itm/logout`, callback);
    }
    public getRooms(callback) {
        this.$proxy.get(`/itom/rooms`, callback);
    }

    /**
     * 获取告警信息
     * @returns {Promise<any>}
     */
    public getEveryAlarmCount() {
        return new Promise((resolve, reject) => {
            this.$http.get(`/itom/alarm/getEveryAlarmCount`).subscribe((result: Result) => {
                if (result.code === 0) {
                    resolve(result.data);
                } else {
                    resolve(result.msg);
                }
            });
        });
    }
}

