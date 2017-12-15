/**
 * Created by GyjLoveLh on  2017/12/8
 */
import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
// import { TopologyMissionService } from "../../components/topo/topology-mission.service"

@Component({
    selector: 'lh-tree',
    templateUrl: './lh-tree.component.html',
    styleUrls: [ './lh-tree.component.scss' ]
})

export class LhTreeComponent implements OnInit {
    @Input() data;
    @Input() checked;
    constructor(
        private $router: Router,
        // private $mission: TopologyMissionService
    ) { }
    ngOnInit() { }
    expand(item) {
        if (item.expand) {
            item.expand = !item.expand;
            item.children = [];
        } else {
            item.expand = !item.expand;
            if (!item.children) {
                item.children = [];
            }
            item.expandEvent(item).then(success => {
                item.children = success;
            });
        }
    }

    navigateTo(id, type) {
        // if (type === 'subnet') {
            this.$router.navigate([`/topo/subnet`], { queryParams: {id} });
        // }
    }
}

