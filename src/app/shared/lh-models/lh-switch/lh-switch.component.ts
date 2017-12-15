import { Component, OnInit, Input, NgModule } from '@angular/core'

@Component({
    selector: 'lh-switch',
    templateUrl: './lh-switch.component.html',
    styleUrls: [ './lh-switch.component.scss' ]
})

export class LhSwitchComponent implements OnInit {
    @Input() value = false;
    @Input() disabled: boolean = false;
    @Input() onChange: Function;
    @Input() openContent: string = '';
    @Input() closeContent: string = '';
    @Input() trueValue: any = true;
    @Input() falseValue: any = false;

    _value: boolean = false;
    _loading: boolean = false;
    constructor() {}
    ngOnInit() {
        this._value = this.value === this.trueValue;
    }

    public change() {
        if (!this.disabled) {
            if (!this._loading) {
                this._loading = true;
                this.onChange(!this._value ? this.trueValue : this.falseValue).then(() => {
                    this._value = !this._value;
                    this._loading = false;
                });
            }
        }
    }
}
