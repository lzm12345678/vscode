export class Servicer {
    private _id: string;
    private _name: string;
    private _children: ServerType[] = [];
    constructor() {}

    public addChildren(type: ServerType): ServerType[] {
        this._children.push(type);
        return this._children;
    }
    set id(id: string) {
        this._id = id;
    }
    get id():string {
        return this._id;
    }
    set name(name: string) {
        this._name = name;
    }
    get name(): string {
        return this._name;
    }

    get children(): ServerType[] {
        return this._children;
    }
}

export class ServerType {
    private _id: string;
    private _name: string;
    private _hasChildType: boolean = false;
    private _children: ServerType[] = [];
    private _image: string;

    public addChildren(item: ServerType) {
        this._children.push(item);
        return this._children;
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
    set hasChildType(flag: boolean) {
        this._hasChildType = flag;
    }
    get hasChildType(): boolean {
        return this._hasChildType;
    }

    set image(image: string) {
        this._image = image;
    }
    get image(): string {
        return this._image;
    }

    get children(): ServerType[] {
        return this._children;
    }
}
