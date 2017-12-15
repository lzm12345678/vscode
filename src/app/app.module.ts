import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NoopInterceptor } from './noop-interceptor'
import { NgZorroAntdModule, NzNotificationModule } from 'ng-zorro-antd';
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router'
import { SharedModule } from "./shared"
import { CoreModule } from "./core"
import { ROUTER_CONFIG } from "./app.routes"

import { CabinetComponent } from './components/cabinet/cabinet.component';
import { RoomComponent } from './components/room/room.component';
import { AppRoutingModule } from "./app-routing.module";
import { MachineComponent } from './components/machine/machine.component';
import { CreateRoomModalComponent } from './components/machine/create-room-modal/create-room-modal.component';
import { UserManagerComponent } from "./components/user/user-manager/user-manager.component";
import { UserStatePipe } from './pipes/user-state.pipe';
import { UserRolePipe } from './pipes/user-role.pipe';
import { UserNamePipe } from "./pipes/user-name.pipe";
import { CommonSelectPipe } from "./pipes/common-select.pipe";
import { BserverModelPipe } from "./pipes/bserverModel.pipe"
import { PaginationComponent } from './components/pagination/pagination.component';
import { MenuTopComponent } from './components/menu-top/menu-top.component';
import { AlarmBadgeComponent } from './components/alarm-badge/alarm-badge.component';
import { RotatePipe } from './pipes/rotate.pipe';
import { UserOnlineComponent } from "./components/user/user-online/user-online.component";
import { UserRolesComponent } from "./components/user/user-roles/user-roles.component";
import { RoleDetailComponent } from "./components/user/role-detail/role-detail.component";
import { AssetComponent } from './components/asset/asset.component';
import { AlarmPipe } from './pipes/alarm.pipe';
import { RockComponent } from "./components/asset/servicer/rock/rock.component";
import { RockDetailComponent } from "./components/asset/servicer/rock/rock-detail/rock-detail.component";
import { LoginComponent } from './components/login/login.component'
import { PasswordPipe } from "./pipes/password.pipe";
import { BrandDetailComponent } from "./components/asset/manager/brand/brand-detail/brand-detail.component";
import { BrandComponent } from "./components/asset/manager/brand/brand.component";
import { SeriesComponent } from "./components/asset/manager/series/series.component";
import { VersionComponent } from "./components/asset/manager/version/version.component";
import { BladeComponent } from './components/asset/servicer/blade/blade.component'
import { BladeDetailComponent } from "./components/asset/servicer/blade/blade-detail/blade-detail.component";
import { BladeUnitDetailComponent } from "./components/asset/servicer/blade/blade-unit-detail/blade-unit-detail.component";
import { BladePandectComponent } from "./components/asset/servicer/blade/blade-pandect/blade-pandect.component";
import { BladeAlarmListComponent } from "./components/asset/servicer/blade/blade-pandect/blade-alarm-list/blade-alarm-list.component";
import { BladeBaseComponent } from "./components/asset/servicer/blade/blade-pandect/blade-base/blade-base.component";
import { BladeHardwareComponent } from "./components/asset/servicer/blade/blade-pandect/blade-hardware/blade-hardware.component";
import { BladeHistoryComponent } from "./components/asset/servicer/blade/blade-pandect/blade-history/blade-history.component";
import { BladeMonitorTaskComponent } from "./components/asset/servicer/blade/blade-pandect/blade-monitor-task/blade-monitor-task.component";
import { BladeOperParamComponent } from "./components/asset/servicer/blade/blade-pandect/blade-oper-param/blade-oper-param.component";
import { BladeProtocolConfigComponent } from "./components/asset/servicer/blade/blade-pandect/blade-proto-config/blade-proto-config.component";
import { BladeRealtimeMonitorComponent } from "./components/asset/servicer/blade/blade-pandect/blade-realtime-monitor/blade-realtime-monitor.component";

import { DeviceComponent } from "./components/asset/servicer/device/device.component";
import { AddCabinetsComponent } from './components/machine/add-cabinets/add-cabinets.component';

import { RepwdComponent } from "./components/user/repwd/repwd.component";
import { IndexComponent } from "./components/index/index.component";
import { AngularEchartsModule } from 'ngx-echarts';
import { ProxyService } from "./proxy.service";
import { PandectComponent } from "./components/asset/servicer/rock/pandect/pandect.component";
import { PandectBaseComponent } from "./components/asset/servicer/rock/pandect/base/pandect-base.component";
import { AlarmListComponent } from "./components/asset/servicer/rock/pandect/alarm-list/alarm-list.component";
import { CustomTableComponent } from "./components/custom-modal/custom-table/custom-table.component";
import { CustomTreeComponent } from "./components/custom-modal/custom-tree/custom-tree.component";
import { CustomFormComponent } from "./components/custom-modal/custom-form/custom-form.component";
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
import { CurrentAlarmComponent } from "./components/alarm/current-alarm/current-alarm.component";
import { HistoryAlarmComponent } from "./components/alarm/history-alarm/history-alarm.component";
import { ReactiveFormsModule } from '@angular/forms';
import { APP_BASE_HREF, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { UnitPandectComponent } from "./components/asset/servicer/blade/unit-pandect/unit-pandect.component";
import {UnitBaseComponent} from "./components/asset/servicer/blade/unit-pandect/unit-base/unit-base.component";
import {UnitAlarmListComponent} from "./components/asset/servicer/blade/unit-pandect/unit-alarm-list/unit-alarm-list.component";
import {UnitOperParamComponent} from "./components/asset/servicer/blade/unit-pandect/unit-oper-param/unit-oper-param.component";
import {UnitMonitorTaskComponent} from "./components/asset/servicer/blade/unit-pandect/unit-monitor-task/unit-monitor-task.component";
import {UnitRealtimeMonitorComponent} from "./components/asset/servicer/blade/unit-pandect/unit-realtime-monitor/unit-realtime-monitor.component";
import {UnitHistoryComponent} from "./components/asset/servicer/blade/unit-pandect/unit-history/unit-history.component";
import {UnitHardwareComponent} from "./components/asset/servicer/blade/unit-pandect/unit-hardware/unit-hardware.component";
import {UnitProtoConfigComponent} from "./components/asset/servicer/blade/unit-pandect/unit-proto-config/unit-proto-config.component";
import { UserComponent } from "./components/user/user.component";
import {AlarmComponent} from "./components/alarm/alarm.component";
import {RoleTabComponent} from "./components/user/user-roles/roles-modify.component/role-tab/role-tab.component";
import { ProtocolConfigurationComponent } from "./components/asset/servicer/rock/pandect/proto-config/protocol-configuration.component";
import { LhTableComponent } from "./components/custom-modal/lh-table/lh-table.component"
import {WebSocketService} from "./websocket.service";
import {AlarmProxyService} from "./alram-proxy.service";
import { SeriesDetailComponent } from './components/asset/manager/series/series-detail/series-detail.component';
@NgModule({
    schemas: [ NO_ERRORS_SCHEMA ],
    declarations: [
        AppComponent,
        MenuTopComponent,
        AlarmBadgeComponent,

    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        CoreModule,
        SharedModule,
        NgZorroAntdModule.forRoot({ extraFontName: 'anticon', extraFontUrl: '../assets/fonts/iconfont' }),
        NzNotificationModule,
        // 路由模块最后导入。
        RouterModule.forRoot(ROUTER_CONFIG),
        AngularEchartsModule,
        ReactiveFormsModule,
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: NoopInterceptor,
            multi: true,
        },
        {
            provide: 'apiUrl',
            useValue: '/itom'
        },
        ProxyService,
        AlarmProxyService,
        WebSocketService
    ],
    bootstrap: [ AppComponent ]
})

export class AppModule { }


