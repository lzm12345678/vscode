/**
 * Created by WH1709055 on  2017/11/10 17:31
 */

import { Component, OnInit } from '@angular/core'
import { OperationParameterService } from "./operation-parameter.service";
import { Router, ActivatedRoute } from '@angular/router'
import { MissionService } from "../../../../../../mission-store/mission.service";
import { RunParamService } from "../../../../../../mission-store/runParam.service"

@Component({
    selector: 'app-operation-parameter',
    templateUrl: './operation-parameter.component.html',
    styleUrls: ['./operation-parameter.component.scss'],
    providers: [ OperationParameterService, RunParamService ]
})

export class OperationParameterComponent implements OnInit {
    showloading: boolean = true;
    serverId: string;
    column = [
        { label: '主机名称', key: 'serverId' },
        { label: '操作系统', key: 'serverSys' },
        { label: '运行时长', key: 'runTime' }
    ];

    data = {
        serverId: '',
        serverSys: '',
        runTime: ''
    };
    chartOption;

    memoryParams = [];

    diskParams = [];

    ccStateInfo2 = [
        {
            name: '/root',
            capacity: 15,
            state: 0.68,
            color: 'active'
        },
        {
            name: '/data',
            capacity: 121,
            state: 0.41,
            color: 'exception'
        }
    ];

    seriesData = [];

    constructor(
        private $service: OperationParameterService,
        private $router: Router,
        private $active: ActivatedRoute,
        private $mission: MissionService,
        private $runParam: RunParamService
    ) {
        $mission.runParamChangeHook.subscribe(data => {
            let { serverId, serverSys, runTime } = data;
            this.data = { serverId, serverSys, runTime };
            this.memoryParams = data.memoryParams;
            this.diskParams = data.diskParams;
            console.log(this);
        });
    }
    ngOnInit() {
        let data = [];

        for (let i = 0; i < 20; i++) {
            data.push(['', Math.floor(Math.random() * 100)]);
        }
        this.chartOption = {
            visualMap: [{
                show: false,
                type: 'continuous',
                seriesIndex: 0,
                min: 0,
                max: 400
            }],
            title: [{
                left: 'center',
                text: ''
            }],
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [{
                data: []
            }],
            yAxis: [{
                splitLine: {show: false}
            }],
            grid: [{
                bottom: '60%'
            }],
            series: [{
                type: 'line',
                showSymbol: false,
                data: []
            }]
        };
        setTimeout(() => {
            this.showloading = false;
        }, 1000);
        setInterval(() => {
            data.splice(0, 1).push(['', Math.floor(Math.random() * 100)])
            // data.push();
            let dateList = data.map(function (item) {
                return item[0];
            });
            let valueList = data.map(function (item) {
                return item[1];
            });
            this.chartOption = {
                visualMap: [{
                    show: false,
                    type: 'continuous',
                    seriesIndex: 0,
                    min: 0,
                    max: 400
                }],
                title: [{
                    left: 'center',
                    text: ''
                }],
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: [{
                    data: dateList
                }],
                yAxis: [{
                    splitLine: {show: false}
                }],
                grid: [{
                    bottom: '60%'
                }],
                series: [{
                    type: 'line',
                    showSymbol: false,
                    data: valueList
                }]
            };
        }, 3000);

        // this.chartOption = {
        //     visualMap: [{
        //         show: false,
        //         type: 'continuous',
        //         seriesIndex: 0,
        //         min: 0,
        //         max: 400
        //     }],
        //     title: [{
        //         left: 'center',
        //         text: ''
        //     }],
        //     tooltip: {
        //         trigger: 'axis'
        //     },
        //     xAxis: [{
        //         data: $component.seriesData.map(item => item[0])
        //     }],
        //     yAxis: [{
        //         splitLine: {show: false}
        //     }],
        //     grid: [{
        //         bottom: '60%'
        //     }],
        //     series: [{
        //         type: 'line',
        //         showSymbol: false,
        //         data: $component.seriesData.map(item => item[1])
        //     }]
        // };

        this.$active.queryParams.subscribe(params => {
            /**
             * 机架服务器运行参数
             */
            this.serverId = params.id;
            this.$service.getRunParam(this.serverId, result => {
                console.log('runparams', result);
            });
        });
    }
}


