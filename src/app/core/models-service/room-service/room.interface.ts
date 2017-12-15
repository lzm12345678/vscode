/**
 * Created by GyjLoveLh on  2017/12/14
 */
import { Result, EntitiesResult } from "../Result"
import { Room } from "./room.model"

export interface RoomInterface {

    getRooms(): Promise<Result<Room[]>>;

    // insertRoom(room: Room): Promise<Result<any>>;

    // deleteRoom(roomId: string): Promise<Result<any>>;


}

