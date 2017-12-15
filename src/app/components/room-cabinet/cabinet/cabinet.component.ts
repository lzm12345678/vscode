import {Component, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {
    Router,
    ActivatedRoute,
    Params,
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    ParamMap
} from '@angular/router';
import 'rxjs/add/operator/switchMap';
// import { HttpClient } from '@angular/common/http';
import {fadeLeftIn} from "../../../animations/fade-left-in"
import {Servicer, ServerType, Facility} from "../../../models/index";
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {CabinetService} from "./cabinet.service";
import {AmendUtil} from "./amend-util";
import {LegendUtil} from "./legend-util";
import * as TYPES from './types';
import {MissionService} from "../../../mission-store/mission.service";


const LH: number = 17;
const LN: number = 42;
const IMAGE = {
    A: './assets/image/cabinet-a-1.png',
    B: './assets/image/griff-200-10.png',
    C: './assets/image/cabinet-c-3.png',
    D: './assets/image/server-22-4.png',
    E: './assets/image/griff-200-4.png',
    F: './assets/image/cabinet-a-2.jpg',
    G: './assets/image/cabinet-a-4.jpg'
};


@Component({
    selector: 'app-cabinet',
    templateUrl: './cabinet.component.html',
    styleUrls: ['./cabinet.component.scss'],
    animations: [fadeLeftIn],
    providers: [CabinetService]
})

export class CabinetComponent implements OnInit, OnChanges {
    private legendUtil: LegendUtil;
    Q = window['Q'];
    /**
     * 记录侧边栏展开/关闭信息，结合特效
     * @type {string}
     */
    legendState: string = 'inactive';
    facilityState: string = 'inactive';
    data: Servicer[] = [];
    menuData = [];
    menuInfo = {};
    graph = null;
    /**
     * 机柜模型图
     * @type {string}
     */
    image: string = null;
    width: number = 240;
    height: number = LH;
    currentId: number; // 图元的id
    ChildId: number;//图元的告警id
    cabinetId: any;  //机柜id
    serverData: any; //机柜上存的服务器(已经上架)
    alarmCount: any = 0;
    outServerList: any; //未上架服务器列表
    serverId: any; // 服务器id
    standard: any; //规格
    shelvesId: any; // 上架id
    searchValue: any;
    isModelChange: boolean = false;

    constructor(private router: Router,
                private routeInfo: ActivatedRoute,
                private $message: NzMessageService,
                private $modal: NzModalService,
                private $service: CabinetService,
                private $mission: MissionService) {
        $mission.serverAlarmChangeHook.subscribe(obj => {
            console.log('收到了树上的设备告警更新');
            this.graph.graphModel['forEach'](item => {
                if (item.get('serverId') === obj[0]) {
                    let color = obj[1] === 1 ? '#ff0000' : obj[1] === 2 ? '#ff9900' : obj[1] === 3 ? '#ffff00' : obj[1] === 4 ? '#00ccff' : '#2bd544';
                    item.host.setStyle(this.Q.Styles.BACKGROUND_COLOR, color);
                }
            })
        });
        let that = this;


    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('onChanges');
    }

    ngOnInit() {
        this.$mission.updateViewportChangeHook.subscribe(obj => {
            if (obj && this.graph) {
                let that = this;
                //0.5秒之后重绘画布
                setTimeout(e=>{
                    that.graph.updateViewport()
                },500);
            }
        })
        /**
         * mock数据
         */
        setTimeout(() => {
            this.data.push(this.mock());
            this.data.push(this.mock());
            this.data.push(this.mock());
        }, 3000);

        this.graph = new this.Q.Graph('canvas');
        this.legendUtil = new LegendUtil(this.Q, this.graph, this.$message);
        AmendUtil.init(this.Q, this.graph, this.$message);
        /**
         * 配置Qunee
         */
        this.graph.enableTooltip = true;
        this.graph.tooltipDelay = 0;
        this.graph.tooltipDuration = 10000;
        /*缩小画布*/
        this.graph.zoomOut(0.5, 0.5);
        this.Q.registerImage('warn', '../../../assets/svg/warning.svg');

        /**
         * 过滤选中
         * @param e
         * @returns {boolean}
         */
        this.graph.isSelectable = ev => {
            if (ev.get('selected') && ev.get('selected') === 'unselected') {
                return false;
            }
            return true;
        };
        this.graph.isMovable = ev => {
            return !ev.get('isBind');
        };
        // 记录图例初始位置，用于操作无效时回滚。
        let _x: number = 0,
            _y: number = 0;
        /**
         * 拖拽事件开始时触发
         * @param ev
         */
        this.graph.startdrag = ev => {
            let _item = ev.getData();
            if (_item && _item.get('type')) {
                _x = _item.x;
                _y = _item.y;
            }
        };
        /**
         * 拖拽图元
         * @param evt
         */
        this.graph.enddrag = evt => {
            if (evt.getData() && evt.getData().get('isBind')) {
                return;
            }
            if (evt.getData() && !evt.getData().get('selected')) {
                let type = evt.getData().get('type');
                let currentY = AmendUtil.amendCoordinate(evt.getData().y, evt.getData().size.height, LH, LN);
                let offsetY = evt.getData().y - currentY;
                if (type !== TYPES.SERVER) {
                    evt.getData().x = 0;
                    evt.getData().y = currentY;
                    if (AmendUtil.verifyOverlay(evt.getData())) {
                        offsetY += evt.getData().y - _y;
                        evt.getData().y = _y;
                        this.$message.create('error', '拖拽后位置会与其他图元发生重叠，请重新操作~');
                    }
                }
                if (evt.getData().host) AmendUtil.amendWarning(evt.getData(), evt.getData().host);
                if (type === TYPES.GRIFF) {
                    AmendUtil.amendChildren(evt.getData(), offsetY);
                } else if (type === TYPES.SERVER) {
                    AmendUtil.dragServer(evt, {x: _x, y: _y});
                }
                this.isModelChange = true;
            }
        };
        /**
         * 点击图元
         * @param evt
         */
        this.graph.onclick = evt => {
            this.facilityState = 'inactive';
            this.legendState = 'inactive';
            if (evt.getData() && !evt.getData().get('selected')) {
                this.facilityState = 'active';
                // let {x, y, image} = evt.getData();
                // let facility = {x, y, image};
                // facility['width'] = evt.getData().size.width;
                // facility['height'] = evt.getData().size.height;
                // facility['type'] = evt.getData().get('type');
                // facility['index'] = evt.getData().get('index') || '--';
                // facility['isBind'] = evt.getData().get('isBind') || '--';
                //
                // this.menuData = [];
                // for (let key of Object.keys(facility)) {
                //     this.menuData.push({
                //         key: key,
                //         name: facility[key]
                //     });
                // }
                // 记录下点击图元的id
                this.currentId = evt.getData()['id'];
                if (evt.getData().host) {
                    this.ChildId = evt.getData().host.id;
                }
                this.serverId = evt.getData().get('serverId');
                let _that = this;
                this.serverData.rackServers.forEach(item => {
                    if (item.serverId === _that.serverId) {
                        _that.menuInfo = item;
                    }

                });
                evt.getData().setStyle(this.Q.Styles.BORDER, 2);
                evt.getData().setStyle(this.Q.Styles.BORDER_COLOR, "#2898E0");
                this.graph.graphModel.forEach(e => {
                    if (e.get('type') === 'CABINET' || e.get('type') === TYPES.GRIFF) {
                        e.setStyle(this.Q.Styles.BORDER, 0);
                    }

                });
                // 点击设备向树上发送roomId,cabinetId,serverId;
                this.$mission.commitServerId([this.serverData.roomId, this.cabinetId, this.serverId]);
                // 记录上架id
                this.shelvesId = evt.getData().get('shelvesId') || null;
            } else {
                let facility = new Facility();
                this.menuData = [];
                for (let key of Object.keys(facility)) {
                    this.menuData.push({
                        key: key,
                        name: facility[key]
                    });
                }
            }
        };
        // this.graph.originAtCenter = false;
        // 监测路由信息的 绘制在架服务器
        this.routeInfo.params.subscribe((params) => {
            this.cabinetId = params['id'];
            if (this.graph) {
                this.graph.clear();
            }
            this.updateCabinetInfo();
            this.legendUtil.drawCabinetBg(LH, LN);
            /*假数据的绘制*/
            // this.legendUtil.drawCabinet(this.$service.getAllNode());
            /*绘制后台数据*/
        });
        this.$service.getServerOutList(e => {
            console.log('未上架服务器列表');
            console.log(e);
            if (e.code === 0) {
                this.outServerList = e['data'];
            } else {
                this.$message.create('error', '网络错误请稍后重试')
            }

        });

    }

    /**
     * 刷新机柜上的服务器
     *
     */
    updateCabinetInfo() {
        this.alarmCount = 0;
        this.$service.getServerDatas(this.cabinetId, e => {
            console.log(e);
            this.serverData = e.data;
            /*刷新机房后面刷新树上的定位*/
            // this.$mission.commitRoomChange([true, false,this.serverData.cabinetId]);
            console.log(this.serverData.rackServers);
            let testData = [];
            this.serverData.rackServers.forEach(item => {
                let obj = {};
                obj['x'] = 0;
                obj['y'] = AmendUtil.uToCoordinate(item.startU, parseInt(item.standard));
                if (item.standard === 1) {
                    obj['image'] = IMAGE.A;
                } else if (item.standard === 2) {
                    obj['image'] = IMAGE.F;
                } else if (item.standard === 3) {
                    obj['image'] = IMAGE.C;
                } else if (item.standard === 4) {
                    obj['image'] = IMAGE.G
                } else {
                    obj['image'] = './assets/image/cabinet.svg'
                }
                obj['serverId'] = item.serverId;
                obj['shelvesId'] = item.shelvesId;
                obj['standard'] = item.standard;
                obj['type'] = TYPES.CABINET;
                obj['alarmLevel'] = item.alarmLevel;
                obj['serverName'] = item.serverName;
                obj['serverCode'] = item.serverCode;
                this.alarmCount += item.urgentLevel + item.importantLevel + item.secondaryLevel + item.promptLevel;
                testData.push(obj)
            });
            this.legendUtil.drawCabinet(testData);
            this.$mission.currentServerIdChangeHook.subscribe(e => {
                console.log(e);
                this.graph.graphModel['forEach'](item => {
                    if (item.get('serverId') === e) {
                        console.log(item);
                        item.setStyle(this.Q.Styles.BORDER, 2);
                        item.setStyle(this.Q.Styles.BORDER_COLOR, "#2898E0");
                    } else {
                        item.setStyle(this.Q.Styles.BORDER, 0);
                    }
                })
            })
        });
    }

    /**
     * 信息展示
     */
    checekedInfo(standard, serverId) {
        if (standard === 1) {
            this.image = IMAGE.A;
        } else if (standard === 2) {
            this.image = IMAGE.F;
        } else if (standard === 3) {
            this.image = IMAGE.C;
        } else if (standard === 4) {
            this.image = IMAGE.G
        } else {
            this.image = './assets/image/cabinet.svg';
        }
        this.width = 240;
        this.height = standard * LH || parseInt(this.image.split('-')[2].split('.')[0]) * LH;
        this.serverId = serverId;
        this.standard = standard;
    }

    /**
     * 展开/关闭 侧边栏
     */
    toggle(param): void {
        if (param === 'a') {
            this.facilityState = 'inactive';
            if (this.legendState === 'active') {
                this.legendState = 'inactive';
            } else {
                this.legendState = 'active';
            }
        } else if (param === 'b') {
            this.legendState = 'inactive';
            if (this.facilityState === 'active') {
                this.facilityState = 'inactive';
            } else {
                this.facilityState = 'active';
            }
        }
    }

    legendStateToggle() {

    }

    /*点击删除当前图元*/
    delServer(): void {
        this.graph.graphModel['removeById'](this.currentId);
        this.graph.graphModel['removeById'](this.ChildId);
        this.$service.outSheves(this.shelvesId, e => {
            if (e.code === 0) {
                this.facilityState = 'inactive';
                this.$mission.commitServerId([this.serverData.roomId, this.cabinetId, 0]);
                this.$message.create('success', '下架成功');
                this.alarmCount = 0;
                this.graph.clear();
                this.legendUtil.drawCabinetBg(LH, LN);
                this.updateCabinetInfo();
                this.getServerOutList();
            }
        })
    }

    /*点击上架操作*/
    intoShelves(): void {
        let startU: any = null;
        this.graph.graphModel.forEach(e => {
            if (e.get('serverId') === this.serverId) {
                startU = AmendUtil.coordinateToU(e.y, parseInt(e.get('standard')));
            }
        });
        let body = {serverId: this.serverId, computerRoomId: this.serverData.roomId, cabinetId: this.cabinetId, startU: startU};
        this.$service.intoSheves(body, e => {
            if (e.code === 0) {
                this.isModelChange = false;
                this.$message.create('success', '保存成功');
                this.graph.clear();
                this.alarmCount = 0;
                this.legendUtil = new LegendUtil(this.Q, this.graph, this.$message);
                this.legendUtil.drawCabinetBg(LH, LN);
                AmendUtil.init(this.Q, this.graph, this.$message);
                this.updateCabinetInfo();
                this.getServerOutList();
                this.$mission.commitServerId([this.serverData.roomId, this.cabinetId, this.serverId])
            }
        })
    }

    /**
     * 获取未上架列表
     *
     */
    getServerOutList() {
        this.$service.getServerOutList(e => {
            console.log('未上架服务器列表');
            console.log(e);
            if (e.code === 0) {
                this.outServerList = e['data'];
            } else {
                this.$message.create('error', '网络错误请稍后重试')
            }

        })
    }

    /**
     * 点击调转到服务器详情页面
     * @param e
     */
    goToServerDetails(e): void {
        console.log(this.serverId);
        this.router.navigate([`/asset/servicer/rock/detail`], {queryParams: {id: this.serverId}});
    }

    /**
     * 点击调转到告警详情页面
     */
    goToAlarmDetails(): void {
        this.router.navigate([`/asset/servicer/rock/pandect/alarm`], {queryParams: {id: this.serverId}});
    }

    /**
     * 点击保存机柜信息
     *
     * */
    saveCabinet() {
        let data = {};
        data['roomId'] = this.serverData.roomId;
        data['cabinetId'] = this.cabinetId;
        data['rackServers'] = this.legendUtil.saveServerInfo();
        this.$service.saveCabinet(data, e => {
            console.log("保存机柜信息");
            console.log(e);
            this.alarmCount = 0;
            this.graph.clear();
            this.legendUtil = new LegendUtil(this.Q, this.graph, this.$message);
            this.legendUtil.drawCabinetBg(LH, LN);
            AmendUtil.init(this.Q, this.graph, this.$message);
            this.updateCabinetInfo();
            this.$message.create('success', '保存成功');
            this.getServerOutList();
            this.$mission.commitServerId([this.serverData.roomId, this.cabinetId, 0]);
        })
    }

    /**
     * 开始拖拽
     * @param ev
     */
    dragstart(ev): void {
        console.log('dragstart');
    }

    /**
     * 拖拽到目标元素  松开鼠标
     * @param ev
     */
    drop(ev): void {
        ev.preventDefault();
        let types = this.image.split('/');
        //     type = types[types.length - 1].split('-')[0].toUpperCase();
        // let row = Math.floor(parseInt(this.image.split('-')[2].split('.')[0]) / 4);
        this.legendUtil.drawNode(this.image, ev, this.serverId, this.standard, 17).then(node => {
            this.currentId = node['id'];
            this.isDragOver().then(() => {
                this.image = null;
                this.isModelChange = true;
                this.alarmCount = 0;
                this.intoShelves();
            }, () => {
                // this.delServer();
                this.graph.graphModel['removeById'](this.currentId);
                // this.graph.graphModel['removeById'](this.ChildId);
            });
        }, () => {

        });
        // switch (type) {
        //     case TYPES.CABINET:
        //         this.legendUtil.drawNode(this.image, ev, this.serverId, this.standard, 17, node => {
        //             this.currentId = node.id;
        //         });
        //         break;
        //     case TYPES.GRIFF:
        //         this.legendUtil.drawGriff(this.image, ev, this.serverId, this.standard, this.$service.getGriff(11, 22, 4, row));
        //         break;
        //     case TYPES.SERVER:
        //         this.legendUtil.drawServer(this.image, ev);
        // }
        //

    }

    private isDragOver() {
        return new Promise((resolve, reject) => {
            this.$modal.confirm({
                title: '提示！',
                content: '是否确认上架该设备至此U位？',
                onOk() {
                    resolve();
                },
                onCancel() {
                    reject();
                }
            });
        });
    }

    /**
     * 拖拽结束
     * @param ev
     */
    dragover(ev): void {
        console.log('dragover');
    }

    checkedImage(image) {
        this.image = image;
        let types = this.image.split('/'),
            type = types[types.length - 1].split('-')[0];
        if (type === 'server') {
            this.width = 20;
        } else {
            this.width = 240;
        }
        this.height = parseInt(this.image.split('-')[2].split('.')[0]) * LH;
    }

    $watchSearch(e) {
        console.log(e);
        this.$service.getServerOutListByWord(e, e => {
            console.log(e);
            this.outServerList = e.data;
        })
    }


    private mock(): Servicer {
        let servicer = new Servicer();
        servicer.id = 'id_' + AmendUtil.getRandomColor();
        servicer.name = '服务器_' + AmendUtil.getRandomColor();
        for (let i = 0; i < 3; i++) {
            let st = new ServerType();
            st.id = 'id_' + AmendUtil.getRandomColor();
            st.name = '型号_' + AmendUtil.getRandomColor();
            st.hasChildType = true;
            for (let i = 0; i < 4; i++) {
                let _st = new ServerType();
                _st.id = 'id_' + AmendUtil.getRandomColor();
                _st.name = 'name_' + AmendUtil.getRandomColor();
                let _random = Math.round(Math.random() * 4) % 4;
                _st.image = _random === 0 ? IMAGE.D : _random === 1 ? IMAGE.B : _random === 2 ? IMAGE.C : IMAGE.E;
                st.addChildren(_st);
            }
            servicer.addChildren(st);
        }
        return servicer;
    }

}

