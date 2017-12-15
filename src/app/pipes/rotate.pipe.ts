import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rotate'
})
export class RotatePipe implements PipeTransform {

    transform(rotate: {x: number, y: number, z: number}, args?: any): string {
        return `
            rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg)
        `;
    }

}
