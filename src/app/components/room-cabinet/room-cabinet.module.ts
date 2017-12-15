/**
 * Created by WH1709040 on 2017/12/15
 */
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { SharedModule } from "../../shared"
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { RoomService } from "../../core/models-service/room-service"
import {RoomCabinetComponent } from "./room-cabinet.component";
import {ROUTER_CONFIG} from "./room-cabinet.routes";
import {RoomComponent} from "./room/room.component";
import {CabinetComponent} from "./cabinet/cabinet.component";
import {AddCabinetsComponent} from "./room/add-cabinets/add-cabinets.component";
import {CreateRoomModalComponent} from "./room/create-room-modal/create-room-modal.component";
import {CabinetCanDeactivateGuard, CanDeactivateGuard} from "./room/can-deactivate-guard.service";
@NgModule({
    imports: [
        FormsModule,
        SharedModule,
        NgZorroAntdModule,
        RouterModule.forChild(ROUTER_CONFIG)
    ],
    providers: [ RoomService, CanDeactivateGuard ,
    CabinetCanDeactivateGuard, ],
    declarations: [
        RoomCabinetComponent,
        RoomComponent,
        CabinetComponent,
        AddCabinetsComponent,
        CreateRoomModalComponent
    ]
})

export class RoomCabinetModule { }
