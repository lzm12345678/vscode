
export class Unit {
    public alarmLevel: number;
    public bandIp: string;
    public bladeServerId: string;
    public cabinetId: string;
    public cabinetName: string;
    public computerRoomId: string;
    public computerRoomName: string;
    public model: string;
    public protocolList: Protocol[]; // 协议列表 1:(SNMP );2:(IPMI);3:(REDFISH);4:(带内)',
    public remarks: string;
    public serverCode: string;
    public serverFirstUserName: string;
    public serverFirstuser: string;
    public serverId: string;
    public serverIp: number;
    public serverModel: string;
    public serverName: string;
    public serverProject: string;
    public serverSecondUserName: string;
    public serverSeconduser: string;
    public shelvesId: string;
    public slotNum: number;
    public standard: string;
    public startU: number;
    public uName: string;
    public checked: boolean;

    constructor() {
        this.checked = false;

        this.computerRoomId = '';
        this.cabinetId = '';
        this.startU = 0;
        this.remarks = '';
        let p1 = new Protocol();
        p1.snmpType = 2;
        p1.protocolType = 1;
        p1.port = 161;
        p1.retryCount = 3;
        p1.retryTime = 5;
        p1.authenticationProtocol = 1;
        p1.dataEncryption = 1;
        p1.trapGroupWord = 'public';
        p1.confirmTrapGroupWord = 'public';
        let p2 = new Protocol();
        p2.protocolType = 2;
        p2.trapGroupWord = 'public';
        p2.confirmTrapGroupWord = 'public';
        let p3 = new Protocol();
        p3.protocolType = 3;
        let p4 = new Protocol();
        p4.protocolType = 4;
        p4.port = 161;
        p4.retryCount = 3;
        p4.retryTime = 5;
        p4.authenticationProtocol = 1;
        p4.dataEncryption = 1;
        p4.trapGroupWord = 'public';
        p4.confirmTrapGroupWord = 'public';
        this.protocolList = [p1, p2, p3, p4];
    }
}

class Protocol {
    public id: number;
    public protocolType: number; // 类型          1:(SNMP );2:(IPMI);3:(REDFISH);4:(带内)',
    public snmpType: number; // SNMP类型 1:(V2C);2:(V3);
    public port: number; // 端口(1-65535）
    public trapGroupWord: string; // Trap团体字
    public userName: string; // 用户名
    public authenticationPassword: string; // 认证密码
    public authenticationProtocol: number; // 认证协议（1:HMACSHA;2:HMACMD5）
    public dataEncryption: number; // 数据加密协议(1:AES;2:DES)
    public dataEncryptioncipher: string; // 数据加密密码
    public password: string; // 密码
    public retryTime: number; // 重试时间
    public retryCount: number; // 重试次数
    public readGroupWord: string; // 读团队字
    public writeGroupWord: string; // 写团体字
    public confirmTrapGroupWord: string; // 确认Trap团体字

    constructor() {
    }
}
