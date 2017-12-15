/**
 * Created by GyjLoveLh on  2017/12/7
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
    selector: 'lh-table-fixed',
    styleUrls: [ './lh-table.component.scss' ],
    template: `
<div class="lh-table-fixed" [style.width]="width + 'px'">   
    <lh-table-header 
        [column]="column" 
        [checkedAll]="checkedAll" 
        [indeterminate]="indeterminate" 
        [isFixed]="true"
        class="lh-table-fixed-header" >
        
    </lh-table-header>
    <lh-table-body [column]="column"
                   [isFixed]="true"
                   [data]="data"
                   (scroll)="_scroll($event)"
                   [expandInfo]="expandInfo"
                   [height]="height">

    </lh-table-body>
</div>       
    `
})

export class LhTableFixedComponent implements OnInit {
    @Input() column;
    @Input() checkedAll: boolean = false;
    @Input() indeterminate: boolean = false;
    @Input() data;
    @Output() scroll = new EventEmitter<any>();
    @Input() expandInfo;
    @Input() height;

    width: number = 0;
    ngOnInit() {
        this.column.filter(item => item.fixed).forEach(item => {
            this.width += item.width || 80;
        });
    }

    public _scroll(event) {
        this.scroll.emit(event);
    }
}
