import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'bserverModel'
})
export class BserverModelPipe implements PipeTransform {

    transform(value, args?: any): string {
        let str = '';
        args.forEach(item => {
            console.log(item);
            if (item.id === value) {
                str = item.modelName;
                return false;
            }
        });
        return str;
    }

}
