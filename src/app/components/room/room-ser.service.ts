import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from "ng-zorro-antd";
import {ProxyService} from "../../proxy.service";

@Injectable()
export class RoomSerService {

    constructor(private http: HttpClient,
                private $message: NzMessageService,
                private $proxy: ProxyService) {
    }

    getCabinetInfo() {
        return [
            new roomcabinet('jjjppp', 429, 100, 150, 60, 40, "assets/room/mx-cabinet4red.svg"),
            new roomcabinet('42U-023', 431, 100, 190, 60, 40, "assets/room/mx-cabinet4red.svg"),
            new roomcabinet('42U-022', 42, 100, 230, 60, 40, "assets/room/mx-cabinet4.svg"),
            new roomcabinet('42U-d23', 49, 100, 270, 60, 40, "assets/room/mx-cabinet4.svg"),
            new roomcabinet('42U-023', 489, 100, 310, 60, 40, "assets/room/mx-cabinet4red.svg"),
            new roomcabinet('jjjppp', 429, 200, 150, 60, 40, "assets/room/mx-cabinet4red.svg"),
            new roomcabinet('42U-023', 431, 200, 190, 60, 40, "assets/room/mx-cabinet4red.svg"),
            new roomcabinet('42U-022', 42, 200, 230, 60, 40, "assets/room/mx-cabinet4.svg"),
            new roomcabinet('42U-d23', 49, 200, 270, 60, 40, "assets/room/mx-cabinet4.svg"),
            new roomcabinet('42U-023', 489, 200, 310, 60, 40, "assets/room/mx-cabinet4red.svg")
        ];
    }

    /**
     * 页面进入获取机房的信息
     * getRoomInfo
     * */
    getRoomInfo(roomId,callback): any {
        this.http.get(`/itom/rooms/queryRoom/${roomId}`).subscribe(data => {
            callback(data)
        });
    }
    /**
     * 保存页面中的机柜信息
     * @param {}
     * */
    saveRoomInfo(obj, callback) {
        this.http.put(`/itom/rooms/updateCabinetSet/`, obj).subscribe(data => {
            if (data['code'] === 0) {
                console.log('数据保存成功');
                console.log(data);
                callback();
            } else {
                console.log("网络异常");
            }
        });
    }

    getCabinetType(callback) {
        this.http.get(`/itom/cabinetType/list`).subscribe(data => {
            if (data['code'] === 0) {
                callback(data);
            } else {
                this.$message.create('error', ' 网络错误,请稍后重试')
            }
        })
    }
    delRoom(roomId,callback){
        this.$proxy.delete(`/itom/rooms/deleteRoom/${roomId}`,e=>{
            callback(e)
        })
    }
}

export class roomcabinet {
    constructor(public name: string,
                public id: number,
                public x: number,
                public y: number,
                public w: number,
                public h: number,
                public img: string) {
    }
}
