import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core'

@Component({
    selector: 'lh-pagination',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    templateUrl: './lh-pagination.component.html',
    styleUrls: [ './lh-pagination.component.scss' ]
})

export class LhPaginationComponent implements OnInit {
    private _pageIndex: number = 1;
    private _pageSize: number = 20;
    private _total: number = 0;
    private _totalCount: number = 0;
    @Input()
    set pageIndex(val: number) {
        this._pageIndex = val;
    };
    get pageIndex(): number {
        return this._pageIndex;
    }
    @Input()
    set pageSize(val: number) {
        this._pageSize = val;
    }
    get pageSize(): number {
        return this._pageSize;
    }
    @Input()
    set total(val: number) {
        this._total = val;
    }
    get total(): number {
        return this._total;
    }
    @Input()
    set totalCount(val: number) {
        this._totalCount = val;
    }
    get totalCount() {
        return this._totalCount;
    }
    @Output() pageChange = new EventEmitter();

    isLeftDotShow: boolean = false;
    isRightDotShow: boolean = false;

    options = [
        { value: 10, disabled: false },
        { value: 20, disabled: false },
        { value: 30, disabled: false },
        { value: 40, disabled: false },
        { value: 50, disabled: false },
    ];
    constructor() {  }
    ngOnInit() {
        this.total = Math.ceil(this.totalCount / this.pageSize);
    }

    /**
     * 改变页数
     * @param index
     */
    public pageIndexChange(index) {
        if (this.pageIndex !== index) {
            this.pageIndex = index;
            this.pageChange.emit({
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            });
        }
    }

    /**
     * 跳转至 N 页
     * @param event
     */
    public handleEnter(event) {
        const regex = /^[0-9]+$/g;
        let _val = event.target.value;
        if (regex.test(_val)) {
            _val = parseInt(_val);
            if (this.pageIndex !== _val) {
                if (_val > this.total) {
                    this.pageIndex = this.total;
                    this.pageChange.emit({
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize
                    });
                } else {
                    this.pageIndex = _val;
                    this.pageChange.emit({
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize
                    });
                }
            }
        } else {
            this.pageIndex = 1;
            this.pageChange.emit({
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            });
        }

    }

    /**
     * 改变页码
     * @param size
     */
    public pageSizeChange(size) {
        if (this.pageSize !== size) {
            this.pageIndex = 1;
            this.pageSize = size;
            this.pageChange.emit({
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            })
        }
    }

    /**
     * 上一页
     */
    private prev() {
        this.pageIndex > 1 ? this.pageIndexChange(this.pageIndex - 1) : '';
    }

    /**
     * 下一页
     */
    private next() {
        this.pageIndex < this.total ? this.pageIndexChange(this.pageIndex + 1) : '';
    }

}
