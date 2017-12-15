import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {User} from '../models/user';

@Injectable()
export class MissionService {
    /**
     * 定义数据模型
     */
    private pageSource = new Subject<{ pageIndex: number, pageSize: number }>();
    private loginStatusSource = new Subject<User>();
    private alarmSource = new Subject<{ one: number, two: number, three: number, four: number }>();
    // 运行参数数据
    private runParamSource = new Subject<any>();
    // private assetBreadSource = new Subject<Array<{label: string, url: string}>>();
    private assetBreadSource = new Subject<any>();
    private roomChange = new Subject<any>();
    //机柜定位
    private clickCabinetChange = new Subject<any>();
    // 设备定位
    private clickServerChange = new Subject<any>();
    // 机柜更新
    private cabinetUpdateChange = new Subject<any>();
    // 树告警刷新
    private cabinetAlarmChange = new Subject<any>();
    private serverAlarmChange = new Subject<any>();
    private currentServerIdChange = new Subject<any>();
    private updateViewportChange = new Subject<any>()
    // 用于接受数据变化
    pageChangeHook = this.pageSource.asObservable();
    loginStatusChangeHook = this.loginStatusSource.asObservable();
    alarmChangeHook = this.alarmSource.asObservable();
    runParamChangeHook = this.runParamSource.asObservable();
    assetBreadChangeHook = this.assetBreadSource.asObservable();
    roomChangeHook = this.roomChange.asObservable();
    clickCabinetHook = this.clickCabinetChange.asObservable();
    clickServerHook = this.clickServerChange.asObservable();
    cabinetUpdateHook = this.cabinetUpdateChange.asObservable();
    cabinetAlarmChangeHook = this.cabinetAlarmChange.asObservable();
    serverAlarmChangeHook = this.serverAlarmChange.asObservable();
    currentServerIdChangeHook = this.currentServerIdChange.asObservable();
    updateViewportChangeHook = this.updateViewportChange.asObservable();
    // 此方法用于提交数据变化
    commitPageChange(page: { pageIndex: number, pageSize: number }) {
        this.pageSource.next(page);
    }

    commitLoginStatusChange(user: User) {
        this.loginStatusSource.next(user);
    }

    commitAlarmChange(data: { one: number, two: number, three: number, four: number }) {
        this.alarmSource.next(data);
    }

    commitRunParamChangeHook(data) {
        this.runParamSource.next(data);
    };

    // commitAssetBreadChange(data: Array<{label: string, url: string}>) {
    //     this.assetBreadSource.next(data);
    // }
    commitAssetBreadChange(data: string) {
        console.log('assetChange', data);
        this.assetBreadSource.next(data);
    }

    // 机房数据修改之后要求机房树上的名称改变
    commitRoomChange(data: any) {
        this.roomChange.next(data)
    }

    // 机房中点击机柜后向树上发送机柜的id
    commitCabinetId(data) {
        this.clickCabinetChange.next(data)
    }

    // 机柜中点击设备向树上发送roomId,cabinetId,serverId;
    commitServerId(data) {
        this.clickServerChange.next(data)
    }

    // 机柜删除后要求树上进行更新
    commitCabinetUpdate(data) {
        this.cabinetUpdateChange.next(data)
    }
    // 树上告警刷新后向机房试图发送消息
    commitCabinetAlarmChange(data) {
        this.cabinetAlarmChange.next(data)
    }
    // 树上告警刷新后向机柜试图发送消息
    commitServerAlarmChange(data){
        this.serverAlarmChange.next(data);
    }
    // 树上点击设备后机柜试图发送消息
    commitCurrentServerIdChange(data){
        this.currentServerIdChange.next(data);
    }
    // 点击隐藏树 向机房，机柜视图发送消息
    commitUpdateViewport(data){
        this.updateViewportChange.next(data);
    }
}
