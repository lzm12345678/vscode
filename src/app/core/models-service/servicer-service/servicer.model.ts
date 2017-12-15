/**
 * Created by GyjLoveLh on  2017/12/13
 */
import { ProtocolConfiguration } from "./protocolConfiguration.model"
export class Servicer {
    public serverId: string;
    public serverCode: string;
    public serverName: string;
    public serverIp: string;
    public serverModel: string;
    public serverProject: string;
    public serverFirstuser: string;
    public serverSeconduser: string;
    public remarks: string;
    public bandIp: string;

    public model: string;

    public computerRoomName: string;
    public cabinetName: string;
    public uName: string;

    public shelvesId: string;
    public computerRoomId: string;
    public cabinetId: string;
    public startU: number;

    public standard: number;

    public bladeServerId: string;
    protocolList: ProtocolConfiguration[];
    public alarmLevel: string;
    public slotNum: number;

    public serverFirstUserName: string;
    public serverSecondUserName: string;

    public urgentLevel: number;
    public importantLevel: number;
    public secondaryLevel: number;
    public promptLevel: number;
    public serialNum: number;

    constructor() { }
}
