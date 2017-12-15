/**
 * Created by GyjLoveLh on  2017/12/13
 */
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { ROUTER_CONFIG } from "./asset.routes"
import { SharedModule } from "../../shared"
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { AssetComponent } from "./asset.component"
import { RockComponent } from "./servicer/rock/rock.component"
import { RockDetailComponent } from "./servicer/rock/rock-detail/rock-detail.component"
import { CustomFormComponent } from "../custom-modal/custom-form/custom-form.component"
import { CommonSelectPipe } from "../../pipes/common-select.pipe"
import { UserNamePipe } from "../../pipes/user-name.pipe"
import { PaginationComponent } from "../pagination/pagination.component"
import { ServicerService } from "../../core/models-service/servicer-service"
import { RoomService } from "../../core/models-service/room-service"

import { NetworkAssetComponent } from './servicer/network-asset/network-asset.component';
import { NetworkDetailComponent } from './servicer/network-asset/network-detail/network-detail.component';


@NgModule({
    imports: [
        FormsModule,
        SharedModule,
        NgZorroAntdModule,
        RouterModule.forChild(ROUTER_CONFIG)
    ],
    providers: [ ServicerService, RoomService ],
    declarations: [
        AssetComponent,
        RockComponent,
        RockDetailComponent,
        CustomFormComponent,
        PaginationComponent,
        CommonSelectPipe,
        UserNamePipe,
        NetworkAssetComponent,
        NetworkDetailComponent
    ]
})

export class AssetModule { }
