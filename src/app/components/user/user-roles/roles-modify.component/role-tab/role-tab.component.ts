/**
 * Created by WH1709055 on  2017/11/13 20:51
 */
import { Injectable } from '@angular/core';
import { Component, OnInit, NgModule, Input, Output, AfterViewChecked} from '@angular/core'
import {MissionService} from "../../../../../mission-store/mission.service";
import {RoleTabService} from "./role-tab.service";



@NgModule({
    imports:      [],
    declarations: [ RoleTabComponent ],
    bootstrap:    [ RoleTabComponent ]
})

@Component({
    selector: 'app-role-tab',
    templateUrl: './role-tab.component.html',
    styleUrls: ['./role-tab.component.scss'],
    providers: [RoleTabService]
})
@Injectable()
export class RoleTabComponent implements OnInit, AfterViewChecked {
    @Input() roleId;
    @Input() thData;
    @Input() tdData;
    @Input() dataUrl;
    pageIndex: number = 1;
    pageSize: number = 20;
    total: number = 0;
    private data = [];
    constructor(
        private $service: RoleTabService,
        private $mission: MissionService,
    ) {
        $mission.pageChangeHook.subscribe(page => {
            this.pageIndex = page.pageIndex;
            this.pageSize = page.pageSize;

            // 刷新角色详情页
            this.refrehTab(result => {
                console.log('tabResult', result);
                this.data = result.data;
            });
        });
    }
    ngAfterViewChecked() {

    }
    ngOnInit() {
        console.log('roleId tab', this.roleId);
        this.refrehTab(result => {
            console.log('tabResult', result);
            this.data = result.data;
            this.pageIndex = result.pageNum;
            this.pageSize = result.size;
            this.total = result.totalCount;
        });
    }

    private refrehTab(callback) {
        let uri = this.dataUrl;
        let params = {
            pageSize: this.pageSize,
            pageNum: this.pageIndex,
            queryTerm: {
                roleId: this.roleId
            }
        };
        console.log('getTabParams', params);
        this.$service.getTabData(uri, params, callback);
    };
}


