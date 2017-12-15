/**
 * Created by GyjLoveLh on  2017/12/6
 */
import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'lh-table-expand',
    template: `
<div nz-row>
    <div nz-col [nzSpan]="12" *ngFor="let col of column">
        <span class="expand-key">{{col.label}}:</span>
        <span class="expand-value">{{data[col.key]}}</span>
    </div>
</div>       
    `
})

export class LhTableExpandComponent implements OnInit {
    @Input() column = [];
    @Input() data = [];
    @Input() expand: boolean = false;
    @Input() event;
    ngOnInit() {
        if (typeof this.event === 'function') {
            this.event().then(success => {
                this.data = success;
                console.log(this.data, 'heihei');
            });
        }
    }
}

