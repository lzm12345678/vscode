/**
 * Created by WH1709055 on  2017/11/13 20:51
 */

import { Component, OnInit, NgModule, Input, AfterContentChecked } from '@angular/core'
import { Utils } from "../../../models"
const ERROR_MSG = {
    require: '此项为必填项',
    max(len) {
        return `长度不超过${len}个字符`;
    },
    min(len) {
        return `长度至少为${len}个字符`
    }
};
const DEFAULT_MAX_LENGTH = 32;


@NgModule({
    imports:      [],
    declarations: [ CustomFormComponent ],
    bootstrap:    [ CustomFormComponent ]
})

@Component({
    selector: 'app-custom-form',
    templateUrl: './custom-form.component.html',
    styleUrls: ['./custom-form.component.scss']
})

export class CustomFormComponent implements OnInit, AfterContentChecked {
    @Input() column;
    @Input() data;
    @Input() span: number;
    @Input() isDetail: boolean = false;
    @Input() titleWidth: number = 10;
    constructor() {

    }
    ngAfterContentChecked() {
        let $component = this;
        this.column.forEach(item => {
            if (!item.trigger) {
                item.trigger = 'blur';
            }
            if (!item.isError) {
                item.isError = false;
            }
            if (!item.msg) {
                item.msg = '';
            }
            if (item.trigger === 'blur') {
                item.blur = (value, $this) => {
                    if (typeof value === 'string') {
                        value = value.replace(/\s/g, '');
                        $component.data[item.key] = value;
                    }
                    return $component.validateRule(value, item);
                }
            }
            if (item.trigger === 'change') {
                item.change = (value, $this) => {
                    if (typeof value === 'string') {
                        value = value.replace(/\s/g, '');
                        $component.data[item.key] = value;
                    }
                    $component.validateRule(value, item);
                }
            }
            if (!item.change) {
                item.change = (value, $this) => {
                    if (typeof value === 'string') {
                        value = value.replace(/\s/g, '');
                        $component.data[item.key] = value;
                    }
                    // $component.validateRule(value, item);
                }
            }
            if (item.type === 'select') {
                item.change = (value, $this) => {
                    $component.validateRule(value, item);
                    item.selectInfo.changeHook(value, $this);
                }
            }
            if (item.type === 'textarea') {
                item._change = (value, $this) => {
                    $component.validateRule(value, item);
                }
            }
        });
    }
    ngOnInit() {

    }
    change() {
    }
    blur() {
    }
    focus() {
    }

    /**
     * 校验
     * @param value
     * @param item
     */
    private validateRule(value, item) {
        item.isError = false;
        if (item.rules) {
            for (let rule of item.rules) {
                if (rule.require && !value) {
                    item.isError = true;
                    item.msg = rule.msg || ERROR_MSG.require;
                    break;
                }
                if (!rule.require && !value) {
                    break;
                }
                if (rule.min && Utils.getRealLength(value) < rule.min) {
                    item.isError = true;
                    item.msg = rule.msg || ERROR_MSG.min(rule.min);
                    break;
                }
                if (!rule.max && Utils.getRealLength(value) > DEFAULT_MAX_LENGTH) {
                    item.isError = true;
                    item.msg = rule.msg || ERROR_MSG.max(DEFAULT_MAX_LENGTH);
                    break;
                }
                if (rule.max && Utils.getRealLength(value) > rule.max) {
                    item.isError = true;
                    item.msg = rule.msg || ERROR_MSG.max(rule.max);
                    break;
                }
                if (rule.regex) {
                    let regex = new RegExp(rule.regex, 'g');
                    if (!regex.test(value)) {
                        item.isError = true;
                        item.msg = rule.msg;
                        break;
                    }
                }
                if (rule.event) {
                    rule.event(value).then(success => {

                    }, failed => {
                        item.isError = true;
                        item.msg = failed || rule.msg;
                    });
                }
            }
        } else {
            if (Utils.getRealLength(value) > DEFAULT_MAX_LENGTH) {
                item.isError = true;
                item.msg = ERROR_MSG.max(DEFAULT_MAX_LENGTH);
            }
        }
    }

}


