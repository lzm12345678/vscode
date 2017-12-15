export class Asset {
    private _id: string;
    private _name: string;
    private _number: string;
    private _model: string;
    private _room: string;
    private _belong: string;
    private _duty: string;
    private _position: string;
    private _state: number;
    private _alarm: number;
    private _checked: boolean = false;

    constructor() {  }

    set id(id: string) {
        this._id = id;
    }
    get id(): string {
        return this._id;
    }

    set name(param: string) {
        this._name = param;
    }
    get name(): string {
        return this._name;
    }

    set number(param: string) {
        this._number = param;
    }
    get number(): string {
        return this._number;
    }

    set model(param: string) {
        this._model = param;
    }
    get model(): string {
        return this._model;
    }

    set room(param: string) {
        this._room = param;
    }
    get room(): string {
        return this._room;
    }

    set belong(param: string) {
        this._belong = param;
    }
    get belong(): string {
        return this._belong;
    }

    set duty(param: string) {
        this._duty = param;
    }
    get duty(): string {
        return this._duty;
    }

    set position(param: string) {
        this._position = param;
    }
    get position(): string {
        return this._position;
    }

    set state(param: number) {
        this._state = param;
    }
    get state(): number {
        return this._state;
    }

    set alarm(param: number) {
        this._alarm = param;
    }
    get alarm(): number {
        return this._alarm;
    }

    set checked(param: boolean) {
        this._checked = param;
    }
    get checked(): boolean {
        return this._checked;
    }
}
