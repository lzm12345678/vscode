/**
 * Created by GyjLoveLh on  2017/12/14
 */
import { RoomInterface } from "./room.interface";
import { Injectable, Inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { EntitiesResult, Result} from "../Result";
import { Room } from "./room.model"

@Injectable()
export class RoomService implements RoomInterface {
    private prefixUrl: string;
    constructor(
        private $http: HttpClient,
        @Inject('apiUrl') private apiUrl
    ) {
        this.prefixUrl = `${apiUrl}/rooms`;
    }

    /**
     * 查询所有机房
     * @returns {Promise<Result<Room[]>>}
     */
    getRooms(): Promise<Result<Room[]>> {
        return new Promise((resolve, reject) => {
            this.$http.get(`${this.prefixUrl}`).subscribe((result: Result<Room[]>) => {
                result.code === 0 ? resolve(result) : reject(result);
            });
        });
    }
}
