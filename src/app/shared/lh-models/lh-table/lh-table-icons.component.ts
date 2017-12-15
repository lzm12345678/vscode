/**
 * Created by GyjLoveLh on  2017/12/6
 */
import { Component, Input, OnInit } from '@angular/core'

@Component({
    selector: 'lh-table-icon',
    template: `
        <div [title]="currentIcon.title">
                <i class="anticon alarm-icon anticon-info-circle" [ngClass]="currentIcon.iconClass"></i>
        </div>
       
    `,
    styles: [
        `.error, .primary .success .warning {
                //去掉图片样式
                //font-size: 14px;
            }
            .error {
                //color: #ff2812;
                color: #ff0000;
            }
            .primary {
                //color: #f79700;
                color: #ff9900;
            }
            .success {
                //color: #ffd800;
                color: #ffff00;
            }
            .warning {
                //color: #04aef5;
                color: #00ccff;
            }
            .normal {
                //color: #4ac233;
                color: #2bd544;
            }`
    ]
})

export class LhTableIconsComponent implements OnInit {
    @Input() value: any;
    @Input() icons;

    currentIcon;
    constructor() {

    }
    ngOnInit() {
        let _icon = this.icons.filter(item => item.value === this.value);
        if (_icon.length > 0) {
            this.currentIcon = _icon[0];
        } else {
            this.currentIcon = this.icons.filter(item => !item.value)[0];
        }

    }
}

