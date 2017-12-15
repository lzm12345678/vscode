import {Brand} from "./brand";

export class Series {
    public modelId: string;
    public modelName: string;
    public modelLevel: number;
    public modelType: string;
    public description: string;
    public parentModel: Brand;
    public parentId: number;

    constructor() {
        this.parentModel = new Brand();
    }
}
