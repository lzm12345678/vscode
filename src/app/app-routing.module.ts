import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CabinetComponent } from "./components/cabinet/cabinet.component"
import { RoomComponent } from "./components/room/room.component"
import { MachineComponent } from "./components/machine/machine.component";
import { UserManagerComponent } from './components/user/user-manager/user-manager.component'
import { UserOnlineComponent } from './components/user/user-online/user-online.component'
import { UserRolesComponent } from './components/user/user-roles/user-roles.component'
import { UserComponent } from "./components/user/user.component";
import { RockDetailComponent } from "./components/asset/servicer/rock/rock-detail/rock-detail.component";
import { AssetComponent } from './components/asset/asset.component'
import { RockComponent } from './components/asset/servicer/rock/rock.component'
import { LoginComponent } from './components/login/login.component'

import { AuthGuardService } from './guard/auth-guard.service'
import { VersionComponent } from "./components/asset/manager/version/version.component";
import { BladeComponent } from './components/asset/servicer/blade/blade.component'
import { BladeDetailComponent } from "./components/asset/servicer/blade/blade-detail/blade-detail.component";
import { BladeUnitDetailComponent } from "./components/asset/servicer/blade/blade-unit-detail/blade-unit-detail.component";
import { DeviceComponent } from "./components/asset/servicer/device/device.component";
import { RepwdComponent } from "./components/user/repwd/repwd.component";
import { IndexComponent } from "./components/index/index.component";
import { PandectComponent } from "./components/asset/servicer/rock/pandect/pandect.component";
import { PandectBaseComponent } from "./components/asset/servicer/rock/pandect/base/pandect-base.component";
import { AlarmListComponent } from "./components/asset/servicer/rock/pandect/alarm-list/alarm-list.component";
import { OperationParameterComponent } from "./components/asset/servicer/rock/pandect/oper-param/operation-parameter.component";
import { MonitorTaskComponent } from "./components/asset/servicer/rock/pandect/monitor-task/monitor-task.component";
import { RealtimeMonitorComponent } from "./components/asset/servicer/rock/pandect/realtime-monitor/realtime-monitor.component";
import { HistoryComponent } from "./components/asset/servicer/rock/pandect/history/history.component";
import { HardwareComponent } from "./components/asset/servicer/rock/pandect/hardware/hardware.component";
import { SensorThresholdComponent } from "./components/asset/servicer/rock/pandect/setting/sensor-threshold/sensor-threshold.component";
import { SelLogComponent } from "./components/asset/servicer/rock/pandect/setting/sel-log/sel-log.component";
import { BmcListComponent } from "./components/asset/servicer/rock/pandect/setting/bmc-list/bmc-list.component";
import { ResetComponent } from "./components/asset/servicer/rock/pandect/setting/reset/reset.component";
import { PandectOtherComponent } from "./components/asset/servicer/rock/pandect/setting/other/pandect-other.component";
import { RolesModifyComponent } from "./components/user/user-roles/roles-modify.component/roles-modify.component";
import { VersionDetailComponent } from "./components/asset/manager/version/version-detail/version-detail.component";
import { UserManagerDetailComponent } from "./components/user/user-manager/detail/user-manager-detail.component";
import {CurrentAlarmComponent} from "./components/alarm/current-alarm/current-alarm.component";
import {HistoryAlarmComponent} from "./components/alarm/history-alarm/history-alarm.component";
import {CanDeactivateGuard, CabinetCanDeactivateGuard} from './components/room/can-deactivate-guard.service'

import { AssetGuardService } from "./guard/asset-guard.service";
import {BladeHardwareComponent} from "./components/asset/servicer/blade/blade-pandect/blade-hardware/blade-hardware.component";
import { BladeHistoryComponent } from "./components/asset/servicer/blade/blade-pandect/blade-history/blade-history.component";
import {BladeRealtimeMonitorComponent} from "./components/asset/servicer/blade/blade-pandect/blade-realtime-monitor/blade-realtime-monitor.component";
import {BladeMonitorTaskComponent} from "./components/asset/servicer/blade/blade-pandect/blade-monitor-task/blade-monitor-task.component";
import {BladeOperParamComponent} from "./components/asset/servicer/blade/blade-pandect/blade-oper-param/blade-oper-param.component";
import {BladeAlarmListComponent} from "./components/asset/servicer/blade/blade-pandect/blade-alarm-list/blade-alarm-list.component";
import {BladeBaseComponent} from "./components/asset/servicer/blade/blade-pandect/blade-base/blade-base.component";
import {BladePandectComponent} from "./components/asset/servicer/blade/blade-pandect/blade-pandect.component";
import {BladeProtocolConfigComponent} from "./components/asset/servicer/blade/blade-pandect/blade-proto-config/blade-proto-config.component";
import {UnitPandectComponent} from "./components/asset/servicer/blade/unit-pandect/unit-pandect.component";
import {UnitBaseComponent} from "./components/asset/servicer/blade/unit-pandect/unit-base/unit-base.component";
import {UnitAlarmListComponent} from "./components/asset/servicer/blade/unit-pandect/unit-alarm-list/unit-alarm-list.component";
import {UnitOperParamComponent} from "./components/asset/servicer/blade/unit-pandect/unit-oper-param/unit-oper-param.component";
import {UnitMonitorTaskComponent} from "./components/asset/servicer/blade/unit-pandect/unit-monitor-task/unit-monitor-task.component";
import {UnitRealtimeMonitorComponent} from "./components/asset/servicer/blade/unit-pandect/unit-realtime-monitor/unit-realtime-monitor.component";
import {UnitHistoryComponent} from "./components/asset/servicer/blade/unit-pandect/unit-history/unit-history.component";
import {UnitHardwareComponent} from "./components/asset/servicer/blade/unit-pandect/unit-hardware/unit-hardware.component";
import {UnitProtoConfigComponent} from "./components/asset/servicer/blade/unit-pandect/unit-proto-config/unit-proto-config.component";
import {AlarmComponent} from "./components/alarm/alarm.component";
import { ProtocolConfigurationComponent } from "./components/asset/servicer/rock/pandect/proto-config/protocol-configuration.component";
import {BrandComponent} from "./components/asset/manager/brand/brand.component";
import {BrandDetailComponent} from "./components/asset/manager/brand/brand-detail/brand-detail.component";
import {SeriesComponent} from "./components/asset/manager/series/series.component";
import { SeriesDetailComponent } from './components/asset/manager/series/series-detail/series-detail.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'machine',
        component: MachineComponent,
        children: [
            {
                path: 'cabinet/:id',
                component: CabinetComponent,
                canDeactivate: [CabinetCanDeactivateGuard]
            },
            {
                path: 'room/:id',
                component: RoomComponent,
                canDeactivate: [CanDeactivateGuard]
            }
        ]
    },
    {
        path: 'asset',
        component: AssetComponent,
        children: [
            {
                path: '',
                canActivateChild: [ AssetGuardService ],
                children: [
                    {
                        path: 'servicer',
                        children: [
                            { path: 'rock', component: RockComponent },
                            {
                                path: 'rock/pandect',
                                component: PandectComponent,
                                children: [
                                    { path: 'base', component: PandectBaseComponent },
                                    { path: 'alarm', component: AlarmListComponent },
                                    { path: 'operation', component: OperationParameterComponent },
                                    { path: 'mt', component: MonitorTaskComponent },
                                    { path: 'rtm', component: RealtimeMonitorComponent },
                                    { path: 'history', component: HistoryComponent },
                                    { path: 'protocol', component: ProtocolConfigurationComponent},
                                    { path: 'hardware', component: HardwareComponent },
                                    { path: 'sensor', component: SensorThresholdComponent },
                                    { path: 'sel', component: SelLogComponent },
                                    { path: 'bmc', component: BmcListComponent },
                                    { path: 'reset', component: ResetComponent },
                                    { path: 'other', component: PandectOtherComponent }
                                ]
                            },
                            { path: 'rock/:type', component: RockDetailComponent },
                            { path: 'blade', component: BladeComponent },
                            { path: 'blade/detail', component: BladeDetailComponent },
                            { path: 'blade/unit-detail', component: BladeUnitDetailComponent },
                            {
                                path: 'blade/blade-pandect',
                                component: BladePandectComponent,
                                children: [
                                    { path: 'base', component: BladeBaseComponent },
                                    { path: 'alarm', component: BladeAlarmListComponent },
                                    { path: 'operation', component: BladeOperParamComponent },
                                    { path: 'mt', component: BladeMonitorTaskComponent },
                                    { path: 'rtm', component: BladeRealtimeMonitorComponent },
                                    { path: 'history', component: BladeHistoryComponent },
                                    { path: 'hardware', component: BladeHardwareComponent },
                                    { path: 'protocol', component: BladeProtocolConfigComponent }
                                ]
                            },
                            {
                                path: 'blade/unit-pandect',
                                component: UnitPandectComponent,
                                children: [
                                    { path: 'base', component: UnitBaseComponent },
                                    { path: 'alarm', component: UnitAlarmListComponent },
                                    { path: 'operation', component: UnitOperParamComponent },
                                    { path: 'mt', component: UnitMonitorTaskComponent },
                                    { path: 'rtm', component: UnitRealtimeMonitorComponent },
                                    { path: 'history', component: UnitHistoryComponent },
                                    { path: 'hardware', component: UnitHardwareComponent },
                                    { path: 'protocol', component: UnitProtoConfigComponent }
                                ]
                            },
                            { path: 'device', component: DeviceComponent }
                        ]
                    },
                    {
                        path: 'manager',
                        children: [
                            {path: 'brand', component : BrandComponent},
                            {path: 'brand/:type', component : BrandDetailComponent},
                            {path: 'series', component : SeriesComponent},
                            {path:'series/:type',component:SeriesDetailComponent},
                            { path: 'version', component: VersionComponent },
                            { path: 'version/:type', component: VersionDetailComponent },
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: 'alarm',
        component: AlarmComponent,
        children: [
            { path : 'current', component: CurrentAlarmComponent},
            { path: 'history', component: HistoryAlarmComponent}
        ]
    },
    {
        path: 'user',
        component: UserComponent,
        children: [
            { path: 'manager', component: UserManagerComponent },
            { path: 'manager/:type', component: UserManagerDetailComponent},
            { path: 'online', component: UserOnlineComponent },
            { path: 'roles', component: UserRolesComponent },
            { path: 'roles/:type', component: RolesModifyComponent },
            { path: 'repwd', component: RepwdComponent }
        ]
    },
    {
        path: 'index',
        component: IndexComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuardService ,
        CanDeactivateGuard,
        CabinetCanDeactivateGuard,
        AssetGuardService
    ]
})

export class AppRoutingModule {}
