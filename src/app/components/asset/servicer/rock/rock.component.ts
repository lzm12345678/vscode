import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { MissionService } from "../../../../mission-store/mission.service";
import { RockService } from './rock.service'
import { NzMessageService } from 'ng-zorro-antd';
import { Rock, Cabinet } from "../../../../models";
import { ServicerService } from "../../../../core/models-service/servicer-service"
import { RoomService, Room } from "../../../../core/models-service/room-service"
@Component({
    selector: 'app-maintenance',
    templateUrl: './rock.component.html',
    styleUrls: ['./rock.component.scss'],
    providers: [ MissionService, RockService ]
})

export class RockComponent implements OnInit {
    search: Rock = new Rock();
    rooms: Room[] = []; // 所有机房
    cabinets: Cabinet[] = [];
    startUs = [];   // 可用U位
    allStartUs = [];    // 所有U位
    users = [];  // 所有责任人
    versions = []; // 所有型号
    rocks = [];
    isSearchOpen: boolean = false;
    // 分页属性
    pageSize: number = 20;
    pageIndex: number = 1;
    total: number = 1;

    allChecked = false; // 是否全选
    disabledButton = true;
    checkedNumber = 0;  // 选中数量
    operating = false; // 批量删除延迟
    indeterminate = false;
    sortMap = {
        sortItem: '',
        sortWay: -1
    };
    // 可排序字段
    tableSort = {
        serverIp: null,
        serverName: null,
        serverCode: null,
        serverModel: null,
        computerRoomName: null
    };

    isShelfModalShow: boolean = false;
    shelfErrorMsg: string = '';
    // 上架属性
    shelfData = {
        serverId: null,
        standard: 1,
        computerRoomId: null,
        cabinetId: null,
        startU: null
    };
    /**
     * 搜索条件 告警级别
     * @type {[{label: string; value: number} , {label: string; value: number} ,
     * {label: string; value: number} , {label: string; value: number}]}
     */
    alarmArr = [
        { label: '严重警告', value: 1 },
        { label: '主要警告', value: 2 },
        { label: '次要警告', value: 3 },
        { label: '提示警告', value: 4 }
    ];

    tableColumn = [];
    operateButtons = [
        { title: '新&nbsp;&nbsp;增', icon: 'anticon-plus', clickEvent() { alert('新增按钮') } },
        { title: '同步服务器', batch: true, icon: 'anticon-sync', clickEvent(arr) {
            console.log(arr);
        } },
        { title: '批量删除', batch: true, icon: 'anticon-minus', clickEvent(arr) {
            console.log(arr);
        } }
    ];
    constructor(
        private $mission: MissionService,
        private $service: RockService,
        private $$service: ServicerService,
        private $roomService: RoomService,
        private $router: Router,
        private $message: NzMessageService
    ) {
        $mission.pageChangeHook.subscribe(page => {
            this.pageIndex = page.pageIndex;
            this.pageSize = page.pageSize;
            this.allChecked = false; // 是否全选
            this.disabledButton = true;
            this.checkedNumber = 0;  // 选中数量
            this.refreshRock()
        });
    }

    ngOnInit() {
        this.$roomService.getRooms().then(success => {
            this.rooms = success.data;
        });
        this.$service.getAllUser(result => {
            this.users = result.data;
        });
        this.$service.getAllVersion(result => {
            this.versions = result;
        });

        this.tableColumn = [
            { type: 'selection', selectChange() {} },
            { title: '名称', key: 'serverName', href: true, sortable: true,
                sortChange() {},
                clickEvent(row) {
                    console.log(row);
                }
            },
            { title: '管理IP', key: 'serverIp', href: true, sortable: true, sortChange() {},
                clickEvent(row) {
                    console.log(row);
                } },
            { title: '管理状态', key: 'computerRoomId' },
            { title: '告警状态', key: 'alarmLevel', type: 'icon',
                icons: [
                    { value: '1', title: '严重告警', iconClass: 'error' },
                    { value: '2', title: '重要告警', iconClass: 'primary' },
                    { value: '3', title: '次要告警', iconClass: 'success' },
                    { value: '4', title: '提示告警', iconClass: 'warning' },
                    { title: '正常', iconClass: 'normal' },
                ]
            },
            { title: '编号', key: 'serverCode', sortable: true },
            { title: '型号', key: 'serverModel', sortable: true },
            { title: '位置', key: 'computerRoomName', sortable: true },
            { title: '所属项目', key: 'serverProject' },
            { title: '责任人', key: 'serverFirstuser' },
            { title: '操作', type: 'buttons',
                buttons: [
                    {
                        label: '修改',
                        iconClass: ['anticon', 'anticon-delete'],
                        okEvent(target, event) {
                            alert('跳转');
                        }
                    },
                    {
                        label: '删除',
                        type: 'confirm',
                        iconClass: ['anticon', 'anticon-delete'],
                        popContent: '确认删除这个服务器吗？',
                        okEvent(target, event) {
                            console.log(target, event);
                        }
                    },
                    {
                        label: '上架',
                        type: 'confirm',
                        iconClass: ['anticon', 'anticon-delete'],
                        popContent: '确认上架这个服务器吗？',
                        okEvent(target, event) {
                            console.log(target, event);
                        }
                    }
                ]
            }
        ];

    }

    /**
     * 同步服务器按钮
     */
    public synchronization() {
        this.operating = true;
        let ids: string[] = [];
        this.rocks.forEach(item => {
            if (item.checked) {
                ids.push(item.serverId);
            }
        });
        this.$service.synchronization(ids, result => {
            if (result.code === 0) {
                this.$message.success('同步成功~');
            } else {
                this.$message.error('同步失败~')
            }
            this.rocks.forEach(item => {
                item.checked = false;
            });
            this.refreshStatus();
            this.operating = false;
            this.disabledButton = true;
            this.indeterminate = false;
        });
    }

    /**
     * 查询告警
     * @param value
     */
    alarmChange(value) {
        this.search.alarmStatusArr = [];
        value.forEach(item => {
            if (item.checked) {
                this.search.alarmStatusArr.push(item.value);
            }
        });
    }
    /**
     * 变更选中状态
     */
    refreshStatus() {
        const _allChecked = this.rocks.every(item => item.checked === true);
        const _allUnChecked = this.rocks.every(item => !item.checked);
        this.allChecked = _allChecked;
        this.indeterminate = (!_allChecked) && (!_allUnChecked);
        this.disabledButton = !this.rocks.some(item => item.checked);
        this.checkedNumber = this.rocks.filter(item => item.checked).length;
    };

    /**
     * 全选按钮
     * @param value
     */
    checkAll(value) {
        if (value) {
            this.rocks.forEach(user => {
                user.checked = true;
            });
        } else {
            this.rocks.forEach(user => {
                user.checked = false;
            });
        }
        this.refreshStatus();
    };

    /**
     * 批量删除
     */
    batchDelete() {
        this.operating = true;
        let ids: string[] = [];
        this.rocks.forEach(item => {
            if (item.checked) {
                ids.push(item.serverId);
            }
        });
        this.$$service.deleteServers(ids).then(success => {
            this.refreshRock();
            this.operating = false;
            this.disabledButton = true;
            this.indeterminate = false;
        });
        // this.$service.deleteServers(ids, result => {
        //     this.refreshRock();
        //     this.operating = false;
        //     this.disabledButton = true;
        //     this.indeterminate = false;
        // });
    };

    /**
     * 展开/合拢 按钮
     */
    toggleSearch() {
        this.isSearchOpen = !this.isSearchOpen;
    }

    /**
     * 路由到详情/修改/新增 页面
     * @param type
     * @param id
     */
    routerToDetail(type, id) {
        this.$router.navigate([`/asset/servicer/rock/${type}`], { queryParams: { id } });
    }

    /**
     * 排序
     * @param sortName
     * @param value
     */
    sort(sortName, value) {
        this.sortMap.sortItem = sortName;
        this.sortMap.sortWay = value === 'descend' ? 0 : value === 'ascend' ? 1 : -1;
        for (let key in this.tableSort) {
            if (key && key !== sortName) {
                this.tableSort[key] = null;
            }
        }
        if (this.pageIndex !== 1) {
            this.$mission.commitPageChange({ pageIndex: 1, pageSize: this.pageSize });
        } else {
            this.refreshRock();
        }
    }

    /**
     * 确认删除删除单条服务
     * @param {Rock} rock
     */
    public confirmDelete(rock: Rock) {
        this.rocks.forEach(item => {
            if (item.serverId === rock.serverId) {
                item.checked = false;
            }
        });
        this.refreshStatus();
        this.$service.deleteServers([rock.serverId], result => {
            this.refreshRock();
        });
    }

    /**
     * 取消删除
     */
    public cancel() {

    }

    /**
     * 模糊查询
     */
    public searchByField() {
        this.refreshRock();
    }

    /**
     * 清空查询条件
     */
    public clearField() {
        this.search = new Rock();
        this.alarmArr.forEach(item => {
            item['checked'] = false;
        });
        // this.$service.getRockByField(this.pageIndex, this.pageSize, this.search, this.sortMap, result => {
        //     this.rocks = result.data;
        //     this.total = result.totalCount;
        // });
    }

    /**
     * 路由
     * @param {Rock} rock
     */
    public routerToPandect(rock: Rock) {
        this.$router.navigate(['/asset/servicer/rock/pandect/base'], { queryParams: {id: rock.serverId} });
    }


    /**
     * 查询--获取机房下所有机柜
     * @param id
     */
    public roomChange(id) {
        this.$service.getAllCabinet(id, result => {
            this.search.cabinetId = null;
            this.search.startU = null;
            this.cabinets = result.cabinetSet || [];
            this.allStartUs = [];
        });
    }

    /**
     * 查询--机柜下所有可用U位
     * @param id
     */
    public cabinetAllChange(id) {
        this.$service.getAllStartUs(id, result => {
            let temp = [];
            this.search.startU = null;
            for (let i = 1; i <= result; i++) {
                temp.push(i);
            }
            this.allStartUs = temp;
        });
    }

    /**
     * 上架--改变机房
     * @param id
     */
    public shelfRoomChange(id) {
        this.$service.getAllCabinet(id, result => {
            this.shelfData.cabinetId = null;
            this.shelfData.startU = null;
            this.cabinets = result.cabinetSet || [];
            this.startUs = [];
        });
    }

    /**
     * 上架-- 获取机柜下所有可用U位置
     * @param id
     */
    public shelfCabinetChange(id) {
        this.$service.getUnuseStartUs(this.shelfData.serverId, this.shelfData.standard, id, result => {
            this.shelfData.startU = null;
            this.startUs = result || [];
        });
    }


    /**
     * 上下架
     * @param {Rock} rock
     */
    public shelf(rock: Rock) {
        // 下架
        if (rock.computerRoomName) {
            // this.$service.offShelves(rock.shelvesId, result => {
            //     this.$message.success(`下架成功`);
            //      this.refreshRock();
            // });
            this.$$service.offShelves(rock.shelvesId).then(success => {
                this.$message.success(`下架成功`);
                this.refreshRock();
            });
        } else {
            this.shelfData.standard = rock.standard || 1;
            this.shelfData.serverId = rock.serverId;
            this.isShelfModalShow = true;
        }
    }

    /**
     * 确认上架
     */
    public saveShelf() {
        this.validateShelf().then(() => {
            // this.$service.onShelves(this.shelfData, result => {
            //     this.$message.success(`上架成功`);
            //     this.closeShelfModal();
            //     this.refreshRock();
            // });
            this.$$service.onShelves(this.shelfData).then(succuess => {
                this.$message.success(`上架成功`);
                this.closeShelfModal();
                this.refreshRock();
            });
        }, () => {

        });

    }

    /**
     * 关闭模态框  重置上架数据
     */
    public closeShelfModal() {
        this.isShelfModalShow = false;
        this.shelfErrorMsg = '';
        this.shelfData.computerRoomId = null;
        this.shelfData.cabinetId = null;
        this.shelfData.startU = null;
        // this.rooms = [];
        // this.cabinets = [];
        // this.startUs = [];
        this.shelfData.standard = 0;
    }

    /**
     * 验证上架信息
     * @returns {Promise<any>}
     */
    private validateShelf() {
        this.shelfErrorMsg = '';
        return new Promise((resolve, reject) => {
            if (this.shelfData.computerRoomId) {
                if (this.shelfData.cabinetId) {
                    if (this.shelfData.startU) {
                        resolve();
                    } else {
                        this.shelfErrorMsg = '请选择U位!';
                        reject();
                    }
                } else {
                    this.shelfErrorMsg = '请选择机柜!';
                    reject();
                }
            } else {
                this.shelfErrorMsg = '请选择机房!';
                reject();
            }
        });
    }

    private refreshRock() {
        // this.$service.getRockByField(this.pageIndex, this.pageSize, this.search, this.sortMap, result => {
        //     this.rocks = result.data;
        //     this.total = result.totalCount;
        // });
        this.$$service
            .getServicerPagination({ pageIndex: this.pageIndex, pageSize: this.pageSize }, this.search, this.sortMap)
            .then(success => {
                this.rocks = success.data.data;
                this.total = success.data.totalCount;
        })
    }
}

