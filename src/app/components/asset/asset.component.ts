import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd} from '@angular/router'
import { MissionService } from "../../mission-store/mission.service";
import * as Stomp from 'stompjs';
@Component({
    selector: 'app-asset',
    templateUrl: './asset.component.html',
    styleUrls: ['./asset.component.scss'],
    providers: [ MissionService ]
})
export class AssetComponent implements OnInit {
    private pageFlag: string;
    isCollapsed: boolean = false;
    isCollapse: boolean = false;
    breadCrumb: Array<{label: string, url: string}> = [];
    constructor(
        private $router: Router,
        private $active: ActivatedRoute,
        private $mission: MissionService
    ) {
        $mission.alarmChangeHook.subscribe(result => {
            console.log('bread', result);
        });
    }

    ngOnInit() {
        let socket = new window['SockJS']('/itom/itomEndpointWisely'); // 链接SockJS 的
        let stompClient = Stomp.over(socket); // 使用stomp子协议的WebSocket 客户端
        stompClient.connect({}, frame => {
            stompClient.subscribe('/itomTopic/runParam', response => {
                let data = JSON.parse(response.body);
                this.$mission.commitRunParamChangeHook(data);
            })
        });
        // 路由监控动态高亮对应导航
        // this.$router.events
        //     .filter(event => event instanceof NavigationEnd)
        //     .map(() => this.$active)
        //     .map(route => {
        //         if (route.firstChild) {
        //             route = route.firstChild;
        //             return route;
        //         }
        //
        //     })
        //     .subscribe((event) => {
        //
        //         // console.log('active:', event._routerState.snapshot.url);
        //         let _arr = window.location.href.split('/');
        //         this.pageFlag = _arr[_arr.length - 1];
        //     });


        let _arr = window.location.href.split('/');
        this.pageFlag = _arr[_arr.length - 1];
        console.log(this.pageFlag);
    }

    toggleCollapse(): void {
        this.isCollapse = !this.isCollapse;
    }

}
