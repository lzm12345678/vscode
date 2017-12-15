import { Component, OnInit, NgModule, Inject, Input, TemplateRef, ElementRef, Renderer2, forwardRef } from '@angular/core'
import jQ from 'jquery';
import { AppComponent } from "../../../app.component"
const guding = [ 'index', 'expand', 'selection' ];

@Component({
    selector: 'lh-table',
    templateUrl: './lh-table.component.html',
    styleUrls: [ './lh-table.component.scss' ]
})

export class LhTableComponent implements OnInit {
    @Input() column;
    @Input() data;
    @Input() height: number = 300;
    @Input() width: number;
    @Input() setting = {};
    @Input() operateButtons = [];
    @Input() size: string = 'default';

    tableId: number = Math.floor(Math.random() * 10000);
    _fixedLeft: number = 0;
    _fixedRight: number = 0;
    rightFixedColumn = [];
    checkedAll: boolean = false; // 全选
    indeterminate: boolean = false;
    expandInfo: any;
    columnWidth = [];
    constructor(
        private render: Renderer2,
        @Inject(forwardRef(() => AppComponent)) parent: AppComponent
    ) {
        console.log(jQ);
        jQ(document).mouseup(() => {
            jQ(document).unbind('mousemove');
        })
    }
    ngOnInit() {
        if (!this.width) {
            let _width = document.getElementsByClassName('lh-table-wrapper')[0].clientWidth;
            let _hasWidth = 0,
                unDragNum = 0,
                totalWidth = 0;
            this.column.forEach(item => {
                if (guding.includes(item.type)) {
                    item.width = item.width || 70;
                }
                if (item.width) {
                    _hasWidth ++;
                    totalWidth += item.width;
                }
                if (guding.includes(item.type)) {
                    unDragNum++;
                }
            });
            if (_width <= totalWidth) {
                console.log(_hasWidth, totalWidth, this.column.length);
            } else {
                console.log((this.column.length - _hasWidth) * 100 + totalWidth, _width);
                if ((this.column.length - _hasWidth) * 100 + totalWidth < _width) {
                    let _len = (_width - ((this.column.length - _hasWidth) * 50 + totalWidth)) / (this.column.length - unDragNum);
                    this.column.forEach(item => {
                        if (item.width) {
                            if (!guding.includes(item.type)) {
                                item.width += _len;
                            }
                        } else {
                            item.width = 50 + _len;
                        }
                    });
                } else {
                    this.column.forEach(item => {
                        if (!item.width) {
                            item.width = 100;
                        }
                    });
                }
            }
        }
        const $component = this;
        let _expand = this.column.filter(item => item.type === 'expand');
        this.expandInfo = _expand.length > 0 ? _expand[0] : null;
        this.column.forEach((item, index) => {
            if (item.fixed === 'left') {
                this._fixedLeft += item.width;
            }
            if (item.fixed === 'right') {
                this._fixedRight += item.width;
            }
            // 支持排序
            if (item.sortable) {
                item._sortChange = (name, type, event) => {
                    if (!jQ(event.target).hasClass('on')) {
                        let is = jQ('.lh-table-sort i');
                        console.log(is);
                        is.each((index, item) => {
                            jQ(item).removeClass('on');
                        });
                        jQ(event.target).addClass('on');
                        item.sortChange(name, type);
                    } else {
                        jQ(event.target).removeClass('on');
                        item.sortChange(name, null);
                    }

                }
            }
            // 支持多选
            if (item.type === 'selection') {
                item._selectChange = (value, param) => {
                    if (param === 'all') {
                        if (value) {
                            $component.data.forEach(item => {
                                item.checked = true;
                            });
                        } else {
                            $component.data.forEach(item => {
                                item.checked = false;
                            });
                        }
                    }
                    const _allChecked = $component.data.every(item => item.checked);
                    const _allUnchecked = $component.data.every(item => !item.checked);
                    $component.checkedAll = _allChecked;
                    $component.indeterminate = (!_allChecked) && (!_allUnchecked);

                    let _checkeds = $component.data.filter(item => {
                        return item.checked;
                    });
                    console.log(_checkeds);
                    item.selectChange(_checkeds);
                }
            }

        });

        this.operateButtons.forEach(btn => {
            btn._clickEvent = () => {
                let _checked;
                if (btn.batch) {
                    _checked = $component.data.filter(item => {
                        return item.checked;
                    });
                }
                btn.clickEvent(_checked);
            }
        });

        for (let i = this.column.length - 1; i >= 0; i--) {
            this.rightFixedColumn.push(this.column[i]);
        }
    }

    public scroll(event) {
        let body = jQ(`#${this.tableId} .lh-table-body`);
        if (body.length > 0) {
            let _scrollLeft = body[0].scrollLeft,
                _scrollTop = body[0].scrollTop;
            jQ(`#${this.tableId} .lh-table-header`)[0].scrollLeft = _scrollLeft;
            let _fixed = jQ(`#${this.tableId} .lh-table-fixed-body`);
            if (_fixed.length > 0) {
                _fixed[0].scrollTop = _scrollTop;
            }
        }
    }
}


