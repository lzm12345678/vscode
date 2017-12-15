/**
 * Created by GyjLoveLh on  2017/12/13
 */
export class ProtocolConfiguration {
    id: string;
    serverId: string;
    serverIp: string;
    protocolType: number;
    snmpType: number;
    port: number;
    trapGroupWord: string;
    userName: string;
    authenticationPassword: string;
    authenticationProtocol: number;
    dataEncryption: number;
    dataEncryptioncipher: string;
    password: string;
    retryTime: number;
    retryCount: number;
    readGroupWord: number;
    writeGroupWord: number;
    confirmTrapGroupWord: number;
    constructor() { }
}
