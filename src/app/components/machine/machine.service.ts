import { Injectable } from '@angular/core';
import { Room, Cabinet, Servicer } from '../../models/index'

function createRoom() {
    let room = new Room();
    room.id = 'id_' + getRandom();
    room.name = '机房_' + getRandom();
    for (let i = 0; i < 5; i++) {
        let cabinet = new Cabinet();
        cabinet.id = 'id_' + getRandom();
        cabinet.name = '机柜_' + getRandom();
        for (let i = 0; i < 6; i++) {
            let servicer = new Servicer();
            servicer.id = 'id_' + getRandom();
            servicer.name = '服务器_' + getRandom();
            cabinet.addServicer(servicer);
        }
        room.addCabinet(cabinet);
    }
    return room;
}


function getRandom() {
    let color = '';
    for (let i = 0; i < 6; i++) {
        color += '0123456789abcdef'[Math.floor(Math.random() * 16)];
    }
    return '#' + color;
}

@Injectable()
export class MachineService {

    constructor() { }

    public getMachines(): Room {
        return createRoom();
    }
}
