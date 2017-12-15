/**
 * Created by WH1711028 on  2017/11/22
 */

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { UnitAlarmListService } from "./unit-alarm-list.service";

@Component({
    selector: 'app-unit-alarm-list',
    templateUrl: './unit-alarm-list.component.html',
    styleUrls: ['./unit-alarm-list.component.scss'],
    providers: [ UnitAlarmListService ]
})

export class UnitAlarmListComponent implements OnInit {
    data = [];
    pageIndex: number = 1;
    pageSize: number = 20;
    total: number = 0;
    constructor(
        private $router: Router,
        private $active: ActivatedRoute,
        private $service: UnitAlarmListService
    ) {}
    ngOnInit() {
        this.$active.queryParams.subscribe(params => {
            this.$service.getAlarmList(this.pageIndex, this.pageSize, params.unitId, result => {
                console.log('alarmInfo', result);
                this.data = result.data || [];
                this.total = result.totalCount;
            });
        });
    }
}

