/**
 * Created by WH1709055 on  2017/11/17 14:16
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'commonSelect'
})
export class CommonSelectPipe implements PipeTransform {
    // 通用select管道
    transform(value, params?: any): string {
        if (params.data) {
            for (let item of params.data) {
                if (item[params.value || 'id'] + '' === value + '') {
                    return item[params.label || 'name'];
                }
            }
        }
    }
}



