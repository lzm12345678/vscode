/**
 * Created by GyjLoveLh on  2017/12/7
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'lh-table-button',
    template: `
<ng-container  [ngSwitch]="button.type">
    <nz-tooltip style="margin-right:10px;" 
                [nzTitle]="button.label" 
                *ngSwitchCase="'confirm'">
        <span nz-tooltip>
            <nz-popconfirm [nzTitle]="button.popContent"
                           (nzOnConfirm)="confirmDelete($event)"
                           (nzOnCancel)="cancel($event)">
                <a nz-popconfirm>
                    <i [ngClass]="button.iconClass"></i>
                </a>
            </nz-popconfirm>
        </span>
    </nz-tooltip>
    <a class="deal-item" 
       *ngSwitchDefault 
       (click)="button.okEvent($event)">
        <nz-tooltip [nzTitle]="'修改'">
            <span nz-tooltip >
                <i [ngClass]="button.iconClass"></i>
            </span>
        </nz-tooltip>
    </a>
</ng-container>
        
    `,
})

export class LhTableButtonComponent implements OnInit {
    @Input() button;
    @Input() type: string = '';
    @Output() okEvent = new EventEmitter<any>();
    ngOnInit( ) { }
    confirmDelete(event) {
        this.okEvent.emit(event);
    }
    cancel() {}
}

