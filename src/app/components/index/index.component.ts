import { Component, OnInit } from '@angular/core';
import {IndexService} from "./index.service";
import {MissionService} from "../../mission-store/mission.service";
import {NzMessageService} from "_ng-zorro-antd@0.5.5@ng-zorro-antd";

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    providers: [IndexService]
})

export class IndexComponent implements OnInit {
    showloading: boolean = true;
    /*假数据*/
    // 圆环图1
    serverOption = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ['#fc5043', '#ffa235', '#5ecc49', '#00aaff', '#42ccef' ],
        legend: {
            orient: 'vertical',
            top: '20px',
            right: '20px',
            align: 'left',
            data: [
                {
                    name: '防火墙',
                    icon: 'circle',
                },
                {
                    name: '机架服务器',
                    icon: 'circle',
                },
                {
                    name: '刀片服务器',
                    icon: 'circle',
                },
                {
                    name: '路由器',
                    icon: 'circle',
                },
                {
                    name: '交换器',
                    icon: 'circle',
                }
            ]
        },
        series: [
            {
                name: '资源分布',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: 335, name: '防火墙'},
                    {value: 310, name: '机架服务器'},
                    {value: 234, name: '刀片服务器'},
                    {value: 135, name: '路由器'},
                    {value: 1548, name: '交换器'}
                ]
            }
        ]
    };
    // 圆环图2
    Baroptions = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        color: ['#fc5043', '#5ecc49'],
        legend: {
            orient: 'vertical',
            right: '20px',
            top: '40px',
            align: 'left',
            data: [
                {
                    name: '警报',
                    icon: 'circle',
                },
                {
                    name: '正常',
                    icon: 'circle',
                }
            ]
        },
        series: [
            {
                name: '状态',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: [
                    {value: 1, name: '警报'},
                    {value: 100, name: '正常'}
                ]
            }
        ]
    };
    // 柱状图
    chartOption = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        color: ['#7cb5ec', '#5c5c61', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80' ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                // data : ['Server1', 'Server2', 'Server3', 'Server4', 'Server5', 'Server6'],
                data: ['Server1', 'Server2', 'Server3', 'Server4', 'Server5', 'Server6'],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name: '告警数量',
                type: 'bar',
                barWidth: '50%',
                // data: [10, 52, 200, 334, 390, 330]
                data: [
                    {
                        value: 10,
                        itemStyle: {
                            normal: {
                                color: '#7cb5ec'
                            }
                        }
                    },
                    {
                        value: 52,
                        itemStyle: {
                            normal: {
                                color: '#5c5c61'
                            }
                        }
                    },
                    {
                        value: 200,
                        itemStyle: {
                            normal: {
                                color: '#90ed7d'
                            }
                        }
                    },
                    {
                        value: 334,
                        itemStyle: {
                            normal: {
                                color: '#f7a35c'
                            }
                        }
                    },
                    {
                        value: 390,
                        itemStyle: {
                            normal: {
                                color: '#8085e9'
                            }
                        }
                    },
                    {
                        value: 330,
                        itemStyle: {
                            normal: {
                                color: '#f15c80'
                            }
                        }
                    },

                ]
            }
        ]
    };

    // 告警表单数据
    alarmData;
    alarmColors = {
        '1': '#ff3600',
        '2': '#ff6600',
        '3': '#ffcc00',
        '4': '#0099ff',
    }


    // 表格
    pageSize = 20; // 告警表格分页大小
    pageIndex = 1; // 告警分页索引
    total = 0; // 表格总条数


    _allChecked = false;
    _disabledButton = true;
    _checkedNumber = 0;
    _displayData: Array<any> = [];
    _operating = false;
    _dataSet = [];
    _indeterminate = false;

    _displayDataChange($event) {
        this._displayData = $event;
    };

    _refreshStatus() {
        const allChecked = this._displayData.every(value => value.checked === true);
        const allUnChecked = this._displayData.every(value => !value.checked);
        this._allChecked = allChecked;
        this._indeterminate = (!allChecked) && (!allUnChecked);
        this._disabledButton = !this._dataSet.some(value => value.checked);
        this._checkedNumber = this._dataSet.filter(value => value.checked).length;
    };

    _checkAll(value) {
        if (value) {
            this._displayData.forEach(data => data.checked = true);
        } else {
            this._displayData.forEach(data => data.checked = false);
        }
        this._refreshStatus();
    };

    _operateData() {
        this._operating = true;
        setTimeout(_ => {
            this._dataSet.forEach(value => value.checked = false);
            this._refreshStatus();
            this._operating = false;
        }, 1000);
    };

    constructor(
        private $service: IndexService,
        private $mission: MissionService,
        private $message: NzMessageService,
    ) {

        $mission.pageChangeHook.subscribe(page => {
            this.pageIndex = page.pageIndex;
            this.pageSize = page.pageSize;

            // 刷新重要告警表格
            this.getAlarmList(result => {
                console.log('dataChangeResult', result);
                this.total = result.totalCount;
                this._dataSet = result.data;
                this._dataSet.forEach(item => {
                    item.show = false;
                });
            });
        });
        // Echart延时加载数据
        setTimeout(() => {
            this.showloading = false;
        }, 2000);
    }
    ngOnInit() {
        this.getAlarmList(result => {
            console.log('alarmResult', result);
            this.total = result.totalCount;
            this._dataSet = result.data;
            this._dataSet.forEach(item => {
                item.show = false;
            });

        });
    }
    // ngOnDestroy() {
    //     this.$mission.pageChangeHook.unsubscribe();
    // }
    /*
    * 获取告警列表
    * */
    private getAlarmList(callback) {
        let param = {
            pageSize: this.pageSize,
            pageNum: this.pageIndex
        };
        this.$service.getAlarmData(param, callback)
    }

    /*
    * 单个告警确认
    * */
    private confirmAlarm(alarm) {

        this.$service.confirmAlarm(alarm.alarmId, alarm.alarmConfirmStatus, e => {
            this.$message.create('success', '确认成功');
            this.getAlarmList(result => {
                console.log('alarmResult', result);
                this._dataSet = result.data;
                this.total = result.totalCount;
            });
        })
    }

    /*
    * 单个告警清除
    * */
    private clearAlarm(alarm) {

        this.$service.cleanAlarm(alarm.alarmId, e => {
            this.$message.create('success', '清除成功');
            this.getAlarmList(result => {
                console.log('alarmResult', result);
                this._dataSet = result.data;
                this.total = result.totalCount;
            });
        })
    }
}
