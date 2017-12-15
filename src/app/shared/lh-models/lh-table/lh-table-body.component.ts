/**
 * Created by GyjLoveLh on  2017/12/7
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import jQ from 'jquery'

@Component({
    selector: 'lh-table-body',
    template: `
        <div class="lh-table-body" 
             [class.lh-table-fixed-body]="isFixed"
             (scroll)="_scroll($event)" 
             [style.max-height]="height - 40 + 'px'">
            <table cellspacing="0" cellpadding="0" border="0" style="width: 100%">
                <tbody>
                <ng-template ngFor let-item [ngForOf]="data" let-i="index">
                    <tr>
                        <td [ngSwitch]="col.type"
                            [width]="col.width"
                            *ngFor="let col of column"
                            [class.lh-table-hidden]="col.fixed | lhFixed: isFixed"
                            [class.lh-table-column-center]="col.type === 'index'">
                            <div *ngSwitchCase="'index'" class="lh-table-cell">
                                {{i + 1}}
                            </div>
                            <div *ngSwitchCase="'selection'" class="lh-table-cell">
                                <lh-table-checkbox [target]="item" 
                                                   (selectChange)="col._selectChange($event)">
                                    
                                </lh-table-checkbox>
                            </div>
                            <div class="lh-table-cell lh-table-cell-with-expand" 
                                 *ngSwitchCase="'expand'">
                                <div class="lh-table-cell-expand"
                                     (click)="item.expand = !item.expand"
                                     [class.lh-table-cell-expand-expand]="item.expand && !col.key">
                                    <i class="anticon anticon-right" *ngIf="!col.key"></i>
                                    <a  *ngIf="col.key">{{item[col.key]}}</a>
                                </div>
                            </div>
                            <div *ngSwitchCase="'icon'" class="lh-table-cell">
                                <lh-table-icon [value]="item[col.key]" [icons]="col.icons"></lh-table-icon>
                            </div>
                            <div *ngSwitchCase="'switch'" class="lh-table-cell">
                                <lh-switch [value]="item[col.key]"
                                           [openContent]="col.openContent || ''"
                                           [closeContent]="col.closeContent || ''"
                                           [trueValue]="col.trueValue || true"
                                           [falseValue]="col.falseValue || false"
                                           [onChange]="col.onChange">

                                </lh-switch>
                            </div>
                            <div class="lh-table-cell lh-table-cell-button" *ngSwitchCase="'buttons'">
                                <ng-container *ngFor="let button of col.buttons">
                                    <lh-table-button [button]="button"
                                                     (okEvent)="button.okEvent(item, $event)">
                                        
                                    </lh-table-button>
                                </ng-container>
                            </div>
                            <div class="lh-table-cell" 
                                 *ngSwitchDefault 
                                 [title]="item[col.key]">
                                <span *ngIf="!col.href">{{item[col.key]}}</span>
                                <a *ngIf="col.href" (click)="col.clickEvent(item, $event)">{{item[col.key]}}</a>
                            </div>
                        </td>
                    </tr>
                    <tr *ngIf="expandInfo && item.expand">
                        <td [attr.colspan]="column.length">
                            <lh-table-expand [column]="expandInfo.expandColumn"
                                             [data]="[]"
                                             [event]="expandInfo.expandEvent"
                                             [expand]="item.expand">

                            </lh-table-expand>
                        </td>
                    </tr>
                </ng-template>
                </tbody>
            </table>
        </div>
    `,
    styleUrls: [ './lh-table.component.scss' ]
})

export class LhTableBodyComponent implements OnInit {
    @Input() column;
    @Input() data;
    @Input() expandInfo;
    @Input() height: number = 300;
    @Output() scroll = new EventEmitter<any>();
    @Input() isFixed: boolean = false;
    constructor() { }
    ngOnInit() {
        this.scroll.emit()
    }

    /**
     * 固定高度宽度时，同步滚动锁定列位置
     * @param event
     */
    public _scroll(event) {
        if (!this.isFixed) {
            this.scroll.emit(event);
        }
    }
}
