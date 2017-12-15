import {Component, OnInit, OnDestroy} from '@angular/core';

import {Router, ActivatedRoute} from '@angular/router';
import {MachineService} from './machine.service'
import {Room, Cabinet, Servicer} from '../../models/index';
import {fadeLeftIn} from "../../animations/fade-left-in";
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {HttpClient} from '@angular/common/http';
import jQ from 'jquery'
import {MissionService} from "../../mission-store/mission.service";
import {WebSocketService} from "../../websocket.service";

@Component({
    selector: 'app-machine',
    templateUrl: './machine.component.html',
    styleUrls: ['./machine.component.scss'],
    providers: [MachineService],
    animations: [
        fadeLeftIn
    ]
})
export class MachineComponent implements OnInit, OnDestroy {
    roomName; // 当前点击的room名称
    roomId;
    data: Room[] = [];
    isCollapse: boolean = false;
    isVisible: boolean = false;
    isAddVisible: boolean = false;
    isEditorRoom: boolean = false;
    searchValue: string = '';
    ass = {
        rooms: [],
        cabinets: [],
        servicers: []
    };
    searchData: any = [];
    datas: any = [];
    cabinetDatas: any;
    stompClient;
    activeIndex = 0;
    cabinetActiveIndex: any;
    serverActiveIndex: any;
    isSearchShow: boolean = false;
    isClick = false;
    constructor(private router: Router,
                private $message: NzMessageService,
                private $modal: NzModalService,
                private $service: MachineService,
                private http: HttpClient,
                private $mission: MissionService,
                private $webSocket: WebSocketService) {
        this.$mission.roomChangeHook.subscribe(e => {
            if (e[0]) {
                this.getRoomDatas(false, e[1], e[2]);
            }
        });
        /**
         * 树上机柜的反向定位
         */
        this.$mission.clickCabinetHook.subscribe(obj => {
            this.activeIndex = null;
            this.datas.forEach(room => {
                if (room.roomId === obj[0]) {
                    room.isOpen = true;
                    this.getCabinetDatas(room.roomId, room, e => {
                        if (room.cabinetDatas) {
                            room.cabinetDatas.forEach((cabinet, i) => {
                                if (cabinet.cabinetId === obj[1]) {
                                    // cabinet.background = 'pink';
                                    room.cabinetActiveIndex = i;
                                } else {
                                    // cabinet.background = 'none';
                                }
                            })
                        } else {
                            room.cabinetDatas = [];
                        }
                    });
                } else {
                    room.isOpen = false;
                }

            })
        });
        /**
         * 树设备的反向定位
         */
        this.$mission.clickServerHook.subscribe(obj => {
            console.log(obj);
            this.activeIndex = null;
            this.datas.forEach(room => {
                room.cabinetActiveIndex = -1;
                if (room.roomId === obj[0]) {
                    room.isOpen = true;
                    this.getCabinetDatas(room.roomId, room, e => {
                        if (room.cabinetDatas) {
                            room.cabinetDatas.forEach(cabinet => {
                                if (cabinet.cabinetId === obj[1]) {
                                    // cabinet.background = 'pink';
                                    cabinet.isOpen = true;
                                    this.getServerDatas(cabinet.cabinetId, cabinet, e => {
                                        if (cabinet.servicers) {
                                            cabinet.servicers.forEach((server, i) => {
                                                if (server.serverId === obj[2]) {
                                                    // server.background = '#bdbdc3';
                                                    cabinet.serverActiveIndex = i;
                                                } else {
                                                    // server.background = 'none';
                                                }
                                            })
                                        }
                                    });

                                } else {
                                    // cabinet.background = 'none';
                                    cabinet.isOpne = false;
                                }
                            })
                        }
                    })
                } else {
                    room.isOpen = false;
                }
            })
        });
        /*删除后接受消息*/
        this.$mission.cabinetUpdateHook.subscribe(e => {
            console.log(e);
            let that = this;
            this.datas.forEach(item => {
                if (item.roomId === e) {
                    that.getCabinetDatas(item.roomId, item, e => {

                    })
                } else {

                }
            })
        })
    }

    ngOnInit() {
        this.data.push(this.$service.getMachines());
        this.data.push(this.$service.getMachines());
        this.getRoomDatas(false);
        // let socket = new window['SockJS']('/itom/itomEndpointWisely'); // 链接SockJS 的
        // this.stompClient = Stomp.over(socket); // 使用stomp子协议的WebSocket 客户端
        // this.stompClient.connect({}, frame => { // 链接Web Socket的服务端。
        //
        // });
        let $component = this;
        jQ(document).click(event => {
            if (jQ(event.target).closest('#cabinetSearch').length === 0) {
                $component.isSearchShow = false;
            }
        })
    }

    focus(ev) {
        if (ev.target.value) {
            this.isSearchShow = true;
        }
    }

    toggleMenu(item, roomId, ev) {
        if (ev.target['getAttribute']('isroom')) {
            this.getCabinetDatas(roomId, item);
        } else {
            this.getServerDatas(roomId, item)
        }
        item.isOpen = !item.isOpen;

        ev.stopPropagation();
    }

    createRoom() {
        this.isVisible = true;
        this.roomName = '';
        this.roomId = null;
        this.isEditorRoom = false;
    }

    /**
     * 接受子组件属性变化
     * @param {boolean} flag
     */
    onVoted(flag: boolean) {
        this.isVisible = flag;
        /*接收了子组件传过来的消息刷新一下房间数据*/
        this.getRoomDatas();
    }

    saveRoom(): void {

    }

    toggleCollapse(): void {

        this.isCollapse = !this.isCollapse;
        this.$mission.commitUpdateViewport(true)
    }

    /**
     * 获取机房数据
     * @param {boolean} isOpen 是否展开
     * @param {boolean} isAddRoom
     * @param {string} roomId 反向定位过来后当前高亮的roomId
     */
    getRoomDatas(isOpen = true, isAddRoom = false, roomId = '') {
        this.http.get('/itom/rooms').subscribe(data => {
            console.log(data);
            this.datas = data['data'] || [];
            if (data['data']) {
                this.getCabinetDatas(this.datas[0].roomId, this.datas[0]);
                if (isOpen) {
                    this.datas[0].isOpen = true;
                }
                if (isAddRoom) {
                    this.activeIndex = this.datas.length - 1;
                } else {
                    this.datas.forEach((room, i) => {
                        if (room.roomId === roomId) {
                            this.activeIndex = i;
                        }
                    })
                }
            }

        });
    }

    getCabinetDatas(roomId, item, callback = null) {
        let $this = this;
        this.http.get(`/itom/rooms/queryRoom/${roomId}`).subscribe(data => {
            console.log(data);
            // this.datas = data['data'];
            if (data['data'].cabinetSet) {
                item.cabinetDatas = data['data'].cabinetSet;
                let that = this;
                item.cabinetDatas.forEach(item => {
                    $this.$webSocket.stompClient.subscribe('/itomTopic/alarmMaxLevel/' + item.cabinetId, response => { // 订阅/topic/getResponse 目标发送的消息。这个是在控制器的@SendTo中定义的。
                        console.log(JSON.parse(response.body));
                        item.alarmLevel = response.body;
                        this.$mission.commitCabinetAlarmChange([item.cabinetId, item.alarmLevel])
                    });
                })
            } else {
                item.cabinetDatas = [];
            }
            if (callback) {
                callback()
            }
        });
    }

    getServerDatas(cabinetId, item, callback = null) {
        let that = this;
        this.http.get(`/itom/cabinet/queryServers/${cabinetId}`).subscribe(data => {
            console.log(data);
            item.servicers = data['data'].rackServers;
            if (data['data'].rackServers) {
                item.servicers.forEach(item => {
                    that.$webSocket.stompClient.subscribe('/itomTopic/alarmMaxLevel/' + item.serverName + '(' + item.serverIp + ')', response => {
                        console.log(response.body);
                        item.alarmLevel = response.body;
                        this.$mission.commitServerAlarmChange([item.serverId, item.alarmLevel])
                    })
                })
            }
            if (callback) {
                callback()
            }
        })
    }


    /*批量添加机房*/
    addCabinetBatch(roomName, roomId) {
        this.isAddVisible = true;
        this.roomName = roomName;
        this.roomId = roomId;
    }

    /*关闭批量添加机房模态框*/
    closeModal(e) {
        this.isAddVisible = e;
    }

    /*删除机房*/
    delroom(roomId) {
        this.http.delete(`/itom/rooms/deleteRoom/${roomId}`).subscribe(data => {
            console.log(data);
            if (data['code'] === 0) {
                /*重新获取机房数据*/
                this.getRoomDatas();
            } else if (data['code'] === 10101) {
                this.$message.create('error', data['msg']);
            }
        });
    }

    /*修改机房*/
    editorRoom(roomId, roomName) {
        this.roomName = roomName;
        this.isVisible = true;
        this.roomId = roomId;
        this.isEditorRoom = true;
    }

    /*删除机柜*/
    delCabinet(cabinetId, roomId, item) {
        this.delCabinetRes(cabinetId).then(e => {
            this.getCabinetDatas(roomId, item);
        });

    }

    /**
     * 取消操作
     */
    cancel() {
    }

    delCabinetRes(cabinetId): Promise<object> {
        var promise = new Promise((resolve, reject) => {
            this.http.delete(`/itom/cabinet/deleteCabinet/${cabinetId}`).subscribe(data => {
                if (data['code'] === 0) {
                    /*删除成功*/
                    resolve();
                } else {
                    /*删除失败*/
                    reject();
                }
            });
        });
        return promise;
    }

    /**
     * 模糊搜索功能
     */
    search(searchValue, callback) {
        this.http.get(`/itom/rooms/${searchValue}`).subscribe(data => {
            console.log(data);
            callback(data)
        })
    }

    $watchSearch(searchValue) {
        if (searchValue) {
            this.isSearchShow = true;
        } else {
            this.isSearchShow = false;
        }
        this.search(searchValue, e => {
            this.ass.rooms = e.data[0];
            this.ass.cabinets = e.data[1];
            this.ass.servicers = e.data[2];
        })
    }

    // inputblur(){
    //     this.searchValue="";

    // }
    /**
     * 点击服务器设备向机柜试图发送消息
     * @param cabinetId
     * @param serverId
     * @param index
     */
    navigateToServer(cabinetId, serverId, serverIndex, cabinetIndex) {
        // this.serverActiveIndex = index;
        this.router.navigate(['machine/cabinet/' + cabinetId]);
        console.log(serverId);
        this.$mission.commitCurrentServerIdChange(serverId);
        console.log(this.datas);
        if (this.datas) {
            this.activeIndex = null;
            this.datas.forEach((room, i) => {
                room.cabinetActiveIndex = -1;
                console.log(this.datas.cabinetDatas);
                if (room.cabinetDatas) {
                    console.log(211);
                    room.cabinetDatas.forEach((cabinet, i) => {
                        cabinet.serverActiveIndex = -1;
                        if (i === cabinetIndex) {
                            cabinet.serverActiveIndex = serverIndex
                        } else {
                            cabinet.serverActiveIndex = -1;
                        }
                    })
                }
            })
        }
    }

    /**
     * 点击机柜切换机柜选中状态
     * @param cabinetId
     * @param index
     */
    clickCabinet(cabinetId, cabinetIndex, roomIndex) {
        this.router.navigate(['machine/cabinet/' + cabinetId]);
        if (this.datas) {
            this.activeIndex = null;
            console.log(this.datas);
            this.datas.forEach((room, i) => {
                room.cabinetActiveIndex = -1;
                if (i === roomIndex) {
                    console.log(i);
                    console.log(roomIndex);
                    console.log(cabinetIndex);
                    room.cabinetActiveIndex = cabinetIndex;
                } else {
                    room.cabinetActiveIdex = -1;
                }
                if (room.cabinetDatas) {
                    room.cabinetDatas.forEach(cabinet => {
                        cabinet.serverActiveIndex = -1;
                    })
                }
            })
        }
    }

    /**
     * 点击机房切换机房选中状态并且关闭机柜选中
     * @param roomId
     * @param roomIndex
     */
    clickRoom(roomId, roomIndex) {
        this.router.navigate(['machine/room/' + roomId]);
        if (this.datas) {
            this.activeIndex = roomIndex;
            this.datas.forEach((room, i) => {
                room.cabinetActiveIndex = -1;
                if (room.cabinetDatas) {
                    room.cabinetDatas.forEach(cabinet => {
                        cabinet.serverActiveIndex = -1;
                    })
                }
            })
        }
    }

    /**
     * 页面销毁前断开webs
     */
    ngOnDestroy() {
        jQ(document).unbind('click');

    }

}
