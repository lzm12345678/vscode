import { Pipe, PipeTransform } from '@angular/core';

const ROLES = {
    A: '基本角色',
    B: '管理员',
    C: '监控员',
    D: '资产管理'
};

@Pipe({
  name: 'userRole'
})
export class UserRolePipe implements PipeTransform {

    transform(value: number, args?: any): string {
        return value === 1 ? ROLES.A :
            value === 2 ? ROLES.B :
            value === 3 ? ROLES.C : ROLES.D;
    }

}
