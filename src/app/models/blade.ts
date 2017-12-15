
export class Blade {
    public alarmLevel: string; // 告警级别
    public alarmNum: string; // 告警次数
    public biosFirmVersion: string; //
    public biosSoftVersion: string; //
    public bladeServerCode: string; // 刀片服务器编码
    public bladeServerId: string; // 刀片服务器id
    public bladeServerModelId: number; // 型号id
    public bladeServerModelName: number; // 型号名称
    public bladeServerName: number; // 刀片服务器名称
    public serverProject: string; // 所属项目
    public bladeServerProject: string; // 第一责任人用户id
    public bladeServerSerialNum: string; // 第二责任人id
    public serverMaxdisknumbe: string; // 最大磁盘托架数
    public bladeServerStatus: string; //
    public bmcSoftVersion: string; //
    public cabinetName: string; // 机柜名称
    public cabinetId: string; // 机柜id
    public computerRoomName: string; // 机房名称
    public computerRoomId: string; // 机房名称
    public firstPrincipalId: string; // 第一责任人Id
    public firstPrincipalName: string; // 第一责任人Id
    public manageIp: string; // 管理Ip
    public maxDiskTray: string; //
    public protocolList: Protocol[]; // 协议列表 1:(SNMP );2:(IPMI);3:(REDFISH);4:(带内)',
    public remarks: string; // 服务器上架ID
    public secondPrincipalId: string; // 第二责任人Id
    public secondPrincipalName: string; // 第二责任人名称
    public standard: number; //
    public startU: string; // 起始U位
    public units: Unit[]; // 单元列表
    public checked: boolean;
    constructor() {
        this.checked = false;
        this.computerRoomId = '';
        this.bladeServerId = '';
        this.startU = '0';
        let p1 = new Protocol();
        p1.snmpType = 2;
        p1.port = 161;
        p1.retryCount = 3;
        p1.retryTime = 5;
        p1.authenticationProtocol = 1;
        p1.dataEncryption = 1;
        p1.trapGroupWord = 'public';
        p1.confirmTrapGroupWord = 'public';
        p1.protocolType = 1;
        let p2 = new Protocol();
        p2.trapGroupWord = 'public';
        p2.confirmTrapGroupWord = 'public';
        p2.protocolType = 2;
        p2.snmpType = null;
        let p3 = new Protocol();
        p3.protocolType = 3;
        p3.snmpType = null;
        this.protocolList = [p1, p2, p3];
        this.units = [];
        this.remarks = '';
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
class Unit {
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
    public startU: string;
    public uName: string;
    public checked: boolean;

    constructor() {
        this.checked = false;
    }
}
