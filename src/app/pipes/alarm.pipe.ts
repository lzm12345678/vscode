import { Pipe, PipeTransform } from '@angular/core';

const ALARM = {
    A: '严重',
    B: '警告',
    C: '一般',
    D: '良好',
    E: '正常'
};

@Pipe({
    name: 'alarm'
})
export class AlarmPipe implements PipeTransform {

    transform(value: number, args?: any): any {
        return value === 1 ? ALARM.A :
            value === 2 ? ALARM.B :
                value === 3 ? ALARM.C :
                    value === 4 ? ALARM.D : ALARM.E;
    }

}
