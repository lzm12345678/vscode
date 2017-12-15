import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-history-alarm',
    templateUrl: './history-alarm.component.html',
    styleUrls: ['./history-alarm.component.scss']
})
export class HistoryAlarmComponent implements OnInit {
    isHistory: boolean = true;

    constructor() {
    }

    ngOnInit() {
    }

}
