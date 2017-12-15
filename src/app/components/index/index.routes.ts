/**
 * Created by WH1709040 on 2017/12/15
 */
import { Routes } from '@angular/router'
import {IndexComponent} from "./index.component";
export  const ROUTER_CONFIG: Routes = [
    {
        path: '',
        component: IndexComponent,
        children: [

        ]
    }
]
