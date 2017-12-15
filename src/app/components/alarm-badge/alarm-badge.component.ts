import { Component, OnInit, NgModule, Input } from '@angular/core';

@NgModule({
    imports:      [],
    declarations: [ AlarmBadgeComponent ],
    bootstrap:    [ AlarmBadgeComponent ]
})

@Component({
    selector: 'app-alarm-badge',
    templateUrl: './alarm-badge.component.html',
    styleUrls: ['./alarm-badge.component.scss']
})
export class AlarmBadgeComponent implements OnInit {
    @Input() alarm;
    constructor() { }

    ngOnInit() {
        console.log(this.alarm);
    }
}
