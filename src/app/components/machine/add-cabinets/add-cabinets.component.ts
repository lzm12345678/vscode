import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {RoomSerService} from "../../room/room-ser.service";
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';

@Component({
    selector: 'app-add-cabinets',
    templateUrl: './add-cabinets.component.html',
    styleUrls: ['./add-cabinets.component.scss'],
    providers: [RoomSerService]
})
export class AddCabinetsComponent implements OnInit {
    @Input()
    isAddVisible: boolean;
    @Input()
    roomName = '';
    @Input()
    roomId = '';
    @Output()
    close = new EventEmitter<boolean>();
    cabinetType: any;
    cabinetCol: number;
    cabinetRow: number;
    selectedCabinetType: any = 0;
    cabinetName: any = '';
    cabinetValidate: boolean = false;
    cabinetMsg: string;
    cabinetColValidate: boolean = false;
    cabinetColNumValidate: boolean = false;
    cabinetRowValidate: boolean = false;
    cabinetSumValidate: boolean = false;
    isLoading: boolean = false;
    radioValue: any = 'custom';
    inputDisabled: boolean;

    constructor(private RoomSerService: RoomSerService) {

    }

    ngOnInit() {
        this.RoomSerService.getCabinetType(e => {
            this.cabinetType = e.data;
            console.log(this.cabinetType);
        })

    }

    closeModal() {
        this.cabinetName = '';
        this.cabinetRow = null;
        this.cabinetCol = null;
        this.cabinetValidate = false;
        this.cabinetRowValidate = false;
        this.cabinetColValidate = false;
        this.cabinetSumValidate = false;
        this.close.emit(false)
    }

    radioValueChange(e) {
        if (e === 'custom') {
            this.inputDisabled = false
        } else {
            this.inputDisabled = true;
        }
    }

    /**
     * 表单简单的验证
     * @param e
     * @param target
     */
    inputChange(e, target): void {
        console.log(e);
        e = e.trim();
        let length = e.replace(/[\u4e00-\u9fa5]/g, "aa").length;
        if (target === 'cabinetName') {
            if (length > 28) {
                this.cabinetValidate = true;
                this.cabinetMsg = '机柜名称不能超过28个字符'
            } else if (length === 0) {
                this.cabinetValidate = true;
                this.cabinetMsg = '请输入机柜名称'
            }
            else {
                this.cabinetValidate = false;
            }
        } else if (target === 'cabinetCol') {
            let reg = /^[1-9]\d*$/;
            console.log(reg.test(e));
            if (!reg.test(e)) {
                this.cabinetColValidate = true;
            } else {
                this.cabinetColValidate = false;
            }
            console.log(this.radioValue);
            if (this.radioValue !== 'custom') {
                if (e > 26) {
                    this.cabinetColNumValidate = true;
                } else {
                    this.cabinetColNumValidate = false;
                }
            }
        } else if (target === 'cabinetRow') {
            let reg = /^[1-9]\d*$/;
            if (!reg.test(e)) {
                this.cabinetRowValidate = true;
            } else {
                this.cabinetRowValidate = false;
            }
        }

    }

    /**
     * 获取所有的大写字母
     * @return {Array}
     */
    generateBig() {
        let str = [];
        for (let i = 65; i < 91; i++) {
            str.push(String.fromCharCode(i));
        }
        return str;
    }

    saveRoom() {
        if (this.radioValue === 'custom') {
            this.cabinetName = this.cabinetName.trim();
            let length = this.cabinetName.replace(/[\u4e00-\u9fa5]/g, "aa").length;
            if (length === 0) {
                this.cabinetValidate = true;
                this.cabinetMsg = '请输入机柜名称';
                return;
            } else if (length > 28) {
                this.cabinetValidate = true;
                this.cabinetMsg = '机柜名称不能超过28个字符';
                return;
            }
        }
       let  reg = /^[1-9]\d*$/;
        if ( !reg.test(this.cabinetCol+'')) {
            this.cabinetColValidate = true;
            return;
        }
        if (!reg.test(this.cabinetRow+'')) {
            this.cabinetRowValidate = true;
            return;
        }
        if (this.radioValue === 'predefine' && this.cabinetCol > 26) {
            return;
        }
        if (this.cabinetCol * this.cabinetRow > 999) {
            this.cabinetSumValidate = true;
            return;
        }
        this.isLoading = true;
        let arr = [];
        for (let j = 0; j < this.cabinetCol; j++) {
            for (let i = 0; i < this.cabinetRow; i++) {
                let element = {
                    cabinetId: '',
                    cabinetName: "",
                    cabinetMaxU: 32,
                    usedU: "",
                    cabinetHeight: 20,
                    cabinetWidth: 0,
                    cabinetImage: "",
                    cabinetType: "",
                    cabinetX: 200,
                    cabinetY: 290,
                    cabinetRemark: "",
                    roomId: ''
                };
                if (this.radioValue === 'custom') {
                    let str = '';
                    str += (i + j * this.cabinetRow+1) < 100 ? (i + j * this.cabinetRow+1) < 10 ? '00' : '0' : '';
                    str +=(i + j * this.cabinetRow+1);
                    element.cabinetName = this.cabinetName+'-'+str;
                } else if (this.radioValue === 'predefine') {
                    let str = this.generateBig()[j];
                    str += i < 100 ? i < 10 ? '00' : '0' : '';
                    str += (i + 1);
                    element.cabinetName = str;
                }
                element.usedU = '';
                element.cabinetId = '';
                element.cabinetMaxU = 42;
                element.usedU = '';
                element.cabinetHeight = this.cabinetType[this.selectedCabinetType].cabinetTypeHeight / 20;
                element.cabinetWidth = this.cabinetType[this.selectedCabinetType].cabinetTypeWidth / 20;
                element.cabinetImage = this.cabinetType[this.selectedCabinetType].cabinetTypeImage;
                element.cabinetType = '';
                element.cabinetX = i * (this.cabinetType[this.selectedCabinetType].cabinetTypeWidth / 20 + 20 + 40) + 120 - 400 - 200 + 40;
                element.cabinetY = j * (this.cabinetType[this.selectedCabinetType].cabinetTypeHeight / 20 + 20 - 10 ) + 120 - 400;
                element.cabinetRemark = '';
                element.roomId = this.roomId;
                arr.push(element)
            }
        }
        let obj = {};
        obj['roomId'] = this.roomId;
        obj['cabinetSet'] = arr;
        this.RoomSerService.saveRoomInfo(obj, e => {
            this.close.emit(false);
            this.cabinetRow = null;
            this.cabinetCol = null;
            this.cabinetName = '';
            this.cabinetColValidate = false;
            this.cabinetRowValidate = false;
            this.cabinetSumValidate = false;
            this.cabinetValidate = false;
            this.isLoading = false;
        });
        console.log(this.cabinetType[this.selectedCabinetType]);
    }

    /**
     * 点击单选框
     */
    clickRadio(type) {
        if (type === 'custom') {
            if (this.cabinetCol > 26) {
                this.cabinetColNumValidate = false;
            }
        }
        if (type === 'predefine') {
            if (this.cabinetCol > 26) {
                this.cabinetColNumValidate = true;
            }
        }

    }

}
