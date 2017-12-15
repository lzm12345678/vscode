/**
 * Created by WH1709055 on  2017/11/10 19:53
 */

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { MonitorTaskService } from "./monitor-task.service";
import { MissionService } from "../../../../../../mission-store/mission.service";

@Component({
    selector: 'app-monitor-task',
    templateUrl: './monitor-task.component.html',
    styleUrls: ['./monitor-task.component.scss'],
    providers: [ MonitorTaskService, MissionService ]
})

export class MonitorTaskComponent implements OnInit {
    pageIndex: number = 1;
    pageSize: number = 20;
    total: number = 0;
    column = [
        { label: '任务名称', key: 'mtTaskName' },
        { label: '设备名称', key: 'equipmentName' },
        { label: '设备IP', key: 'equipmentIp' },
        { label: '模板', key: 'mtName' },
        { label: '任务状态', key: 'mtStatus' },
        { label: '任务周期', key: 'mtCycle' },
        { label: '任务描述', key: 'mtDescribe' }
    ];
    data: Monitor[] = [];
    monitorId;
    constructor(
        private $active: ActivatedRoute,
        private $mission: MissionService,
        private $service: MonitorTaskService
    ) {
        $mission.pageChangeHook.subscribe(page => {
            this.pageIndex = page.pageIndex;
            this.pageSize = page.pageSize;
            this.refreshMonitor(this.monitorId);
        });
    }
    ngOnInit() {
        this.$active.queryParams.subscribe(params => {
            this.monitorId = params.id;
            this.refreshMonitor(this.monitorId);
        });
    }

    private refreshMonitor(id) {
        this.$service.getAllMonitorTask(
            { pageSize: this.pageSize, pageNum: this.pageIndex, equipmentId: id }, result => {
                console.log('mt', result);
                this.data = result.data;
                this.total = result.totalCount;
            });
    }
}

class Monitor {
    public quipmentIp;
    public equipmentName;
    public mtCycle;
    public mtDescribe; // "描述"
    public mtName;
    public mtStatus;
    public mtTaskId;
    public mtTaskName; // "监控任务1"
    public serverId;
}

