/**
 * Created by GyjLoveLh on  2017/12/7
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'lh-table-checkbox',
    template: `
<label class="lh-checkbox-wrapper" [ngSwitch]="type" >
    <span class="lh-checkbox" 
          *ngSwitchCase="'header'"
          [class.lh-checkbox-indeterminate]="indeterminate"
          [class.lh-checkbox-checked]="checkedAll">
        <span class="lh-checkbox-inner">
        <input type="checkbox" 
               class="lh-checkbox-input" 
               [(ngModel)]="checkedAll"  
               (ngModelChange)="selectChange.emit($event)">
        </span>
    </span>
    <span class="lh-checkbox" *ngSwitchDefault
          [class.lh-checkbox-checked]="target.checked">
        <span class="lh-checkbox-inner">
            <input [(ngModel)]="target.checked" 
                   (ngModelChange)="selectChange.emit($event)" 
                   type="checkbox" 
                   class="lh-checkbox-input">
        </span>
    </span>
</label>
    `,
    styleUrls: [ './lh-table.component.scss' ]
})

export class LhTableCheckboxComponent implements OnInit {
    @Input() target = null;
    @Input() type: string = 'body';
    @Input() checkedAll: boolean = false;
    @Input() indeterminate: boolean = false;
    @Output() selectChange = new EventEmitter<any>();

    ngOnInit() { }
}

