/**
 * Created by WH1709040 on 2017/12/15
 */
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { SharedModule } from "../../shared"
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { RoomService } from "../../core/models-service/room-service"
import {ROUTER_CONFIG} from "./alarm.routes";
import {AlarmComponent} from "./alarm.component";
import {CurrentAlarmComponent} from "./current-alarm/current-alarm.component";
import {HistoryAlarmComponent} from "./history-alarm/history-alarm.component";
import {PaginationComponent} from "../pagination/pagination.component";

@NgModule({
    imports: [
        FormsModule,
        SharedModule,
        NgZorroAntdModule,
        RouterModule.forChild(ROUTER_CONFIG)
    ],
    providers: [ RoomService],
    declarations: [
        AlarmComponent,
        CurrentAlarmComponent,
        HistoryAlarmComponent,
        PaginationComponent
    ]
})

export class AlarmModule { }
