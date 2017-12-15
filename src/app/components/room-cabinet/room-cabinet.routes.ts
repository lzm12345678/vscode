import { Routes } from '@angular/router'
import { RoomCabinetComponent } from "./room-cabinet.component";
import {CabinetComponent} from "./cabinet/cabinet.component";
import {CabinetCanDeactivateGuard, CanDeactivateGuard} from "./room/can-deactivate-guard.service";
import {RoomComponent} from "./room/room.component";

export const ROUTER_CONFIG: Routes = [
    {
        path: '',
        component: RoomCabinetComponent,
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
    }
];
