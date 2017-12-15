/**
 * Created by WH1709055 on  2017/11/24 20:28
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'password'
})
export class PasswordPipe implements PipeTransform {

    transform(value, args?: any): string {
        let str = '';
        if (value) {
            let _num = value.length;
            for (let i = 0; i < _num; i++) {
                str += '•';
            }
        }
        return str;
    }

}




