import {Component, OnInit, NgModule, Input,
    Output, EventEmitter,SimpleChanges,OnChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
@NgModule({
    imports: [],
    declarations: [CreateRoomModalComponent],
    bootstrap: [CreateRoomModalComponent]
})

@Component({
    selector: 'app-create-room-modal',
    templateUrl: './create-room-modal.component.html',
    styleUrls: ['./create-room-modal.component.scss']
})
export class CreateRoomModalComponent implements OnInit ,OnChanges{
    @Input() isVisible: boolean;
    @Input() isEditorRoom: boolean = false;
    @Input() roomId: any = null;
    @Output() onVoted = new EventEmitter<any>();
    roomUpload = null;
    @Input()
    roomName: string = '';
    _roomName:string ='';
    roomWith = '';
    roomLength = '';
    roomImage = '';
    roomValidate: boolean = false;
    roomValidateMsg :string ;
    file: any;
    isLoading: boolean = false;
    constructor(private http: HttpClient,
                private $message: NzMessageService,
                private $route:Router) {
    }

    ngOnInit() {

    }
    ngOnChanges(changes: SimpleChanges) {
        if(changes['roomName']){
            this._roomName = changes['roomName'].currentValue;
        }
    }

    /**
     * 通知父组件
     * @param 传回父组件的参数[],通知关闭，和修改是是否成功
     */
    closeModal() {
        this.onVoted.emit([false,false]);
        this.roomValidate = false;
        this.roomUpload = null;
        this.file =null;
        if(!this.isEditorRoom){
            this.roomId = null;
            this.roomName = '';
        }else {
            //在修改机房的情况下点击取消按钮
            console.log(this._roomName);
            this.roomName = this._roomName;
        }

    }

    /**
     *
     */
    beforeUpload(param) {
        let file = param.target.files[0];
        this.file = param.target.files[0];
        let _this = this;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = ev => {
            _this.roomUpload = ev.target['result'];
        };
    }

    saveRoom() {
        if(this.roomValidate){
            return
        }
        if (this.roomName.length === 0) {
            this.roomValidateMsg ='请输入机房名称';
            this.roomValidate = true;
            return;
        }
        if (!this.isEditorRoom) {
            this.isLoading = true;
            let body = new FormData();
            body.append('roomName', this.roomName.replace(/(^\s*)|(\s*$)/g, ""));
            body.append('roomMaxCabinet', '50');
            body.append('roomLength', this.roomLength);
            body.append('pic', this.file);
            console.log(body);
            this.http.post('/itom/rooms/addRoom', body, {
                headers: new HttpHeaders().set('Accept', 'multipart/form-data;text/plain, */*')
            }).subscribe(data => {
                console.log(data);
                if (data['code'] === 0) {
                    this.$message.create('success', data['msg']);
                    this.onVoted.emit([false,true]);
                    this.roomValidate = false;
                    this.roomUpload = null;
                    this.roomId = null;
                    this.roomName = '';
                    this.file = null;
                    this.isLoading = false;
                    this.$route.navigate(['machine/room/' + data['data']]);
                } else {
                    this.$message.create('error', data['msg']);
                }
            });
        } else {
            this.isLoading = true;
            let body = new FormData();
            body.append('roomId', this.roomId);
            body.append('roomName', this.roomName.replace(/(^\s*)|(\s*$)/g, ""));
            body.append('pic', this.file);
            this.http.post(`/itom/rooms/updateRoom`, body, {headers: new HttpHeaders().set('Accept', 'multipart/form-data;text/plain, */*')}).subscribe(data => {
                if (data['code'] === 0) {
                    this.onVoted.emit([false,true]);
                    this.isLoading = false;
                    this.file =null;
                }
            })
        }

    }

    nzOnCancel() {
        this.roomUpload = null;
        this.isVisible = false;
        this.roomId = null;
        this.roomName = '';
        this.file = null;
    }

    /**
     * 机房名称的校验
     */
    validate(e) {
        // 去空格
        e = e.replace(/(^\s*)|(\s*$)/g, "");
        let length = e.replace(/[\u4e00-\u9fa5]/g,"aa").length;
        if (length > 32 || length < 0) {
            this.roomValidate = true;
            this.roomValidateMsg = '机房名称不能超过32个字符'
        }else if(length ==0 ){
            this.roomValidate = true;
            this.roomValidateMsg = '请输入机房名称'
        }
        else {
            this.roomValidate = false;
        }
    }
}
