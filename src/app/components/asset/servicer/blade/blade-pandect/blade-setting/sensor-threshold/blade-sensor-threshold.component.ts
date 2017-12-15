/**
 * Created by WH1711028 on  2017/11/21
 */

import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'

@Component({
    selector: 'app-blade-sensor-threshold',
    templateUrl: './blade-sensor-threshold.component.html',
    styleUrls: [ './blade-sensor-threshold.component.scss' ]
})

export class BladeSensorThresholdComponent implements OnInit {
    pageIndex: number = 1;
    pageSize: number = 20;
    total: number = 0;

    column = [
        { label: '传感器名称', key: 'a' },
        { label: '状态', key: 'b' },
        { label: '当前值', key: 'c' },
        { label: '单位', key: 'd' },
        { label: '紧急上门限', key: 'e' },
        { label: '紧急下门限', key: 'f' },
        { label: '严重上门限', key: 'g' },
        { label: '严重下门限', key: 'h' },
        { label: '轻微上门限', key: 'i' },
        { label: '轻微下门限', key: 'j' },
        { label: '操作', key: 'k' },
    ];
    data = [];
    constructor() { }
    ngOnInit() {
        for (let i = 0; i < 500; i++) {
            let _random = Math.floor(Math.random() * 1000);
            this.data.push({
                a: _random * i,
                b: _random * i,
                c: _random * i,
                d: _random * i,
                e: _random * i,
                f: _random * i,
                g: _random * i,
                h: _random * i,
                i: _random * i,
                j: _random * i,
                k: _random * i,
            });
        }
        this.total = this.data.length;
    }
}
