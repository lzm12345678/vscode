/**
 * Created by GyjLoveLh on  2017/12/6
 */
import {
    Component,
    ViewEncapsulation,
    Input,
    OnDestroy,
    OnInit
} from '@angular/core';

import { LhSelectComponent } from './lh-select.component';

@Component({
    selector     : 'nz-option',
    encapsulation: ViewEncapsulation.None,
    template     : `
    <ng-content></ng-content>
  `,
    styleUrls    : []
})
export class NzOptionComponent {
    private _disabled = false;

    _value: string;
    _label: string;

    @Input()
    set nzValue(value: string) {
        if (this._value === value) {
            return;
        }
        this._value = value;
    }

    get nzValue(): string {
        return this._value;
    }

    @Input()
    set nzLabel(value: string) {
        if (this._label === value) {
            return;
        }
        this._label = value;
    }

    get nzLabel(): string {
        return this._label;
    }

    @Input()
    set nzDisabled(value: boolean) {
        // this._disabled = toBoolean(value);
    }

    get nzDisabled(): boolean {
        return this._disabled;
    }

    constructor(private _nzSelect: LhSelectComponent) {
    }

    // ngOnInit(): void {
    //     this._nzSelect.addOption(this);
    // }
    //
    // ngOnDestroy() {
    //     this._nzSelect.removeOption(this);
    // }
}
