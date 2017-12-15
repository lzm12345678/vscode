import { Pipe, PipeTransform } from '@angular/core';

const STATE = {
    A: '停用',
    B: '启用'
}

@Pipe({
  name: 'userState'
})
export class UserStatePipe implements PipeTransform {

    transform(value: string, reverse: string): string {
        if (reverse === 'reverse') {
            return value + '' === '0' ? STATE.B : STATE.A;
        }
        return value + '' === '0' ? STATE.A : STATE.B;
    }

}
