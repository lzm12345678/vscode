import {Component, OnInit, Input} from '@angular/core';
import {AlarmService} from "../alarm.service";
import {MissionService} from "../../../mission-store/mission.service";
import {Router} from '@angular/router'
import {NzMessageService} from "_ng-zorro-antd@0.5.5@ng-zorro-antd";

@Component({
    selector: 'app-current-alarm',
    templateUrl: './current-alarm.component.html',
    styleUrls: ['./current-alarm.component.scss'],
    providers: [AlarmService]
})
export class CurrentAlarmComponent implements OnInit {
    @Input() isHistory: boolean;
    // 拿父页面的值  控制左边菜单显示和隐藏的值  -------
    @Input() isCollapse: boolean;
    // end----------------------
    tabWidth: number = 800; // 告警表格宽度
    data = [];
    alarms: any[] = [];
    isSearchOpen: boolean = false;
    pageSize: number = 20;
    pageIndex: number = 1;
    total: number = 0;
    allChecked = false; // 是否全选
    disabledButton = true;
    checkedNumber = 0;  // 选中数量
    operating = false; // 批量删除延迟
    indeterminate = false;
    sortMap = {
        alarm_name: null,
        number: null,
        model: null,
        room: null,
        alarm_level: null,
        alarm_source: null,
        alarm_happen_count: null,
        alarm_clean_time: null,
        alarm_confirm_time: null,
        alarm_begin_time: null,
        alarm_near_time: null

    };
    sortName = null;
    sortWay: any = -1;
    isShelfModalShow: boolean = false;


    constructor(private $service: AlarmService,
                private $mission: MissionService,
                private $router: Router,
                private $message: NzMessageService) {
        $mission.pageChangeHook.subscribe(page => {
            this.pageIndex = page.pageIndex;
            this.pageSize = page.pageSize;
            this.allChecked = false; // 是否全选
            this.disabledButton = true;
            this.checkedNumber = 0;  // 选中数量
            if (!this.isHistory) {
                this.getCurrentAlarmList()
            } else {
                this.getHistroyAlarmList();
            }

        });
    }

    ngOnInit() {
        console.log('tabWidth', document.getElementById('mainBody').offsetWidth);
        // 动态设置告警table宽度
        this.tabWidth = document.getElementById('mainBody').offsetWidth - 20;
        // 浏览器resize 重置table宽度
        window.onresize = () => {
            this.tabWidth = 800;
            this.tabWidth = document.getElementById('mainBody').offsetWidth - 20;
        }
    }

    getCurrentAlarmList() {
        let body = {
            "pageSize": this.pageSize,
            "pageNum": this.pageIndex,
            "sortItem": this.sortName,
            "sortWay": this.sortWay
        };
        this.$service.getCurrentAlarm(body, result => {
            this.alarms = result.data;
            this.total = result.totalCount;
        })
    }

    getHistroyAlarmList() {
        let body = {
            "pageSize": this.pageSize,
            "pageNum": this.pageIndex,
            "sortItem": this.sortName,
            "sortWay": this.sortWay
        };
        this.$service.getHistoryAlarm(body, result => {
            this.alarms = result.data;
            this.total = result.totalCount
        })
    }

    checkAll(value) {
        if (value) {
            this.alarms.forEach(item => {
                item.checked = true;
                this.checkedNumber = this.alarms.filter(item => item.checked).length;
            })
        } else {
            this.alarms.forEach(item => {
                item.checked = false;
                this.checkedNumber = this.alarms.filter(item => item.checked).length;
            })
        }
    }

    sort(sortName, value) {
        console.log(sortName);
        console.log(value);
        for (let key in this.sortMap) {
            if (key && key !== sortName) {
                this.sortMap[key] = null;
            }
        }
        this.sortWay = value === 'descend' ? 0 : value === 'ascend' ? 1 : -1;
        this.sortName = sortName;
        if (!this.isHistory) {
            this.getCurrentAlarmList()
        } else {
            this.getHistroyAlarmList();
        }
    }

    /**
     * 选中状态的联动
     */
    refreshStatus() {
        const _allChecked = this.alarms.every(item => item.checked === true);
        this.allChecked = _allChecked;
        this.checkedNumber = this.alarms.filter(item => item.checked).length;
    }

    routerToPandect() {

    }

    confirmAlarm(alarm) {
        if (!this.isHistory) {
            this.$service.confirmAlarm(alarm.alarmId, 0, e => {
                this.$message.create('success', '确认成功');
                this.getCurrentAlarmList();
            })
        } else {
            this.$service.confirmAlarm(alarm.alarmId, 1, e => {
                this.$message.create('success', '确认成功');
                this.getHistroyAlarmList()
            })
        }

    }

    cleanAlarm(alarm) {
        this.$service.cleanAlarm(alarm.alarmId, e => {
            this.$message.create('success', '清除成功');
            // this.getCurrentAlarmList()
            if (!this.isHistory) {
                this.getCurrentAlarmList()
            } else {
                this.getHistroyAlarmList();
            }
        })
    }

    /**
     * 批量确认和批量清除
     * @param e
     */
    batchAlarmAll(e) {
        let ids: any[] = [];
        this.alarms.forEach(item => {
            if (item.checked) {
                ids.push(item.alarmId)
            }
        });
        if (e === 'clean') {
            this.$service.cleanAlarmAll(ids, e => {
                this.$message.create('success', '清除成功');
                if (!this.isHistory) {
                    this.getCurrentAlarmList();
                    this.checkedNumber = 0;
                } else {
                    this.getHistroyAlarmList();
                    this.checkedNumber = 0;
                }
            })
        } else {
            if (!this.isHistory) {
                this.$service.confirmAlarmAll(0, ids, e => {
                    console.log(e);
                    this.$message.create('success', '确认成功');
                    this.getCurrentAlarmList();
                    this.checkedNumber = 0;
                })
            } else {
                this.$service.confirmAlarmAll(1, ids, e => {
                    console.log(e);
                    this.$message.create('success', '确认成功');
                    this.getHistroyAlarmList();
                    this.checkedNumber = 0;
                })
            }

        }

    }

    modifyRock() {
    }

    shelf() {

    }
}
