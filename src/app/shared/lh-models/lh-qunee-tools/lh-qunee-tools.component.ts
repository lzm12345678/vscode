/**
 * Created by GyjLoveLh on  2017/12/8
 */
import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'lh-qunee-tools',
    templateUrl: './lh-qunee-tools.component.html',
    styleUrls: [ './lh-qunee-tools.component.scss' ]
})

export class LhQuneeToolsComponent implements OnInit {
    private Q = window['Q'];
    @Input() graph;
    ngOnInit() {}

    public zoomIn() {
        this.graph.zoomIn(0.9, 0.9);
    }

    public zoomAt() {
        this.graph.zoomAt(1, 1, 1);
    }

    public zoomOut() {
        this.graph.zoomOut(1.1, 1.1);
    }

    public zoomToOverview() {
        this.graph.zoomToOverview();
    }

    /**
     * 切换操作模式
     * @param param
     */
    public changeModel(param) {
        this.graph.interactionMode = this.Q.Consts['INTERACTION_MODE_' + param.toUpperCase()];
    }

}

