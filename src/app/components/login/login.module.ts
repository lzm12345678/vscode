/**
 * Created by GyjLoveLh on  2017/12/13
 */
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LoginComponent } from "./login.component"
import { ROUTER_CONFIG } from "./login.routes"
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { SharedModule } from "../../shared/shared.module"
@NgModule({
    imports: [
        FormsModule,
        SharedModule,
        NgZorroAntdModule,
        RouterModule.forChild(ROUTER_CONFIG)
    ],
    providers: [],
    declarations: [ LoginComponent ]
})

export class LoginModule {  }
