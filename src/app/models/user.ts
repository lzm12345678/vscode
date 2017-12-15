
import { Role } from './role';

export class User {
    public userId: string;
    public userName: string;
    public userStatus: string;
    public userCode: number;
    public phonenumber: number;
    public email: string;
    public role: Role;
    public roleId: string;
    public checked: boolean = false;
    public password: string;
    public passwordValidity: string;
    // private _lastLogin: Date;
    constructor() {
        this.checked = false;
        this.role = new Role();
        this.userStatus = '1';
    }
}
