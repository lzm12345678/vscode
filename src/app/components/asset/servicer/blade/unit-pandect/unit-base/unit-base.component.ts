/**
 * Created by WH1711028 on  2017/11/20
 */

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { UnitBaseService } from "./unit-base.service";
import { Rock } from "../../../../../../models";

@Component({
    selector: 'app-unit-base',
    templateUrl: './unit-base.component.html',
    styleUrls: ['./unit-base.component.scss'],
    providers: [ UnitBaseService ]
})

export class UnitBaseComponent implements OnInit {
    serverId: string;
    baseInfo: Rock = new Rock();
    baseColumn = [
        { label: '资产名称', key: 'serverName'},
        { label: '管理IP', key: 'serverIp'},
        { label: '带内ip', key: 'bandIp'},

        { label: '型号', key: 'model'},
        { label: '槽位数', key: 'slotNum'},
        { label: '序列号', key: 'xlh'},
        { label: '资产编号', key: 'serverCode'},

        { label: '所属项目', key: 'serverProject'},
        { label: 'BIOS软件版本', key: 'biosrj'},
        { label: 'BIOS固件版本', key: 'biosgj'},

        { label: 'BMC软件版本', key: 'bmc'},
        { label: '第一责任人', key: 'serverFirstuser'},
        { label: '第二责任人', key: 'serverSeconduser'},
    ];

    shelfColumn = [
        { label: '所在机房', key: 'computerRoomId' },
        { label: '所在机柜', key: 'cabinetId' },
        { label: '所在U位', key: 'startU' }
    ];

    // baseInfo = {
    //     name: 'gyj',
    //     ip: '127.0.0.1',
    //     level: 3,
    //     xh: '什么型号',
    //     zcbh: '资产编号',
    //     ssxm: 'fiberhome',
    //     biosrj: 'sefsefsa',
    //     biosgj: 'sefasfeasef',
    //     bmc: 'ijnmkoplfe',
    //     dyzrr: '张三',
    //     dezrr: '李四'
    // };

    shelfInfo = {
        computerRoomId: '10086机房',
        szjg: '9636机柜',
        szuw: '23'
    };

    constructor(
        private $active: ActivatedRoute,
        private $service: UnitBaseService
    ) { }
    ngOnInit() {
        this.$active.queryParams.subscribe(params => {
            this.serverId = params.unitId;
            this.$service.getServerBaseInfo(this.serverId, result => {
                this.baseInfo = result;
                console.log('baseInfo', result);
            });
        });
    }
}


