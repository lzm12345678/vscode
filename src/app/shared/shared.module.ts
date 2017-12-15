import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgZorroAntdModule } from 'ng-zorro-antd'
import { LhPaginationComponent } from './lh-models/lh-pagination'
import { LhDropdownDirective } from "./lh-directive"
import {
    LhTableComponent,
    LhTableIconsComponent,
    LhTableExpandComponent,
    LhTableHeaderComponent,
    LhTableBodyComponent,
    LhTableCheckboxComponent,
    LhTableButtonComponent,
    LhFixedPipe,
    LhTableFixedComponent } from "./lh-models/lh-table"
import { LhSwitchComponent } from "./lh-models/lh-switch"
import { LhTreeComponent } from "./lh-models/lh-tree"
import { LhQuneeToolsComponent } from "./lh-models/lh-qunee-tools"
import { LhFormComponent } from "./lh-models/lh-form"

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgZorroAntdModule
    ],
    declarations: [
        LhPaginationComponent,
        LhDropdownDirective,
        LhTableComponent,
        LhTableIconsComponent,
        LhTableExpandComponent,
        LhTableButtonComponent,
        LhSwitchComponent,
        LhTableHeaderComponent,
        LhTableCheckboxComponent,
        LhTableBodyComponent,
        LhTableFixedComponent,
        LhFixedPipe,
        LhTreeComponent,
        LhQuneeToolsComponent,
        LhFormComponent
    ],
    providers: [ ],
    exports: [
        CommonModule,
        LhPaginationComponent,
        LhDropdownDirective,
        LhTableComponent,
        LhTableIconsComponent,
        LhTableButtonComponent,
        LhTableExpandComponent,
        LhTableCheckboxComponent,
        LhTableBodyComponent,
        LhSwitchComponent,
        LhTableHeaderComponent,
        LhTableFixedComponent,
        LhFixedPipe,
        LhTreeComponent,
        LhQuneeToolsComponent,
        LhFormComponent
    ]
})
export class SharedModule {  }
