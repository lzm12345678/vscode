/**
 * Created by WH1709055 on  2017/11/08 17:42
 */

import { Pipe, PipeTransform } from '@angular/core';

const ROLES = {
    A: '基本角色',
    B: '管理员',
    C: '监控员',
    D: '资产管理'
};

@Pipe({
    name: 'userName'
})
export class UserNamePipe implements PipeTransform {

    transform(value: number, args?: any): string {
        let str = '';
        args.forEach(item => {
            if (item.userId === value) {
                str = item.userName;
                return false;
            }
        });
        return str;
    }

}


