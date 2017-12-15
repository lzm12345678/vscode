/**
 * Created by GyjLoveLh on  2017/12/14
 */
export class Room {
    roomId: string;
    /**
     * 机房名称
     */
    roomName: string;
    /**
     * 机房容量---机房最大机柜数量
     */
    oomMaxCabinet: number;
    /**
     * 机房长度
     */
    roomLength: number;
    /**
     * 机房宽度
     */
    roomWith: number;

    /**
     * 机房背景图
     */
    roomImage: string;
    /**
     * 机房备注
     */
    roomRemark: string;
}
