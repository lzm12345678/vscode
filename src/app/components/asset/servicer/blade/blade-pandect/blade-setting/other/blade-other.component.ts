/**
 * Created by WH1711028 on  2017/11/21
 */

import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'

@Component({
    selector: 'app-blade-other',
    templateUrl: './blade-other.component.html',
    styleUrls: ['./blade-other.component.scss']
})

export class BladeOtherComponent implements OnInit {
    column1 = [
        { label: '管理系统IP', key: 'a' },
        { label: '端口', key: 'b' },
        { label: 'Trap团队字', key: 'c' },
        { label: '确认Trap团队字', key: 'd' }
    ];
    data1 = {
        a: '10.1.1.112',
        b: 8080,
        c: '**********',
        d: '************'
    };

    column2 = [
        { label: 'IP地址', key: 'a' },
        { label: '掩码', key: 'b' },
        { label: '网关', key: 'c' },
        { label: 'MAC', key: 'd' },
        { label: 'SNMP Community', key: 'e' }
    ];
    data2 = {
        a: '10.1.1.121',
        b: '255.255.255.0',
        c: '10.1.1.1',
        d: 'ac-de-ef-01-ea',
        e: 'public'
    };
    constructor() { }
    ngOnInit() {}
}


