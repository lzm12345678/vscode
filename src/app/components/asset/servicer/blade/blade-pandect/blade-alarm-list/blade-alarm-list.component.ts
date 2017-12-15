/**
 * Created by WH1711028 on  2017/11/20
 */

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { BladeAlarmListService } from "./blade-alarm-list.service";

@Component({
    selector: 'app-blade-alarm-list',
    templateUrl: './blade-alarm-list.component.html',
    styleUrls: ['./blade-alarm-list.component.scss'],
    providers: [ BladeAlarmListService ]
})

export class BladeAlarmListComponent implements OnInit {
    data = [];
    pageIndex: number = 1;
    pageSize: number = 20;
    total: number = 0;
    constructor(
        private $router: Router,
        private $active: ActivatedRoute,
        private $service: BladeAlarmListService
    ) {}
    ngOnInit() {
        this.$active.queryParams.subscribe(params => {
            this.$service.getAlarmList(this.pageIndex, this.pageSize, params.id, result => {
                this.data = result.data || [];
                this.total = result.totalCount;
            });
        });
    }
}

