import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MissionService } from "../../../../mission-store/mission.service";
import { BladeService } from './blade.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'app-blade',
    templateUrl: './blade.component.html',
    styleUrls: [ './blade.component.scss' ],
    providers: [ MissionService, BladeService ]
})

export class BladeComponent implements OnInit {
    // 搜索条件
    search = {
        pageNum: 1, // 当前页
        size: 20, // 每页记录数
        bladeServerName: '', // 刀片服务器名称
        manageIp: '', // 管理ip
        bladeServerModelId: null, // 型号id
        bladeServerStatus: null, // 服务器状态 0:上架  1:下架
        computerRoomId: null, // 选择的机房id
        cabinetId: null, // 选择的机柜id
        startU: null, // 选择的U位
        bladeServerCode: '', // 输入查询的资产编号
        bladeServerProject: '', // 输入查询的所属项目
        principalId: null // 选择的责任人id
    };

    versions = []; // 所有型号
    versionId = ''; // 所选型号id
    rooms = []; // 所有机房
    roomId = ''; // 所选机房id
    cabinets = []; // 机柜列表
    cabinet = {}; // 所选机柜
    posUList = []; // U位列表
    startU: number; // 所选起始U位
    users = []; // 所有用户列表


    sortItem: ''; // 排序条件 （可能的值："manage_ip","blade_server_name","model_name","blade_server_code","room_name"）
    sortWay = 1; // 排序方式 0:降序 1:升序
    // 可排序字段
    tableSort = {
        serverIp: null,
        serverName: null,
        serverCode: null,
        serverModel: null,
        computerRoomName: null
    };

    shelfData = { // 上架数据
        serverId: null,
        standard: 1,
        computerRoomId: null,
        cabinetId: null,
        startU: null
    };
    shelfCabinets = []; // 上架机柜列表
    shelfUList = []; // 上架U位列表
    isShelfModalShow = false; // 上下架弹窗展示标识

    isSearchOpen: boolean = false; // 展示/收起 高级条件搜索标识

    blades = []; // 刀片服务器列表
    pageSize: number = 20; // 分页条数
    pageIndex: number = 1; // 当前页码
    total: number = 40; // 总页数

    _allChecked = false; // 是否全选
    _disabledButton = true; // 失效标识
    _checkedNumber = 0; // 选中数量
    operating = false; // 批量删除延迟

    _displayData: Array<any> = [];
    _operating = false;

    _indeterminate = false;

    _displayDataChange($event) {
        this._displayData = $event;
    };

    _refreshStatus() {
        const allChecked = this.blades.every(value => value.checked === true);
        const allUnChecked = this.blades.every(value => !value.checked);
        this._allChecked = allChecked;
        this._indeterminate = (!allChecked) && (!allUnChecked);
        this._disabledButton = !this.blades.some(value => value.checked);
        this._checkedNumber = this.blades.filter(value => value.checked).length;
    };

    _checkAll(value) {
        if (value) {
            this.blades.forEach(data => data.checked = true);
        } else {
            this.blades.forEach(data => data.checked = false);
        }
        this._refreshStatus();
    };

    constructor(
        private $mission: MissionService,
        private $service: BladeService,
        private $message: NzMessageService,
        private $router: Router
    ) {
        $mission.pageChangeHook.subscribe(page => {
            this.pageIndex = page.pageIndex;
            this.pageSize = page.pageSize;
            this._allChecked = false; // 是否全选
            this._disabledButton = true;
            this._checkedNumber = 0;  // 选中数量
            this.refreshBlade();
        });
    }
    ngOnInit() {

        // 获取所有资产型号
        this.$service.getAllVersion(data => {
            console.log('所有资产型号');
            console.log(data);
            this.versions = data;
        });

        // 获取所有机房
        this.$service.getRooms(data => {
            console.log('所有机房');
            console.log(data);
            this.rooms = data;
        });

        // 获取所有用户
        this.$service.getAllUser(data => {

            console.log('用户列表');
            this.users = data;
            console.log(this.users);
        });

        // 获取刀片服务器列表
        let bladeListParams = {
            'pageSize': this.pageSize,
            'pageNum': this.pageIndex,
            'queryTerm': {}
        };
        this.$service.getBladeListServer(bladeListParams, (data) => {
            console.log('服务器列表');
            console.log(data);
            this.pageIndex = data.pageNum;
            this.pageSize = data.size;
            this.total = data.totalCount;
            this.blades = data.data;
            this.blades.forEach( item => {
                item.isShowUnits = false;
                item.checked = false;
            });

        });
    }
    /**
     * 高级搜索条件 展开/收起
     */
    toggleSearch() {
        this.isSearchOpen = !this.isSearchOpen;
    }

    /**
     * 选择资产类型
     * @param id 机房id
     */
    versionChange($event) {
        this.search.bladeServerModelId = $event;
    }

    /**
     * 改变机房查机柜列表
     * @param roomId 机房id
     */
    roomChange(type, $event) {
        this.roomId = $event;
        console.log($event);
        if (this.roomId != null) {
            this.$service.getCabinets(this.roomId, data => {
                console.log('cabinets');
                if (type === 'search') {
                    this.cabinets = data.cabinetSet;
                }else if ( type === 'shelf') {
                    this.shelfCabinets = data.cabinetSet;
                }
                console.log(this.cabinets);
            });
        }else {
            if (type === 'search') {
                this.cabinets = [];
                this.posUList = [];
                this.search.cabinetId = null;
                this.search.startU = null;
            }else if ( type === 'shelf') {
                this.shelfCabinets = [];
                this.shelfUList = [];
                this.shelfData.cabinetId = null;
                this.shelfData.startU = null;
            }
        }

    }

    /**
     * 改变机柜
     */
    cabinetChange(type, $event) {
        if ($event != null) {
            let cabinetId = $event;
            if (type === 'search') {

                this.$service.getAllU(cabinetId, data => {
                    console.log('getAllU');
                    console.log(data);
                    let maxU = data;
                    for (let i = 1; i <= maxU; i++) {
                        this.posUList.push(i);
                    }

                });
            }else if (type === 'shelf') {
                let params = {
                    'serverId': this.shelfData.serverId,
                    'cabinetId': cabinetId,
                    'standard': this.shelfData.standard
                };
                this.$service.getPosUList(params, data => {
                    console.log('U位接口返回');
                    console.log(data);
                    this.shelfUList = data;
                });
            }
        }else {
            if (type === 'search') {
                this.posUList = [];
                this.search.startU = null;
            }else if (type === 'shelf') {
                this.shelfUList = [];
                this.shelfData.startU = null;
            }
        }
    }

    /**
     * 获取机柜起始U位
     */
    getStartU($event) {
        console.log($event);
        this.search.startU = $event;
    }

    /**
     * 选择责任人
     */
    getPrincipals($event) {
        if ($event != null) {
            this.search.principalId = $event.userId;
        }else {
            this.search.principalId = null;
        }

    }

    /**
     * 清空搜索条件
     */
    clearFilter() {
        this.search = {
            pageNum: 1, // 当前页
            size: 20, // 每页记录数
            bladeServerName: '', // 刀片服务器名称
            manageIp: '', // 管理ip
            bladeServerModelId: null, // 型号id
            bladeServerStatus: null, // 服务器状态 0:在线  1:离线
            computerRoomId: null, // 选择的机房id
            cabinetId: null, // 选择的机柜id
            startU: null, // 选择的U位
            bladeServerCode: '', // 输入查询的资产编号
            bladeServerProject: '', // 输入查询的所属项目
            principalId: null // 选择的责任人id
        };

    }

    /**
     * 条件搜索
     */
    searchServices(search) {
        let params = {
            'pageSize': this.pageSize,
            'pageNum': 1,
            'queryTerm': search
        }
        this.$service.filterBladeSever(params, data => {
           console.log('条件搜索');
           console.log(data);
            this.blades = data.data;
        });
    }

    /**
     * 跳转刀片服务器详情页
     */
    toDetail(bladeServerId, isEdit: boolean) {
        this.$router.navigate(['/asset/servicer/blade/detail'], {
            queryParams: {
                bladeServerId: bladeServerId,
                isEdit: isEdit
            }
        });
    }

    /**
     * 跳转刀片服务器概览页
     * @param bladeId 刀片服务器id
     */
    public toPandect(bladeServerId) {
        this.$router.navigate(['/asset/servicer/blade/blade-pandect/base'], { queryParams: {id: bladeServerId} });
    }

    /**
     * 展示/收起 刀片服务器单元列表
     */
    toogleUnits(i) {
        this.blades[i].isShowUnits = !this.blades[i].isShowUnits;
    }

    /**
     * 更新刀片服务器列表
     */
    private refreshBlade() {
        let bladeListParams = {
            'pageSize': this.pageSize,
            'pageNum': this.pageIndex,
            'queryTerm': {},
            'sortItem': this.sortItem,
            'sortWay': this.sortWay
        };
        this.$service.getBladeListServer(bladeListParams, result => {
            console.log(result.data);
            this.blades = result.data;
            this.total = result.totalCount;
        });
    }

    /**
     * 确认删除单条刀片服务器
     * @param {string} id
     */
    public confirmDelete(serverId) {
        this.$service.deleteBladeSever(serverId, result => {
            this.refreshBlade();
        });
    }

    /**
     * 批量删除
     */
    batchDelete() {
        this.operating = true;
        let ids: string[] = [];
        this.blades.forEach(item => {
            if (item.checked) {
                ids.push(item.bladeServerId);
            }
        });
        console.log('ids');
        console.log(ids);
        this.$service.deleteBladeSevers(ids, result => {
            this.refreshBlade();
            this.operating = false;
        });
    };

    /**
     * 上下架
     * @param {Rock} rock
     */
    public shelf(blade) {

        if (blade.computerRoomName) {
            // 下架
            console.log(blade);
            console.log('shelvesId', blade.shelvesId);
            this.$service.offShelves(blade.shelvesId, result => {
                console.log('shelfResult', result);
                this.$message.success(`下架成功`);
                this.refreshBlade();
            });
        } else {
            // 上架
            console.log(blade);
            this.shelfData.standard = blade.standard || 1;
            this.shelfData.serverId = blade.bladeServerId;
            this.shelfData.computerRoomId = null;
            this.shelfData.cabinetId = null;
            this.shelfData.startU = null;
            this.isShelfModalShow = true;
        }
    }

    /**
     * 确认上架
     */
    public saveShelf() {
        console.log('shelfData');
        console.log(this.shelfData);
        if (
            this.shelfData.serverId === null ||
            this.shelfData.cabinetId === null ||
            this.shelfData.startU === null
        ) {
            this.$message.warning('上架信息未填满');
            return;
        }
        this.$service.onShelves(this.shelfData, result => {
            this.$message.success(`上架成功`);
            this.isShelfModalShow = false;
            this.refreshBlade();
        });
    }

    /**
     * 排序
     * @param sortName
     * @param value
     */
    sort(sortName, value) {
        this.sortItem = sortName;
        this.sortWay = value === 'descend' ? 0 : 1;
        this.refreshBlade();
    }

}
