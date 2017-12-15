import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { User } from '../../../models'
import { UserService } from '../user.service'
import { MissionService } from '../../../mission-store/mission.service'
@Component({
    selector: 'app-user-online',
    templateUrl: './user-online.component.html',
    styleUrls: ['./user-online.component.scss'],
    providers: [ MissionService, UserService ]
})
export class UserOnlineComponent implements OnInit {
    data: User[] = [];
    search = {
        code: '',
        name: ''
    };
    pageSize: number = 20;
    pageIndex: number = 1;
    total: number = 0;
    constructor(
        private $mission: MissionService,
        private $service: UserService,
        private $router: Router
    ) {
        // 订阅页码改变事件
        $mission.pageChangeHook.subscribe(page => {
            this.pageSize = page.pageSize;
            this.pageIndex = page.pageIndex;
            this.$service.getOnlineUserPagination( this.pageSize, this.pageIndex, result => {
                if (result) {
                    this.data = result.data;
                    this.total = result.totalCount;
                    console.log(result);
                }
            });
        });
    }

    ngOnInit() { }

    /**
     * 按条件查询
     */
    searchByField() {
        console.log(this.search);
    }

    /**
     * 确认下线
     * @param {User} user
     */
    confirmOffline(user: User) {
        this.$service.offline(user.userName, result => {
            this.refreshOnline();
        })
    }
    cancel() {

    }

    /**
     * 刷新列表
     */
    private refreshOnline() {
        this.$service.getOnlineUserPagination( this.pageSize, this.pageIndex, result => {
            if (result) {
                this.data = result.data;
                this.total = result.totalCount;
            }
        });
    }
}
