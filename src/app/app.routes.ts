/**
 * Created by GyjLoveLh on  2017/12/13
 */
import {Routes} from '@angular/router'

export const ROUTER_CONFIG: Routes = [
    {path: '', pathMatch: 'full', redirectTo: '/login'},
    {path: 'asset', loadChildren: 'app/components/asset#AssetModule'},
    {path: 'login', loadChildren: 'app/components/login#LoginModule'},
    {path: 'machine', loadChildren: 'app/components/room-cabinet#RoomCabinetModule'},
    {path: 'alarm', loadChildren: 'app/components/alarm#AlarmModule'},
    {path: 'index', loadChildren: 'app/components/index#IndexModule'}

];
