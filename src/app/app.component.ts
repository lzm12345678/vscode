import { Component, OnInit } from '@angular/core';
import { MissionService } from './mission-store/mission.service'
import { User } from './models';
import { RunParamService } from "./mission-store/runParam.service"
import * as Stomp from 'stompjs';
import {Utils} from "./models/utils";
import {WebSocketService} from "./websocket.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [ MissionService, RunParamService ]
})
export class AppComponent implements OnInit {
    title = 'app';
    isCollapsed: boolean = true;
    loginUser: User;
    constructor(
        private $mission: MissionService,
        private $runParam: RunParamService,
        private $webSocket:WebSocketService
    ) {
        $mission.loginStatusChangeHook.subscribe(user => {
            this.loginUser = user;
        });
    }

    ngOnInit() {
        console.log(Stomp);
        if (sessionStorage.getItem('authorization')) {
            this.loginUser = Utils.isUserLogin();
        }
        this.$webSocket.stompClient.connect({}, frame => { // 链接Web Socket的服务端。

        });
    }

    toggleCollapsed() {
        this.isCollapsed = !this.isCollapsed;
    }

}
