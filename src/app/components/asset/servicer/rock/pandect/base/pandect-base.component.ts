/**
 * Created by WH1709055 on  2017/11/10 13:20
 */

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { PandectBaseService } from "./pandect-base.service";
import { Rock } from "../../../../../../models";

@Component({
    selector: 'app-pandect-base',
    templateUrl: './pandect-base.component.html',
    styleUrls: ['./pandect-base.component.scss'],
    providers: [ PandectBaseService ]
})

export class PandectBaseComponent implements OnInit {
    serverId: string;
    baseInfo: Rock = new Rock();
    baseColumn = [
        { label: '资产名称', key: 'serverName'},
        { label: '管理IP', key: 'serverIp'},
        { label: '带内ip', key: 'bandIp'},

        { label: '型号', key: 'serverModel'},
        { label: '序列号', key: 'xlh'},
        { label: '资产编号', key: 'serverCode'},

        { label: '所属项目', key: 'serverProject'},
        { label: 'BIOS软件版本', key: 'biosrj'},
        { label: 'BIOS固件版本', key: 'biosgj'},

        { label: 'BMC软件版本', key: 'bmc'},
        { label: '第一责任人', key: 'serverFirstUserName'},
        { label: '第二责任人', key: 'serverSecondUserName'},
    ];

    shelfColumn = [
        { label: '所在机房', key: 'computerRoomName' },
        { label: '所在机柜', key: 'cabinetName' },
        { label: '所在U位', key: 'startU' }
    ];

    shelfInfo = {
        computerRoomId: '10086机房',
        szjg: '9636机柜',
        szuw: '23'
    };

    constructor(
        private $active: ActivatedRoute,
        private $service: PandectBaseService
    ) { }
    ngOnInit() {
        this.$active.queryParams.subscribe(params => {
            this.serverId = params.id;
            this.$service.getServerBaseInfo(this.serverId, result => {
                this.baseInfo = result;
                if (this.baseInfo.serverModel) {
                    this.$service.getModelById(this.baseInfo.serverModel, result => {
                        this.baseColumn.forEach(item => {
                             if (item.key === 'serverModel') {
                                 item['selectData'] = {
                                     data: [result],
                                     label: 'modelName',
                                     value: 'id'
                                 };
                             }
                        });
                    });
                }
            });
        });
    }
}


