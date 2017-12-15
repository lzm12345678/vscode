import { Cabinet } from "./Cabinet";

export class Room {
    private _id: string;
    private _name: string;
    private _isOpen: boolean = false;
    private _cabinets: Cabinet[] = [];
    constructor() {}

    public addCabinet(item: Cabinet): Cabinet[] {
        this._cabinets.push(item);
        return this._cabinets;
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
    set isOpen(isOpen: boolean) {
        this._isOpen = isOpen;
    }
    get isOpen(): boolean {
        return this._isOpen;
    }
    get cabinets(): Cabinet[] {
        return this._cabinets;
    }
}
