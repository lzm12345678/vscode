import { Component, OnInit, Input, NgModule } from '@angular/core';
import { MissionService } from '../../mission-store/mission.service';

@NgModule({
    imports:      [],
    declarations: [ PaginationComponent ],
    bootstrap:    [ PaginationComponent ]
})

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
    @Input() pageIndex: number;
    @Input() pageSize: number;
    @Input() total: number;
    constructor(
        private $mission: MissionService
    ) {  }

    ngOnInit() {

    }

    /**
     * 当前页码发生改变时回调
     * @param index
     */
    pageIndexChange(index) {
        this.$mission.commitPageChange({ pageIndex: index, pageSize: this.pageSize });
    }

    /**
     * 分页尺寸发生改变时回调
     * @param size
     */
    pageSizeChange(size) {
        this.$mission.commitPageChange({ pageIndex: this.pageIndex, pageSize: size });
    }
}
