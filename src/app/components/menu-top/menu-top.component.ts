import { Component, OnInit, NgModule } from '@angular/core';
import { Router } from '@angular/router'
import { MenuTopService } from './menu-top.service';
import { MissionService } from "../../mission-store/mission.service";
import { User, Utils } from "../../models";
import * as Stomp from 'stompjs';
import { RunParamService } from "../../mission-store/runParam.service"
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import {WebSocketService} from "../../websocket.service";
@NgModule({
    imports:      [  ],
    declarations: [ MenuTopComponent ],
    bootstrap:    [ MenuTopComponent ],
})

@Component({
    selector: 'app-menu-top',
    templateUrl: './menu-top.component.html',
    styleUrls: ['./menu-top.component.scss'],
    providers: [ MenuTopService,  NzMessageService, RunParamService]
})
export class MenuTopComponent implements OnInit {
    menuData;
    loginUser: User;
    isModifyModalShow: boolean = false;
    oldPwd: string;
    oldMsg: string;
    newPwd: string;
    newMsg: string;
    rePwd: string;
    reMsg: string;
    alarmInfo = [
        { alarmLevel: '1', count: 0 },
        { alarmLevel: '2', count: 0 },
        { alarmLevel: '3', count: 0 },
        { alarmLevel: '4', count: 0 }
    ];
    isSubscribe: boolean = false;
    constructor(
        private $service: MenuTopService,
        private $router: Router,
        private $mission: MissionService,
        private confirmSrv: NzModalService,
        private $message: NzMessageService,
        private $runParam: RunParamService,
        private $webscoket:WebSocketService

    ) {

        // $mission.alarmChangeHook.subscribe(data => {
        //     this.alarmInfo = data;
        // });
    }

    ngOnInit() {

        let _user = Utils.isUserLogin(),
            $component = this;
        if (_user) {
            /**
             * 触发告警推送
             */
            this.$service.getEveryAlarmCount().then((success: Array<any>) => {
                success.forEach(item => {
                    this.alarmInfo.forEach(alarm => {
                        if (alarm.alarmLevel === item.alarmLevel) {
                            alarm.count = item.count;
                        }
                    });
                });
            });

            this.loginUser = _user;
            let userId = this.loginUser.userId;
            console.log('userId', userId);
            this.$service.mockMenu(userId, (data) => {
                this.menuData = data;
                console.log('topMenu', this.menuData);
            });
            // let socket = new window['SockJS']('/itom/itomEndpointWisely'); // 链接SockJS 的
            // let stompClient = Stomp.over(socket); // 使用stomp子协议的WebSocket 客户端
            this.$webscoket.stompClient.connect({}, frame => { // 链接Web Socket的服务端。
                this.$webscoket.stompClient.subscribe('/itomTopic/user/' + userId, response => {
                    // 订阅/topic/getResponse 目标发送的消息。这个是在控制器的@SendTo中定义的。
                    this.isSubscribe = true;
                    Utils.loginOut();
                    this.confirmSrv.warning({
                        title: '',
                        content: response.body
                    });
                    this.$webscoket.stompClient.disconnect();
                    this.$router.navigate([''])
                });

                /**
                 * 右上角告警推送
                 */
                this.$webscoket.stompClient.subscribe('/itomTopic/everyLevelAlarmCount', response => {
                    let _temp = JSON.parse(response.body) || [];
                    _temp.forEach(item => {
                        this.alarmInfo.forEach(alarm => {
                            if (alarm.alarmLevel === item.alarmLevel) {
                                alarm.count = item.count;
                            }
                        });
                    });
                });

            });
        }

    }
    navigate(item) {
        if (item.url) {
            if (item.name === '机房') {
                /*获取数据库第一个机房的id*/
                this.$service.getRooms(e => {
                    let id =e?e[0]['roomId']:0;
                    this.$router.navigate(['machine/room/' + id])
                })
            }else {
                this.$router.navigate([item.url]);
            }

        }
    }

    blur(param: string) {
        if (param === 'old') {
            this.validateOldPwd(this.oldPwd, result => {
                if (result.result === 0) {
                    this.oldMsg = result.msg;
                } else {
                    this.oldMsg = '';
                }
            });
        } else if (param === 'new') {
            this.validateNewPwd(this.newPwd, result => {
                if (result.result === 0) {
                    this.newMsg = result.msg;
                } else {
                    this.newMsg = '';
                }
            });
        } else if (param === 're') {
            this.validateRePwd(this.rePwd, result => {
                if (result.result === 0) {
                    this.reMsg = result.msg;
                } else {
                    this.reMsg = '';
                }
            });
        } else {

        }
    }

    logout() {
        this.$service.logout(result => {
            Utils.loginOut();
            this.$mission.commitLoginStatusChange(null);
            this.$router.navigate([''])
        });
    }

    openModal() {
        this.isModifyModalShow = true;
        this.oldPwd = null;
        this.newPwd = null;
        this.rePwd = null;
    }

    handleCancel() {
        this.isModifyModalShow = false;
        this.oldPwd = '';
        this.newPwd = '';
        this.rePwd = '';
        this.oldMsg = '';
        this.newMsg = '';
        this.reMsg = '';
    }

    handleOk() {
        this.blur('old');
        this.blur('new');
        this.blur('re');
        if (!this.oldMsg && !this.newMsg && !this.reMsg) {
            this.$service.modifyPwd(this.loginUser.userId, this.oldPwd, this.newPwd, result => {
                this.$message.success('修改密码成功！');
                this.isModifyModalShow = false;
            });
        }
        // this.validateOldPwd(this.oldPwd, result => {
        //     if (result.result === 1) {
        //         this.validateNewPwd(this.newPwd, result => {
        //             if (result.result === 1) {
        //                 this.validateRePwd(this.rePwd, result => {
        //                     if (result.result === 1) {
        //
        //                     } else {
        //                         // this.$message.error('请正确填写信息')
        //                     }
        //                 });
        //             } else {
        //                 // this.$message.error('请正确填写信息')
        //             }
        //         })
        //     } else {
        //         // this.$message.error('请正确填写信息')
        //     }
        // });
    }

    private validateOldPwd(pwd: string, callback) {
        if (!pwd) {
            return callback( { result: 0, msg: '密码不能为空~' });
        }
        if (pwd.length > 16) {
            return callback( { result: 0, msg: '密码最多16位数~' });
        }
        return callback( { result: 1, msg: '' } );
    }

    private validateNewPwd(pwd: string, callback) {
        if (!pwd) {
            return callback( { result: 0, msg: '密码不能为空~' } );
        }
        if (pwd.length < 8) {
            return callback( { result: 0, msg: '密码至少8位数~' } );
        }
        if (pwd.length > 16) {
            return callback( { result: 0, msg: '密码最多16位数~' } );
        }
        if (pwd === this.oldPwd) {
            return callback( { result: 0, msg: '新密码不能和旧密码相同~' } );
        }
        let regex = new RegExp(/(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{8,16}$/, 'g');
        if (!regex.test(pwd)) {
            return callback( { result: 0, msg: '密码必须包含字母、数字、符号中两种，不能有空格' } );
        }
        return callback( { result: 1, msg: '' } );
    }

    private validateRePwd(pwd: string, callback) {
        if (pwd !== this.newPwd) {
            return callback( { result: 0, msg: '与新密码不一致~' } );
        }
        return callback( { result: 1, msg: '' } );
    }
}
