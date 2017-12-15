export class Facility {
    private _id: string;
    private _name: string; // 资产名称
    private _no: string; // 资产编号
    private _ams: string; // AMS资产卡片号
    private _assetType: string; // 资产分类
    private _seariz: string; // 序列号

    constructor() {
        this._id = '--';
        this._name = '--';
        this._no = '--';
        this._ams = '--';
        this._assetType = '--';
        this._seariz = '--';
    }
}
