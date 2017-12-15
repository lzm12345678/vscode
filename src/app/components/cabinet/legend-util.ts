import {AmendUtil} from "./amend-util";
import {NzMessageService} from 'ng-zorro-antd';
import * as TYPES from './types';

export class LegendUtil {

    constructor(readonly Q: any,
                readonly graph: any,
                private $message: NzMessageService) {
        this.Q = Q;
        this.graph = graph;
    }

    /**
     * 绘制机柜背景
     * @param Q
     * @param graph
     * @param {number} LH
     * @param {number} LN
     */
    public drawCabinetBg(LH: number, LN: number): void {
        let node = this.graph.createNode('', 0, 0);
        node.set('type', TYPES.CABINET_BG);
        node.set('selected', 'unselected');
        if (LN === 32) {
            node.image = '../../../assets/image/32u-cabinet.png';
        } else if (LN === 42) {
            node.image = '../../../assets/image/cabinet.png';
        } else if (LN === 22) {
            node.image = '../../../assets/image/22u-cabinet.png';
        } else {

        }

        node.setStyle(this.Q.Styles.HEIGHT, 30);
        this.graph.graphModel.add(node);
        for (let i = 0; i <= LN; i++) {
            let line = this.graph.createShapeNode();
            line.setStyle(this.Q.Styles.SHAPE_STROKE_STYLE, '#999');
            line.setStyle(this.Q.Styles.SHAPE_LINE_DASH, [2, 2]);
            line.set('selected', 'unselected');
            line.set('type', TYPES.BG_LINE);
            line.moveTo(-100, -LH * LN / 2 + i * LH);
            line.lineTo(100, -LH * LN / 2 + i * LH);
        }
    }

    public drawCabinet(data) {
        data.forEach(item => {
            switch (item.type) {
                case TYPES.CABINET:
                    let node = new this.Q.Node();
                    node.set('type', TYPES.CABINET);
                    node.set('isBind', false);
                    node.set('serverId',item.serverId);
                    node.set('shelvesId',item.shelvesId);
                    node.set('standard',item.standard);
                    node.size = {
                        width: 200,
                        height: item.standard*17||parseInt(item.image.split('-')[2].split('.')[0]) * 17
                    };
                    node.x = item.x;
                    node.y = item.y;
                    node.image = item.image;
                    AmendUtil.setToolTip(node,item.serverName,item.serverCode);
                    this.graph.graphModel.add(node);
                    AmendUtil.createWarning(this.graph,node,item.alarmLevel);
                    break;
                case TYPES.GRIFF:
                    let griff = new this.Q.Node();
                    griff.set('type', TYPES.GRIFF);
                    griff.set('isBind', true);
                    griff.set('griff', item.griffData);
                    node.set('bserverId',item.bserverId);
                    node.set('bsshelvesId',item.bsshelvesId);
                    node.set('standard',item.standard);
                    griff.size = {
                        width: 200,
                        height: parseInt(item.image.split('-')[2].split('.')[0]) * 17
                    };
                    griff.x = item.x;
                    griff.y = item.y;
                    griff.image = item.image;
                    this.graph.graphModel.add(griff);
                    this.drawGriffSlot(griff, item.griffData);
                    break;
                case TYPES.SERVER:
                    break;
                default:
                    break;
            }
        });
    }

    /**
     * 绘制刀箱
     * @param griffData
     */
    public drawGriff(image, ev, serverId, standard,griffData, LH: number = 17) {
        let griff = new this.Q.Node();
        let p = this.graph.globalToLocal(ev);
        let l = this.graph.toLogical(p.x, p.y);
        griff.set('type', TYPES.GRIFF);
        griff.set('griff', griffData);
        griff.set('serverId',serverId);
        griff.set('standard',standard);
        griff.size = {
            width: 200,
            height: parseInt(image.split('-')[2].split('.')[0]) * LH
        };
        griff.x = 0;
        griff.y = AmendUtil.amendCoordinate(l.y, griff.size.height, LH, 42);
        griff.image = image;
        if (!AmendUtil.verifyOverlay(griff)) {
            this.graph.graphModel.add(griff);
            this.drawGriffSlot(griff, griffData);
        } else {
            this.$message.error('该位置已有设备~');
        }
    }

    /**
     * 绘制普通设备节点
     * @param {string} image
     * @param ev
     * @param {number} LH
     */
    public drawNode(image: string, ev, serverId, standard, LH: number = 17, callback = null) {
        if (typeof callback === 'function') {
            let node = new this.Q.Node();
            let p = this.graph.globalToLocal(ev);
            let l = this.graph.toLogical(p.x, p.y);
            node.set('type', TYPES.CABINET);
            node.set('serverId',serverId);
            node.set('standard',standard);
            node.size = {
                width: 200,
                height: parseInt(image.split('-')[2].split('.')[0]) * LH
            };
            node.x = 0;
            node.y = AmendUtil.amendCoordinate(l.y, node.size.height, LH, 42);
            node.image = image;
            if (!AmendUtil.verifyOverlay(node)) {
                this.graph.graphModel.add(node);
            } else {
                this.$message.error('该位置已有设备');
            }
            callback(node);
        } else {
            return new Promise((resolve, reject) => {
                let node = new this.Q.Node();
                let p = this.graph.globalToLocal(ev);
                let l = this.graph.toLogical(p.x, p.y);
                node.set('type', TYPES.CABINET);
                node.set('serverId', serverId);
                node.set('standard', standard);
                node.size = {
                    width: 200,
                    height: parseInt(image.split('-')[2].split('.')[0]) * LH
                };
                node.x = 0;
                node.y = AmendUtil.amendCoordinate(l.y, node.size.height, LH, 42);
                node.image = image;
                if (!AmendUtil.verifyOverlay(node)) {
                    this.graph.graphModel.add(node);
                    resolve(node);
                } else {
                    this.$message.error('该位置已有设备~');
                    reject(node);
                }
            });
        }
    }

    /**
     * 绘制刀片服务器
     * @param {string} image
     * @param ev
     * @param {number} LH
     */
    public drawServer(image: string, ev, LH: number = 17) {
        let server = new this.Q.Node();
        let p = this.graph.globalToLocal(ev);
        let l = this.graph.toLogical(p.x, p.y);
        server.set('type', TYPES.SERVER);
        server.size = {
            width: parseInt(image.split('-')[1]),
            height: parseInt(image.split('-')[2].split('.')[0]) * LH
        };
        server.x = l.x;
        server.y = AmendUtil.amendCoordinate(l.y, server.size.height, LH, 42);
        server.image = image;
        server.zIndex = 99;
        let griff = AmendUtil.verifyServerOverflow(server);
        if (griff) {
            server.host = griff;
            server.parent = griff;
            AmendUtil.amendServer(griff, server);
            this.graph.graphModel.add(server);
        } else {
            this.$message.error('刀片服务器必须放置在刀箱中~');
        }
    }

    /**
     * 绘制刀箱内卡槽位置
     * @param target
     * @param {Object[]} data
     */
    private drawGriffSlot(target, data) {
        let _x: number = target.x - target.size.width / 2,
            _y: number = target.y - target.size.height / 2;
        data.forEach((item, index) => {
            let line = this.graph.createShapeNode();
            line.setStyle(this.Q.Styles.SHAPE_STROKE_STYLE, '#34dfd0');
            line.setStyle(this.Q.Styles.SHAPE_LINE_DASH, [4, 6]);
            line.set('selected', 'unselected');
            line.set('type', TYPES.GRIFF_LINE);
            line.moveTo(_x + item['x'], _y + item['y']);
            line.lineTo(_x + item['x'] + item['w'], _y + item['y']);
            line.lineTo(_x + item['x'] + item['w'], _y + item['y'] + item['h']);
            line.lineTo(_x + item['x'], _y + item['y'] + item['h']);
            line.lineTo(_x + item['x'], _y + item['y']);
            line.set('index', index);
            line.zIndex = 98;
            line.host = target;
            line.parent = target;
        });
    }

    /**
     * 保存已绘制机柜的所有信息
     * @returns []
     * */
    public saveCabinetInfo() {
        let arr = [];
        let item = {};
        this.graph.graphModel.forEach(e => {
            if (e.get('type') === 'CABINET' || e.get('type') === 'GRIFF' || e.get('type') === 'SERVER') {
                item['width'] = e.size.width;
                item['height'] = e.size.height;
                item['x'] = e.x;
                item['y'] = e.y;
                item['img'] = e.image;
                item['warn'] = '';
                item['id'] = e.id;
                arr.push(item);
            }
        });
        return arr;
    }

    /**
     * 保存服务器信息
     * @return {Array}
     */
    public saveServerInfo(){
        let arr = [];
        this.graph.graphModel.forEach(e=>{
            if(e.get('type')==='CABINET'||e.get('type')===TYPES.GRIFF){
                let item= {};
                item['serverId']= e.get('serverId');
                item['shelvesId']= e.get('shelvesId');
                item['standard']= e.get('standard');
                item['startU']=AmendUtil.coordinateToU(e.y,parseInt(e.get('standard')));
                arr.push(item)
            }

        });
        return arr;
    }
}
