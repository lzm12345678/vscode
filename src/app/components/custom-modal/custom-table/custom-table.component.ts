/**
 * Created by WH1709055 on  2017/11/10 17:01
 */

import { Component, OnInit, NgModule, Input, AfterContentChecked } from '@angular/core'
import { Router } from '@angular/router'


@NgModule({
    imports:      [],
    declarations: [ CustomTableComponent ],
    bootstrap:    [ CustomTableComponent ]
})

@Component({
    selector: 'app-custom-table',
    templateUrl: './custom-table.component.html',
    styleUrls: ['./custom-table.component.scss']
})

export class CustomTableComponent implements OnInit, AfterContentChecked {
    @Input() column;
    @Input() data;
    @Input() row;
    _column = [];
    constructor(
        private $router: Router
    ) { }
    ngOnInit() {
        // for (let i = 0; i < Math.ceil(this.column.length / this.row); i ++) {
        //     this._column.push(i);
        // }
    }
    ngAfterContentChecked() {
        this._column = [];
        for (let i = 0; i < Math.ceil(this.column.length / this.row); i ++) {
            this._column.push(i);
        }
    }
}

