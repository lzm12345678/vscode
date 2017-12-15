/**
 * Created by GyjLoveLh on  2017/12/12
 */
import { Component, OnInit, Input, Output, EventEmitter, AfterContentChecked } from '@angular/core'
import { FormGroup, Validators, FormControl } from '@angular/forms'

@Component({
    selector: 'lh-form',
    templateUrl: './lh-form.component.html',
    styleUrls: [ './lh-form.component.scss' ]
})

export class LhFormComponent implements OnInit, AfterContentChecked {
    @Input() column;
    @Input() data;
    @Output() formChange = new EventEmitter();
    _rules: FormGroup = new FormGroup({});
    _cloneData; // 重置对象副本
    constructor() { }
    ngOnInit() {

    }
    ngAfterContentChecked() {
        this._cloneData = Object.assign({}, this.data);
        this.column.forEach(item => {
            item.col = item.col || 4;
            item._modelChange = (controls, event, key) => {
                if (controls[key].value !== event) {
                    if (item.modelChange) {
                        item.modelChange(controls, event, controls[key]);
                    }
                    this.formChange.emit({ key, value: event });
                }
            };
            this._rules.addControl(item.key,
                new FormControl(this.data[item.key], this.addRuleControl(item.rules), this.addAsyncControl(item.asyncRules)));
        });
    }

    /**
     * 重置
     */
    public reset() {
        this._rules.reset(this._cloneData);
    }
    /**
     * 同步校验controller
     * @param rules
     * @returns {Array}
     */
    private addRuleControl(rules) {
        let control = [];
        if (rules) {
            rules.forEach(rule => {
                let _keys = Object.keys(rule);
                if (_keys.includes('required')) {
                    rule.code = 'required';
                    rule.msg = rule.msg || '此项为必填项';
                    control.push(Validators.required);
                }
                if (_keys.includes('minLength')) {
                    rule.code = 'minlength';
                    rule.msg = rule.msg || `至少大于${rule.minLength}个字符`;
                    control.push(Validators.minLength(rule.minLength));
                }
                if (_keys.includes('maxLength')) {
                    rule.code = 'maxlength';
                    rule.msg = rule.msg || `至多小于${rule.maxLength}个字符`;
                    control.push(Validators.maxLength(rule.maxLength));
                }
                if (_keys.includes('min')) {
                    rule.code = 'min';
                    rule.msg = rule.msg || `不能小于${rule.min}`;
                    control.push(Validators.min(rule.min));
                }
                if (_keys.includes('max')) {
                    rule.code = 'max';
                    rule.msg = rule.msg || `不能小于${rule.max}`;
                    control.push(Validators.max(rule.max));
                }
                if (_keys.includes('email')) {
                    rule.code = 'email';
                    rule.msg = rule.msg || `邮箱格式有误`;
                    control.push(Validators.email);
                }
                if (_keys.includes('pattern')) {
                    rule.code = 'pattern';
                    rule.msg = rule.msg || '正则验证错误';
                    control.push(Validators.pattern(new RegExp(rule.pattern)));
                }
            });
        }
        return control;
    }

    /**
     * 异步检验controller
     * @param rules
     * @returns {Array}
     */
    private addAsyncControl(rules) {
        let control = [];
        if (rules) {
            rules.forEach(rule => {
                control.push(rule.asyncRule);
            });
        }
        return control;
    }
}

