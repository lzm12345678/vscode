/**
 * Created by WH1709055 on  2017/11/11 10:08
 */

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { HardwareService } from "./hardware.service";

@Component({
    selector: 'app-hardware',
    templateUrl: './hardware.component.html',
    styleUrls: ['./hardware.component.scss'],
    providers: [ HardwareService ]
})

export class HardwareComponent implements OnInit {
    serverId: string;
    productColumn = [
        { label: '产品名称', key: 'productName' },
        { label: '产品型号', key: 'productVersion' },
        { label: '产品厂商', key: 'productManufac' },
        { label: '产品版本', key: 'productType' },
        { label: '产品SN', key: 'productSN' }
    ];
    productInfo = [];

    cpuColumn = [
        { label: '厂商', key: 'cpuManufac' },
        { label: '类型', key: 'cpuType' },
        { label: '核心数', key: 'cpuCoreNum' },
        { label: '速率', key: 'cpuSpeed' },
        { label: '状态', key: 'cpuState' },
    ];
    cpuInfo = [];

    panelColumn = [
        { label: '主板厂商', key: 'mainboardManufac' },
        { label: '主板名称', key: 'mainboardName' },
        { label: '主板型号', key: 'mainboardVersion' },
        { label: '主板SN', key: 'mainboardSN' },
        { label: '生产时间', key: 'mainboardProdDate' },
    ];
    panelInfo = [];

    memoryColumn = [
        { label: '槽位号', key: 'memorySlotNum' },
        { label: '厂商', key: 'memoryManufac' },
        { label: '型号', key: 'memoryType' },
        { label: '容量', key: 'memoryMb' },
        { label: '频率', key: 'memoryHz' }
    ];
    memoryInfo = [];

    diskColumn = [
        { label: '厂商', key: 'diskManufac' },
        { label: '型号', key: 'diskVersion' },
        { label: '容量', key: 'diskMb' },
        { label: '类型', key: 'diskType' },
        { label: '最大转速', key: 'diskMaxSpeed' },
        { label: '接口类型', key: 'diskPortType' },
        { label: '固件版本', key: 'diskFirmVersion' }
    ];
    diskInfo = [];

    // 散热
    fanColumn = [
        { label: '名称', key: 'fanInfoName' },
        { label: '转速', key: 'fanInfoSpeed' },
        { label: '在位状态', key: 'fanInfoState' }
    ];
    fanInfo = [];

    // 网络适配
    niaColumn = [
        { label: '型号', key: 'niaInfoPortVersion' },
        { label: '接口类型', key: 'niaInfoPortType' },
        { label: '接口速率', key: 'niaInfoPortSpeed' }
    ];
    niaInfo = [];

    // 电源信息
    powerColumn = [
        { label: '名称', key: 'powerInfoName' },
        { label: '型号', key: 'powerInfoVersion' },
        { label: '最大功率', key: 'powerInfoMaxSpeed' },
        { label: '冗余方式', key: 'niaPortNum' }
    ];
    powerInfo = [];
    constructor(
        private $service: HardwareService,
        private $active: ActivatedRoute
    ) { }
    ngOnInit() {
        this.$active.queryParams.subscribe(params => {
            this.serverId = params.id;
            this.$service.getServerHardwareInfo(this.serverId, result => {
                console.log('hardware', result);
                this.productInfo.push(result.productInfo);
                this.cpuInfo = result.cpuInfos;
                this.panelInfo.push(result.mainboardInfo);
                this.memoryInfo = result.memoryInfos;
                this.diskInfo = result.diskInfos;
                this.fanInfo = result.fanInfos;
                this.niaInfo = result.niaInfos;
                this.powerInfo = result.powerInfos;
            });
        });
    }
}


