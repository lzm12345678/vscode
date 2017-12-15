import { Servicer } from "./Servicer";

export class Cabinet {
    private _id: string;
    private _name: string;
    private _isOpen: boolean = false;
    private _servicers: Servicer[] = [];
    constructor() {}

    public addServicer(servicer: Servicer): Servicer[] {
        this._servicers.push(servicer);
        return this._servicers;
    }

    set id(id: string) {
        this._id = id;
    }
    get id(): string {
        return this._id;
    }
    set name(name: string) {
        this._name = name;
    }
    get name(): string {
        return this._name;
    }
    set isOpen(flag: boolean) {
        this._isOpen = flag;
    }
    get isOpen(): boolean {
        return this._isOpen;
    }

    get servicers(): Servicer[] {
        return this._servicers;
    }
}
