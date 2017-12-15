/**
 * Created by WH1709055 on  2017/11/11 15:49
 */

import { Component, OnInit, NgModule, Input } from '@angular/core'

@NgModule({
    imports:      [],
    declarations: [ CustomTreeComponent ],
    bootstrap:    [ CustomTreeComponent ]
})

@Component({
    selector: 'app-custom-tree',
    templateUrl: './custom-tree.component.html',
    styleUrls: ['./custom-tree.component.scss']
})

export class CustomTreeComponent implements OnInit {
    @Input() allData;
    @Input() data;
    constructor() {

    }
    ngOnInit() {

    }

    public toggle(item) {
        item.toggle = !item.toggle;
    }

    /**
     * 点击选择框
     * @param param
     * @param data
     */
    public checkItem(param) {
        if (param.checked === 0) {
            this.sureChildCheck(param);
            this.changeParentCheck(param.parent, this.allData);
        } else {
            this.cancelChildCheck(param);
            this.changeParentCheck(param.parent, this.allData);
        }
    }

    /**
     * 选中 添加子级选中状态
     * @param param
     */
    private sureChildCheck(param) {
        param.checked = 2;
        if (param.children) {
            param.children.forEach(item => {
                param.checked = 2;
                this.sureChildCheck(item);
            })
        }
    }

    /**
     * 去选 移除子级选中状态
     * @param param
     */
    private cancelChildCheck(param) {
        param.checked = 0;
        if (param.children) {
            param.children.forEach(item => {
                param.checked = 0;
                this.cancelChildCheck(item);
            })
        }
    }

    /**
     * 向上递归 动态改变父级checked状态
     * @param parentId
     * @param data
     */
    private changeParentCheck(parentId, data) {
        let _parentId: string = '0';
        data.forEach(item => {
            // 遍历出目标父级 由子级列表选中状态改变目标父级状态
            if (item.id + '' === parentId + '') {
                let flag = [];
                item.children.forEach(child => {
                    flag.push(child.checked);
                });
                if (!flag.includes(2) && !flag.includes(1)) {
                    item.checked = 0;
                } else if (!flag.includes(0) && !flag.includes(1)) {
                    item.checked = 2;
                } else {
                    item.checked = 1;
                }
                _parentId = item.parent;
                return false;
            } else {
                // 若该层级未找到目标父级   则继续向下遍历
                this.changeParentCheck(parentId, item.children);
            }
        });
        // 若目标父级存在更上一级的父级  则继续向上递归
        if (_parentId !== '0') {
            this.changeParentCheck(_parentId, this.allData);
        }
    }
}

