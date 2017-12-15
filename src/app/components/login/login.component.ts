import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { MissionService } from '../../mission-store/mission.service'
import { NzMessageService } from 'ng-zorro-antd'
import { User, Utils } from '../../models'
import { LoginService } from './login.service'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [ LoginService, NzMessageService ]
})
export class LoginComponent implements OnInit {
    imageKey = Utils.getUUID();
    usercode: string = '';
    password: string = '';
    checkCode: string = '';
    errorMsg: string = '';
    isLoading: boolean = false;
    image: string = `/itom/getImageCode/${ this.imageKey }?time=${ Utils.getUUID() }`;
    constructor(
        private $mission: MissionService,
        private $service: LoginService,
        private $router: Router,
        private $message: NzMessageService
    ) {
        $mission.commitLoginStatusChange(null);
    }

    ngOnInit() {
    }

    /**
     * 切换验证码
     */
    public changeImageCode() {
        this.image = `/itom/getImageCode/${ this.imageKey }?time=${ Utils.getUUID() }`;
    }

    /**
     * 登录方法
     */
    login() {
        if (!this.isLoading) {
            this.isLoading = true;
            setTimeout(() => {
                this.validate(this.usercode, this.password).then(() => {
                    this.$service.login(this.usercode, this.password, this.checkCode, this.imageKey).then((result: User) => {
                        this.isLoading = false;
                        this.$mission.commitLoginStatusChange(result);
                        sessionStorage.setItem('__currentUser', JSON.stringify(result));
                        this.$router.navigate(['/index']);
                    }, failed => {
                        this.isLoading = false;
                        this.errorMsg = failed;
                    });
                }, () => {
                    this.isLoading = false;
                });
            }, 100);
        }
    }

    /**
     * 验证用户名/密码
     * @param {string} username
     * @param {string} password
     * @param {string} yzm
     * @returns {Promise<any>}
     */
    private validate(username: string, password: string, yzm: string = '') {
        this.errorMsg = '';
        return new Promise((resolve, reject) => {
            if (username) {
                if (password) {
                    resolve();
                } else {
                    this.errorMsg = '请输入密码！';
                    reject();
                }
            } else {
                this.errorMsg = '请输入用户名！';
                reject();
            }
            // if (username) {
            //     if (username.length < 6 || username.length > 32) {
            //         this.errorMsg = '名称长度6-32个字符';
            //         reject();
            //     } else {
            //         let regexp = new RegExp("^[a-zA-Z0-9_\\-\u4e00-\u9fa5\\\"\"]+$");
            //         if (!regexp.test(username)) {
            //             this.errorMsg = '名称只能由中文、字母、数字、”-”、”_”或空格组成';
            //             reject();
            //         } else {
            //             if (password) {
            //                 if (password.length < 6 || password.length > 32) {
            //                     this.errorMsg = '密码长度6-32个字符';
            //                     reject();
            //                 } else {
            //                     let regexp = new RegExp("^[a-zA-Z0-9]+$");
            //                     if (!regexp.test(password)) {
            //                         this.errorMsg = "密码只能由字母、数字组成！";
            //                         reject();
            //                     } else {
            //                         resolve();
            //                     }
            //                 }
            //             } else {
            //                 this.errorMsg = '请输入密码！';
            //                 reject();
            //             }
            //         }
            //     }
            // } else {
            //     this.errorMsg = '请输入用户名！';
            //     reject();
            // }
        });
    }
}

class ValidateResult {
    private _isOk: boolean;
    private _msg: string;

    constructor() {
        this.isOk = false;
    }

    set isOk(flag: boolean) {
        this._isOk = flag;
    }
    get isOk(): boolean {
        return this._isOk;
    }

    set msg(msg: string) {
        this._msg = msg;
    }
    get msg(): string {
        return this._msg;
    }
}
