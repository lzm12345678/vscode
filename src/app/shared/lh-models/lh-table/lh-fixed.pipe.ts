/**
 * Created by GyjLoveLh on  2017/12/7
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'lhFixed' })
export class LhFixedPipe implements PipeTransform {
    transform(value: boolean, exponent: boolean): boolean {
        return exponent ? !value : value;
    }
}
