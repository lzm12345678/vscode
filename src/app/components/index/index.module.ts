/**
 * Created by WH1709040 on 2017/12/15
 */
import {NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'
import {FormsModule} from '@angular/forms'
import {SharedModule} from "../../shared/shared.module";
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { ROUTER_CONFIG} from './index.routes'
import {IndexComponent} from "./index.component";
import { AngularEchartsModule } from 'ngx-echarts';
@NgModule({
    imports: [
        FormsModule,
        SharedModule,
        NgZorroAntdModule,
        AngularEchartsModule,
        RouterModule.forChild(ROUTER_CONFIG)
    ],
    providers: [],
    declarations: [
        IndexComponent,
    ]
})
export class IndexModule { }
