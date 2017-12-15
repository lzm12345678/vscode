import {HttpClient} from '@angular/common/http';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, CanDeactivate} from '@angular/router';
import {NgModel} from '@angular/forms';
import {NgForm} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd';
import {
    trigger,
    state,
    style,
    animate,
    transition
} from '@angular/animations';
import {RoomSerService} from "./room-ser.service";
import {NzMessageService} from "ng-zorro-antd";
// import {Observable} from "_rxjs@5.5.2@rxjs/Observable";

import {tools} from "./room-tools";
import {MissionService} from "../../../mission-store/mission.service";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss'],
    animations: [
        trigger('attributeState', [
            state('inactive', style({
                opacity: 0,
                display: 'none'
            })),
            state('active', style({
                opacity: 1,
                display: 'block'
            })),
            transition('active => inactive', [
                animate('0.3s ease-out', style({
                    display: 'none',
                    opacity: 0,
                    transform: 'translateX(100%)'
                }))
            ]),
            transition('inactive => active', [
                style({
                    transform: 'translateX(100%)'
                }),
                animate('0.3s ease-out', style({
                    opacity: 1,
                    display: 'block',
                    transform: 'translateX(0)'
                }))
            ])
        ])
    ],
    providers: [RoomSerService]
})
export class RoomComponent implements OnInit {
    room: any = '';
    state: string = 'inactive';
    state1: string = 'inactive';
    Q = window['Q'];
    graph = null;
    model = '';
    id = '';
    name = '';
    code = '';
    ChildId = '';
    restX = null;
    restY = null;
    roomId = null;
    _roomWidth: number = 0;
    _roomHeight: number = 0;
    info = null;
    isCustomCabinet = false; // 自定义机柜显示修改宽高选项
    width = ''; // 自定义机柜的宽
    height = ''; // 自定义机柜的高
    Unumber = ''; // 自定义机柜的u数
    cabinetTypeList = '';
    roomBackgroundImg: string;
    roomName: any;
    roomName1: any;
    roomId1;
    isAddVisible: boolean = false;
    roomData: any = [];
    isModelChange = false;
    editLocation: any = {x: null, y: null};//编辑按钮的位置
    deleteLocation: any = {x: null, y: null};//删除按钮的位置
    editDeleteShow: boolean = false;
    isCreateVisible = false;
    isEditorRoom = true;
    isAddRoom = false;
    cabinetNameValidate = false;
    cabinetNameMsg :string;
    cabinetCodeValidate = false;
    isNoData = true;
    isNoData1 = true;
    canCabinetBatch = true;

    constructor(private router: Router,
                private routerInfo: ActivatedRoute,
                private RoomSerService: RoomSerService,
                private http: HttpClient,
                private $message: NzMessageService,
                private confirmSrv: NzModalService,
                private $mission: MissionService) {
        this.$mission.cabinetAlarmChangeHook.subscribe(obj => {
            this.model['forEach'](item => {
                if (item.get('cabinetId') === obj[0]) {
                    let color = obj[1] === 1 ? '#ff0000' : obj[1] === 2 ? '#ff9900' : obj[1] === 3 ? '#ffff00' : obj[1] === 4 ? '#00ccff' : '#2bd544';
                    item.children.datas[0].setStyle(this.Q.Styles.BACKGROUND_COLOR, color);
                }
            });
        });

    }

    ngOnInit() {
        this.$mission.updateViewportChangeHook.subscribe(obj=>{
            if( obj && this.graph){
                let that = this;
                setTimeout(e=>{
                    that.graph.updateViewport();
                },500)

            }
        });
        this.routerInfo.params.subscribe((params) => {
            this.isNoData1 = true;
            if (this.editDeleteShow) {
                this.editDeleteShow = false;
            }

            if (this.graph) {
                this.graph.clear();
                this.roomBackgroundImg = '';
                // tools.drawRoomBackground(this.Q,this.graph);
                // tools.drawRoom(this.Q, this.graph, 600, 600);
            }
            this.roomId = params['id'];
            console.log(this.roomId);
            if (this.roomId !== '0') {
                this.isNoData = false;
                this.getRoomInfo(this.roomId);
            } else {
                this.roomName = '无数据请点击新增机房';
                this.isNoData = true;
            }
        });
        // 反向定位页面刷新
        this.$mission.commitRoomChange([true, false, this.roomId]);
        // 通过参数查询来获取路由参数
        // this.roomId = this.routerInfo.snapshot.params['id'];
        // 页面刚进来获取机柜类型列表
        if (this.roomId !== '0') {
            this.RoomSerService.getCabinetType(e => {
                this.cabinetTypeList = e.data;
                console.log(this.cabinetTypeList);
            });
        }
        this.graph = new this.Q.Graph('mcRoom');
        tools.init(this.graph);
        // 设置坐标原点
        // this.graph.originAtCenter = false;
        // 机房宽12米 高12米 比例1米=100px 方格为10px*10px 20cm*20cm 的正方形 1px= 2cm;
        const roomWidth = 600, // px
            roomHeight = 600; // px
        // tools.drawRoomBackground(this.Q,this.graph);
        // tools.drawRoom(this.Q, this.graph, roomWidth, roomHeight);
        // 设置是否能被选择
        this.graph.isSelectable = (item) => {
            // console.log(item.agentNode.type);
            return item.get('type') === 'cabinet';
        };
        this.graph.isMovable = (e) => {
            return !e.get('isLock');
        }
        // 鼠标按下之后记录按下的信息
        var src, startX, startY, _width, _height, _type;
        document.getElementById('tools').ondragstart = (e) => {
            console.log(e.target['getAttribute']('_width'));
            _width = e.target['getAttribute']('_width');
            _height = e.target['getAttribute']('_height');
            _type = e.target['getAttribute']('_type');
            src = e.target['src'] && e.target['src'].includes('svg') ? e.target['src'].split("/")[5] : 'aaaa';
            startX = e.offsetX;
            startY = e.offsetY;
        }
        document.getElementById('mcRoom').ondrop = (e) => {
            e.preventDefault();
            // 位置的矫正 还没有做警示图标的矫正
            console.log(e);
            if (tools.checkOverLap(this.model, e, {'_width': _width, '_height': _height})) {
                // alert('目标重合请重试');
                this.$message.create('error', '该位置已有机柜');
                return;
            }
            const x = tools.correctLocation(e.offsetX, _width);
            let y = tools.correctLocation(e.offsetY, _height);
            let p = this.graph.toLogical(x, y);
            if (_type === 'roomWall') {
                tools.drawRoomWall(this.Q, this.graph, p.x, p.y);
                return;
            }
            if (_type === 'customCabinet') {
                tools.drawCustomCabinet(this.Q, this.graph, p.x, p.y);
                return;
            }
            this.id = tools.drawCabinet(this.Q, this.graph, '', this.code, p.x, p.y, _width, _height, 0, '');
            this.isModelChange = true;
            this.name = '';
            this.code = '';
            this.iisVisible = true;
            this.isAddRoom = true;

        };
        let model = this.graph.graphModel;
        this.model = model;
        //点击机房3
        this.graph.onclick = e => {
            console.log(e);
            console.log(e.getData());
            this.editDeleteShow = false;
            if (e.getData() && e.getData().get('type') === 'cabinet') {
                this.editDeleteShow = true;
                this.editLocation = this.graph.toCanvas(e.getData().x + e.getData().size.width / 2 + 5, e.getData().y - 10);
                this.deleteLocation = this.graph.toCanvas(e.getData().x + e.getData().size.width / 2 + 25, e.getData().y - 10);
                this.id = e.getData().id;
                this.name = e.getData().get('name');
                this.code = e.getData().get('code');
                // 点击机柜之后向树发送机柜id
                if (e.getData().get('cabinetId')) {
                    this.$mission.commitCabinetId([this.roomId, e.getData().get('cabinetId')])
                }
                //子图元的id
                if (e.getData().data) {
                    this.ChildId = e.getData().data.children.datas[0].id;
                }
                // this.state = 'active';
                this.graph.editable = false;
                // 点到自定义机柜之后显示宽高设置
                if (e.getData().get('type') === 'customCabinet') {
                    console.log(e);
                    this.isCustomCabinet = true;
                    this.width = e.getData().size.width;
                    this.height = e.getData().size.height;
                } else {
                    this.isCustomCabinet = false;
                }
            } else if (e.getData() && e.getData().get('type') === 'roomWall') {
                this.editDeleteShow = false;
                this.id = e.getData().id;
                this.graph.editable = true;
            } else {
                this.graph.editable = false;
            }
        };
        // 右键改名字
        /**
         * 双击进入机柜页面
         */
        this.graph.ondblclick = e => {
            if (e.getData() && e.getData().type === 'Q.Node' && e.getData().get('type') === 'cabinet') {
                if(e.getData().get('cabinetId')===''){
                    this.$message.create('error','该机柜未保存，请点击左上角保存');
                }else {
                    this.$mission.commitCabinetId([this.roomId, e.getData().get('cabinetId')]);
                    this.router.navigate(['machine/cabinet/' + e.getData().get('cabinetId')]);
                }

            }
        }
        // 图元的拖拽位置吸附
        this.graph.startdrag = e => {
            this.editDeleteShow = false;
            // 记录下位置让目标退回到原来的位置
            if (e.getData() && e.getData().type !== 'Q.ShapeNode') {
                this.restX = e.getData().x;
                this.restY = e.getData().y;
            }

        }
        this.graph.onmousewheel = e => {
            this.editDeleteShow = false;
        }
        this.graph.enddrag = e => {
            this.editDeleteShow = false;
            this.isModelChange = true;
            if (e.getData() && e.getData().type !== 'Q.ShapeNode' && !e.getData().get('isLock')) {
                if (tools.checkOverLap(this.model, e, null)) {
                    e.getData().x = this.restX;
                    e.getData().y = this.restY;
                    // 如果有告警图标
                    if (e.getData().childrenCount !== 0) {
                        e.getData().children.datas[0].x = e.getData().x - e.getData().size.width / 2 - 10;
                        e.getData().children.datas[0].y = e.getData().y;
                    }
                    // alert('目标重合了 请重试');
                    this.$message.create('error', '机柜重叠了请重试')
                } else {
                    e.getData().x = tools.correctLocation(e.getData().x, e.getData().size.width);
                    e.getData().y = tools.correctLocation(e.getData().y, e.getData().size.height);
                    // 设置告警图标的位置
                    if (e.getData().childrenCount !== 0) {
                        e.getData().children.datas[0].x = e.getData().x - e.getData().size.width / 2 - 10;
                        e.getData().children.datas[0].y = e.getData().y;
                        // e.getData().children.datas[0].setStyle(this.Q.Styles.BACKGROUND_COLOR,'#0094ff');
                    }
                }
            }
        };
    }

    delCabinet(): void {
        if (this.graph.getUI(this.id).data && this.graph.getUI(this.id).data.get('cabinetId') === '') {
            this.model['removeById'](this.id);
            this.model['removeById'](this.ChildId);
        } else {

            let cabinetId = this.graph.getUI(this.id).data.get('cabinetId');
            this.http.delete(`/itom/cabinet/deleteCabinet/${cabinetId}`).subscribe(data => {
                if (data['code'] === 0) {
                    // alert('删除成功')
                    //向树上发送消息
                    this.$mission.commitCabinetId([this.roomId, 0]);
                    // 更新机房的设备占用情况
                    this.RoomSerService.getRoomInfo(this.roomId, data => {
                        if (data['code'] === 0) {
                            this.roomData = data['data']['cabinetSet'];
                        }
                    })
                } else {
                }
            });
            this.model['removeById'](this.id);
            this.model['removeById'](this.ChildId);
        }

    }

    /*锁定和解锁的代码*/
    lockCabinet(): void {
        this.model['forEach'](e => {
            if (e.id == this.id) {
                e.set('isLock', true);
            }
        });
    }

    unLockCabinet(): void {
        this.model['forEach'](e => {
            if (e.id === this.id) {
                e.set('isLock', false);
            }
        });
    }

    editCabinet(): void {
        this.model['forEach'](e => {
            if (e.id === this.id) {
                e.name = this.name.replace(/[\u4e00-\u9fa5]/g, "aa").length > 8 ? this.name.substring(0, 4) + '...' : this.name;
                e.set('name', this.name);
                e.set('code', this.code);
                tools.setToolTip(e, this.name, this.code);
                if (e.get('type') === 'customCabinet') {
                    e.size = {width: this.width, height: this.height};
                }
            }
        });
    }

    toggle(): void {
        if (this.state === 'active') {
            this.state = 'inactive';
            // this.state1 = 'active';
        } else {
            this.state = 'active';
            this.state1 = 'inactive';
        }
    }

    toolsToggle(): void {
        if (this.state1 === 'active') {
            this.state1 = 'inactive'
        } else {
            this.state1 = 'active';
            this.state = 'inactive'
        }
    }

    // 弹框修改机房大小
    iisVisible = false;
    isVisible = false;
    isConfirmLoading = false;
    roomWidth = null;
    roomHeight = null;

    // 点击弹出修改机柜的模态框（备用）
    showCabinetModal() {
        this.iisVisible = true;
    }

    handleOkcabinet() {
        this.name = this.name.trim();
        let length = this.name.replace(/[\u4e00-\u9fa5]/g, "aa").length;
        if ( length <= 0) {
            this.cabinetNameValidate = true;
            this.cabinetNameMsg = '请输入机柜名称';
        } else if (length > 32) {
            this.cabinetNameValidate = true;
            this.cabinetNameMsg = '机柜名称不能超过32个字符';
        }else {
            this.cabinetNameValidate = false;
        }
        if (!this.cabinetNameValidate) {
            this.iisVisible = false;
            this.isAddRoom = false;
            this.isNoData1 = false;
            this.editCabinet();
        }
    }

    /**
     * 点击取消按钮删除机柜
     */
    hiddenCabinet() {
        this.iisVisible = false;
        this.cabinetNameValidate = false;
        if (this.isAddRoom) {
            this.delCabinet();
            this.isAddRoom = false;
            this.name = '';
            this.code = '';
        }

    }

    showConfirm = () => {
        let that = this;
        this.confirmSrv.confirm({
            title: '您是否确认要删除该机柜',
            content: '<b>删除后机柜上的设备将作下架处理</b>',
            onOk() {
                that.editDeleteShow = false;
                that.delCabinet();
                //    删除后向树发信息要求更新当前机柜树
                that.$mission.commitCabinetUpdate(that.roomId);
            },
            onCancel() {
            }
        });
    };
    showModal = () => {
        this.isVisible = true;
    }
    // 修改机房大小的代码(备用)
    handleOk = (e) => {
        this.isConfirmLoading = true;
        console.log(this._roomHeight);
        console.log(this._roomWidth);
        this.graph.clear();
        setTimeout(() => {
            this.isVisible = false;
            this.isConfirmLoading = false;
            tools.drawRoom(this.Q, this.graph, this._roomWidth * 50, this._roomHeight * 50);
            for (var i = 0; i < this.info.length; i++) {
                //tools.drawCabinet(this.Q, this.graph, this.info[i].name, this.info[i].x, this.info[i].y, this.info[i].w, this.info[i].h, this.info[i].img)
            }
        }, 2000);

    }

    handleCancel = (e) => {
        this.isVisible = false;
    }
    /**
     * 保存机房信息
     */
    roomSave = () => {
        console.log(this.graph);
        let arr = [];
        this.model['forEach']((item) => {
            if (item.get('type') === 'cabinet' || item.get('type') === 'roomWall') {
                console.log(item);
                var element = {
                    cabinetId: '',
                    cabinetName: "",
                    cabinetMaxU: 42,
                    cabinetHeight: "",
                    cabinetWidth: "",
                    cabinetImage: "",
                    cabinetType: "",
                    cabinetX: 200,
                    cabinetY: 290,
                    cabinetRemark: "",
                    roomId: 2
                }
                element.cabinetId = item.get('cabinetId');
                element.cabinetName = item.get('name');
                element.cabinetHeight = item.size.height;
                element.cabinetWidth = item.size.width;
                element.cabinetImage = item.image;
                element.cabinetX = item.x;
                element.cabinetY = item.y;
                element.roomId = this.roomId;
                element.cabinetRemark = item.get('code');
                // if (item.childrenCount === 1) {
                //     element.cabinetType = item.children.datas[0];
                // }else {
                //     element.cabinetType = null;
                // }
                arr.push(element);
            }
        });
        console.log(arr);
        let obj1 = {};
        obj1['roomId'] = this.roomId;
        obj1['cabinetSet'] = arr;
        this.RoomSerService.saveRoomInfo(obj1, e => {
            this.$mission.commitRoomChange([true, false, this.roomId])
            this.graph.clear();
            // tools.drawRoom(this.Q, this.graph, 600, 600);
            this.isModelChange = false;
            if (this.roomId) {
                this.getRoomInfo(this.roomId);
            }
        });
    };


    /**
     * 删除机房
     */
    delRoom() {
        //    删除机房之后掉到树的第一个机房
        this.confirmSrv.confirm({
            title: '确认要删除吗？',
            content: '删除机房后，机房中的机柜同时被删除，机柜上的设备做下架处理',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                this.RoomSerService.delRoom(this.roomId, e => {
                    // this.$mission.commitRoomChange([true, false]);
                    this.http.get(`/itom/rooms`).subscribe(e => {
                        let id = e['data'] ? e['data'][0]['roomId'] : 0;
                        this.isModelChange = false;
                        this.router.navigate(['machine/room/' + id]);
                        this.$mission.commitRoomChange([true, false, id]);
                    })
                })
            },
            onCancel: () => {

            }
        });

    }

    /**
     * 新增机房
     */
    createRoom() {
        this.isCreateVisible = true;
        this.roomName1 = '';
        this.roomId1 = null;
        this.isEditorRoom = false;
    }

    editRoom() {
        this.isCreateVisible = true;
        this.roomName1 = this.roomName;
        this.roomId1 = this.roomId;
        this.isEditorRoom = true;
    }

    onVoted(flag) {
        this.isCreateVisible = flag[0];
        console.log(this.roomName1);
        /*修改机房接收了子组件传过来的消息刷新一下房间和树数据*/
        if (this.isEditorRoom && flag[1]) {
            if (this.roomId) {
                if (this.graph) {
                    this.graph.clear();
                }
                this.getRoomInfo(this.roomId);
            }
            this.$mission.commitRoomChange([true, false, this.roomId])
        } else if (flag[1]) {
            //新增机房成功 传回更新树 并且树的第二个参数为最后一个选中
            this.$mission.commitRoomChange([true, true]);
        }

    }

    /*获取机房详情*/
    getRoomsDetail() {
        this.http.get('/itom/rooms').subscribe(data => {
            this.info = data;
        });
    }


    /**
     * 获取机房信息
     */
    getRoomInfo(roomId: number): any {
        this.http.get(`/itom/rooms/queryRoom/${roomId}`).subscribe(data => {
            if (data['code'] === 0) {
                console.log(data);
                this.roomData = data['data']['cabinetSet'];
                let info = data['data']['cabinetSet'];
                if (data['data']['roomImage'] === '') {
                    this.roomBackgroundImg = '';
                    //取消默认背景图
                    // tools.drawRoomBackground(this.Q, this.graph)
                } else {
                    this.roomBackgroundImg = "/" + data['data']['roomImage'];
                    tools.drawRoomBackground(this.Q, this.graph, this.roomBackgroundImg);
                }
                this.roomName = data['data'].roomName;
                for (let i = 0; i < info['length']; i++) {
                    let cabinetImage;
                    console.log(((parseInt(info[i].usedU) - 1) / info[i].cabinetMaxU === 0));
                    if ((parseInt(info[i].usedU) - 1) / info[i].cabinetMaxU === 0) {
                        cabinetImage = './../../../assets/room/mx-cabinet4white.svg'
                    } else if ((parseInt(info[i].usedU) - 1) != 0 && info[i].usedU / info[i].cabinetMaxU > 0.5) {
                        cabinetImage = './../../../assets/room/mx-cabinet4.svg'
                    } else if ((parseInt(info[i].usedU) - 1) != 0 && info[i].usedU / info[i].cabinetMaxU <= 0.5) {
                        cabinetImage = './../../../assets/room/mx-cabinet4yellow.svg'
                    } else {
                        cabinetImage = './../../../assets/room/mx-cabinet4red.svg'
                    }
                    tools.drawCabinet(this.Q, this.graph, info[i].cabinetName, info[i].cabinetRemark, info[i].cabinetX, info[i].cabinetY, info[i].cabinetWidth, info[i].cabinetHeight, cabinetImage, info[i].cabinetId, info[i].alarmLevel)
                }
            } else {
                alert(data['msg']);
                return;
            }
        });
    }

    /**
     * 批量生成机柜
     */
    addCabinetBatch(roomName, roomId) {
        this.isAddVisible = true;
        // this.roomName = roomName;
        // this.roomId = roomId;
    }

    closeModal(e) {
        this.isAddVisible = e;
        if (this.roomId) {
            this.getRoomInfo(this.roomId);
        }
    }

    /**
     * 新增机柜验证
     */
    validate(e, target) {
        if (target === 'cabinetName') {
            // e = e.replace(/(^\s*)|(\s*$)/g, "");
            e = e.trim();
            console.log(e);
            let length = e.replace(/[\u4e00-\u9fa5]/g, "aa").length;
            if(length === 0){
                this.cabinetNameValidate = true;
                this.cabinetNameMsg = '请输入机柜名称';
            }else if (length > 32 ) {
                this.cabinetNameValidate = true;
                this.cabinetNameMsg = '机柜名称不能超过32个字符';
            } else {
                this.cabinetNameValidate = false;
            }

        } else if (target === 'cabinetCode') {
            let length = e.replace(/[\u4e00-\u9fa5]/g, "aa").length;
            if (length > 32) {
                this.cabinetCodeValidate = true;
            } else {
                this.cabinetCodeValidate = false;
            }
        }

    }
}

