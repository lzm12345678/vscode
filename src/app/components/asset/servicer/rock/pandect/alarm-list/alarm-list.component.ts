/**
 * Created by WH1709055 on  2017/11/10 14:06
 */

import {Component, Input, OnInit} from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { AlarmListService } from "./alarm-list.service";
import { NzMessageService } from 'ng-zorro-antd'

@Component({
    selector: 'app-alarm-list',
    templateUrl: './alarm-list.component.html',
    styleUrls: ['./alarm-list.component.scss'],
    providers: [ AlarmListService, NzMessageService ]
})

export class AlarmListComponent implements OnInit {
    data = [];
    //获取父级属性
    @Input() isCollapsed;
    serverId;
    tabWidth: number = 500; // 告警表格宽度
    pageIndex: number = 1;
    pageSize: number = 20;
    total: number = 0;
    constructor(
        private $router: Router,
        private $message: NzMessageService,
        private $active: ActivatedRoute,
        private $service: AlarmListService
    ) {}
    ngOnInit() {
        this.$active.queryParams.subscribe(params => {
            this.serverId = params.id;
            this.refreshAlarm();
        });

        console.log('tabWidth', document.getElementById('mainBody').offsetWidth);
        // 动态设置告警table宽度
        this.tabWidth = document.getElementById('mainBody').offsetWidth - 10;
        // 浏览器resize 重置table宽度
        window.onresize = () => {
            this.tabWidth = 500;
            console.log('tabWidth', document.getElementById('mainBody').offsetWidth);
            this.tabWidth = document.getElementById('mainBody').offsetWidth - 10;
        }
    }

    /**
     * 确认告警
     * @param data
     */
    public confirmAlarm(data) {
        this.$service.confirmAlarm(data.alarmId, 0).then(success => {
            this.$message.success('确认成功');
            this.refreshAlarm();
        }, failed => {
            this.$message.error(`${failed}`);
        });
    }

    /**
     * 清除告警
     * @param data
     */
    public cleanAlarm(data) {
        this.$service.cleanAlarm(data.alarmId).then(success => {
            this.$message.success('清除成功');
            this.refreshAlarm();
        }, failed => {
            this.$message.error(`${failed}`);
        });
    }

    private refreshAlarm() {
        this.$service.getAlarmList(this.pageIndex, this.pageSize, this.serverId, result => {
            this.data = result.data || [];
            this.total = result.totalCount;
        });
    }
}

