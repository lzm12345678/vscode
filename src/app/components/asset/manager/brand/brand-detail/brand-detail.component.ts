
import {Component, OnInit} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'
import {BrandDetailService} from "./brand-detail.service";
import {Brand} from "../../../../../models";
import {NzMessageService} from "_ng-zorro-antd@0.5.5@ng-zorro-antd";
import {Result} from "../../../../../models/result";

@Component({
    selector: 'app-version-detail',
    templateUrl: './brand-detail.component.html',
    styleUrls: ['./brand-detail.component.scss'],
    providers: [BrandDetailService]
})

export class BrandDetailComponent implements OnInit {
    brand: Brand = new Brand();
    column = [];

    isLoading: boolean = false;

    constructor(private $active: ActivatedRoute,
                public $router: Router,
                private $service: BrandDetailService,
                private $message: NzMessageService) {
    }

    ngOnInit() {

        this.initColumn();
    }

    /**
     * 提交表单
     */
    public saveBrand() {

    }

    /**
     * 验证型号填写是否正确
     * @param column
     * @param data
     * @returns {Promise<any>}
     */
    private validateColumn(column, data) {

    }

    /**
     * 校验型号名称
     * @returns {Promise<any>}
     */
    private validateModelName() {

    }

    /**
     * 初始化表单数据
     */
    private initColumn() {
        this.column = [
            {label: '品牌名称', key: 'name', type: 'input', require: true },
            {label: '描述', key: 'description', type: 'textarea', rules: [ { max: 50 } ] }
        ];
    }
}
