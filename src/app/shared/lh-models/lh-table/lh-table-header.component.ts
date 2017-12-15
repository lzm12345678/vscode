/**
 * Created by GyjLoveLh on  2017/12/7
 */
import { Component, Input } from '@angular/core'
import jQ from 'jquery'

@Component({
    selector: 'lh-table-header',
    template: `
<div class="lh-table-header" 
     [class.lh-table-fixed-header]="isFixed">
    <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
    <thead>
        <tr>
            <th [width]="col.width || 70"
                *ngFor="let col of column;let i = index"
                [ngSwitch]="col.type" 
                [class.lh-table-hidden]="col.fixed | lhFixed: isFixed">
                <div *ngSwitchCase="'index'" class="lh-table-cell">
                    #
                    <div *ngIf="i < column.length - 1 && !isFixed"
                         (mousedown)="mousedown($event, col)"
                         class="lh-drag-line"></div>
                </div>
                <div *ngSwitchCase="'selection'" class="lh-table-cell">
                    <lh-table-checkbox [target]="null"
                                       [type]="'header'"
                                       [checkedAll]="checkedAll"
                                       [indeterminate]="indeterminate"
                                       (selectChange)="col._selectChange($event, 'all')">
    
                    </lh-table-checkbox>
                    <div *ngIf="i < column.length - 1 && !isFixed" (mousedown)="mousedown($event, col)" class="lh-drag-line"></div>
                </div>
                <div *ngSwitchCase="'expand'" class="lh-table-cell lh-table-cell-with-expand">
                    <span>{{col.title || '&'}}</span>
                    <div *ngIf="i < column.length - 1 && !isFixed" (mousedown)="mousedown($event, col)" class="lh-drag-line"></div>
                </div>
                <div class="lh-table-cell" *ngSwitchDefault>
                    <span>{{col.title}}</span>
                    <span *ngIf="col.sortable" class="lh-table-sort">
                        <i class="anticon anticon-caret-up" (click)="col._sortChange(col.key, 'asc', $event)"></i>
                        <i class="anticon anticon-caret-down" (click)="col._sortChange(col.key, 'desc', $event)"></i>
                    </span>
                    <div class="lh-drag-line" 
                         *ngIf="i < column.length - 1 && !isFixed" 
                         (mousedown)="mousedown($event, col)"></div>
                </div>
            </th>
        </tr>
    </thead>
</table>
</div>
    `,
    styleUrls: [ './lh-table.component.scss' ]
})

export class LhTableHeaderComponent {
    @Input() column;

    @Input() checkedAll: boolean = false;
    @Input() indeterminate: boolean = false;
    @Input() isFixed: boolean = false;
    constructor() { }

    mousedown(event, target) {
        let beginX = event.clientX,
            wrapperWidth = document.getElementsByClassName('lh-table-wrapper')[0].clientWidth,
            beginWidth = target.width;
        jQ(document).mousemove(event => {
            let width = beginWidth + event.clientX - beginX;
            let totalWidth = 0;
            this.column.forEach(item => {
                totalWidth += item.width;
            });
            if (width > 70) {
                if (totalWidth < wrapperWidth) {
                    this.column[this.column.length - 1].width += wrapperWidth - totalWidth + 3;
                }
                target.width = width;
            }
        });
    };
}

