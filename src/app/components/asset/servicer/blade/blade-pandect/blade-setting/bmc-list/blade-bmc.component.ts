/**
 * Created by WH1711028 on  2017/11/21
 */

import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'

@Component({
    selector: 'app-blade-bmc',
    templateUrl: './blade-bmc.component.html',
    styleUrls: ['./blade-bmc.component.scss']
})

export class BladeBmcComponent implements OnInit {
    pageIndex: number = 1;
    pageSize: number = 20;
    total: number = 0;




    column = [
        { label: '操作时间', key: 'a' },
        { label: 'IP_Client', key: 'b' },
        { label: '操作人', key: 'c' },
        { label: '操作描述', key: 'd' },
    ];
    data = [];
    constructor() { }
    ngOnInit() {
        for (let i = 0; i < 19; i++) {
            let _random = Math.floor(Math.random() * 1000);
            this.data.push({
                a: _random * i,
                b: _random * i,
                c: _random * i,
                d: _random * i
            })
        }
        this.total = this.data.length;
    }
}

