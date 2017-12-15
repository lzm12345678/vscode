export class Password {
    private _oldPwd: string;
    private _newPwd: string;
    private _rePwd: string;

    constructor() {}

    set oldPwd(pwd) {
        this._oldPwd = pwd;
    }
    get oldPwd(): string {
        return this._oldPwd;
    }

    set newPwd(pwd) {
        this._newPwd = pwd;
    }
    get newPwd(): string {
        return this._newPwd;
    }

    set rePwd(pwd) {
        this._rePwd = pwd;
    }
    get rePwd(): string {
        return this._rePwd;
    }
}
