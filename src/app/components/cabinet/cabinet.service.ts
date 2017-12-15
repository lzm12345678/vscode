import {Injectable} from '@angular/core';
import * as TYPES from "./types";
import {HttpClient} from '@angular/common/http';
import {NzMessageService} from "ng-zorro-antd";

const IMAGE = {
    A: './assets/image/cabinet-a-1.png',
    B: './assets/image/griff-200-4.png',
    C: './assets/image/cabinet-c-3.png',
    D: './assets/image/server-22-4.png',
    E: './assets/image/griff-200-10.png'
};
let data = [
    {x: 0, y: 42.5, image: "./assets/image/cabinet-c-3.png", type: TYPES.CABINET},
    {x: 0, y: -255, image: "./assets/image/griff-200-4.png", type: TYPES.GRIFF}
];


@Injectable()
export class CabinetService {

    constructor(private http: HttpClient) {
    }

    public getGriff1() {

    }

    public getGriff(offsetX: number = 11, width: number = 22, num: number = 4, row: number = 1): object[] {
        let tmp = [];
        for (let i = 0; i < 8 * row; i++) {
            let item = {
                x: offsetX + (i % 8) * width,
                y: Math.floor(i / 8) * num * 17,
                w: width,
                h: num * 17
            };
            tmp.push(item);
        }
        return tmp;
    }

    public getAllNode() {
        data[1]['griffData'] = this.getGriff();
        return data;
    }

    /*获取机柜信息*/
    public getServerDatas(cabinetId, callback) {
        this.http.get(`/itom/cabinet/queryServers/${cabinetId}`).subscribe(data => {
            callback(data)
        })
    }

    public getNodeInfoById(id: string) {

    }

    /*获取未上架服务器信息列表*/
    public getServerOutList(callback) {
        this.http.get(`/itom/bsserver/queryByNoShelves`).subscribe(data => {
            callback(data)
        })
    }
    public getServerOutListByWord(item,callback){
        this.http.get(`/itom/bsserver/queryByNoShelves?queryItem=${item}`).subscribe(data=>{
            callback(data)
        })
    }
    /*上架服务器*/
    public intoSheves(body, callback) {
        this.http.post(`/itom/bsserver/bsShelvesInsert`, body).subscribe(data => {
            callback(data)
        })
    }

    /*下架服务器*/
    public outSheves(bsshelvesId, callback) {
        this.http.delete(`/itom/bsserver/bsShelvesDelete/?bsshelvesId=${bsshelvesId}`).subscribe(data => {
            callback(data)
        })
    }

    /*保存机柜信息*/
    public saveCabinet(body, callback) {
        this.http.post(`/itom/bsserver/updateServers`, body).subscribe(data => {
            console.log(data);
            callback(data)
        })
    }
}
