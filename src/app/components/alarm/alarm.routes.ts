/**
 * Created by WH1709040 on 2017/12/15
 */
import { Routes } from '@angular/router'
import {CurrentAlarmComponent} from "./current-alarm/current-alarm.component";
import {HistoryAlarmComponent } from "./history-alarm/history-alarm.component";
import {AlarmComponent} from "./alarm.component";

export const ROUTER_CONFIG: Routes = [

    {
        path: '',
        component: AlarmComponent,
        children: [
            { path : 'current', component: CurrentAlarmComponent},
            { path: 'history', component: HistoryAlarmComponent}
        ]
    }

];
