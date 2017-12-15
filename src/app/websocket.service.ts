import { Injectable } from '@angular/core'
import * as Stomp from 'stompjs';
@Injectable()
export class WebSocketService {
    private socket = new window['SockJS']('/itom/itomEndpointWisely'); // 链接SockJS 的
    public stompClient =Stomp.over(this.socket);
    constructor() {

    }

}
