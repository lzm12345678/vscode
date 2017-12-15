import {NzMessageService} from 'ng-zorro-antd';
import * as TYPES from './types';

export class AmendUtil {
    private static Q: any;
    private static graph: any;
    private static LH: number = 17;
    private static $service: NzMessageService;

    public static init(Q, graph, service) {
        AmendUtil.Q = Q;
        AmendUtil.graph = graph;
        AmendUtil.$service = service;
    }

    /**
     * 获取随机颜色
     * @returns {string}
     */
    public static getRandomColor(): string {
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += '0123456789ABCDEF'[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    /**
     * 图例坐标修正
     * @param {number} y
     * @param {number} itemLh
     * @param {number} lh
     * @param {number} ln
     * @returns {number}
     */
    public static amendCoordinate(y: number, itemLh: number, lh: number = 17, ln: number = 42): number {
        let _yMax = lh * (Math.ceil(ln / 2) - 1),
            _yMin = -lh * Math.ceil(ln / 2);
        let _num = Math.round((y - _yMin) / lh) * lh + _yMin;
        _num = _num < _yMin ? _yMin : _num > _yMax ? _yMax : _num;
        if ((itemLh / 17) % 2 !== 0) {
            _num += lh / 2;
        }
        if (_num >= _yMax + lh - itemLh / 2) {
            _num = _yMax + lh - itemLh / 2;
        } else if (_num <= _yMin + itemLh / 2) {
            _num = _yMin + itemLh / 2;
        }
        return _num;
    }

    /**
     * 设置告警显示信息
     * @param graph
     * @param target
     * @param {number} rank
     */
    public static createWarning(graph, target, rank = ''): void {
        let _y = target.y ;
        let node = graph.createNode('', -160, _y);
        node.set('selected', 'unselected');
        node.image = 'warn';
        node.size = {
            width: 10,
            height: 10
        };
        let Level = rank;
        let color = Level==='1'?'#ff0000':Level==='2'?'#ff9900':Level==='3'?'#ffff00':Level==='4'?'#00ccff':'#2bd544';
        node.setStyle(this.Q.Styles.IMAGE_ALPHA,0.1);
        node.setStyle(this.Q.Styles.BACKGROUND_COLOR,color);
        node.setStyle(this.Q.Styles.BORDER_RADIUS, 5);
        // node.tooltip = `
        //     <p>告警名称：No213123 </p>
        //     <p>告警等级：${rank}+ </p>
        //     <p>告警编号：879234 </p>
        //     <p>告警时间：2017-3-6 </p>
        // `;
        node.set('type', 'warn');
        node.host = target;
        target.host = node;
    }
    public static setToolTip(target,name,code,){
        target.tooltip = `
            <p>设备名称：${name} </p>
            <p>资产编号：${code} </p>
        `
    }
    /**
     * 告警图示位置修正
     * @param target
     * @param item
     */
    public static amendWarning(target, item): void {
        item.x = -160;
        item.y = target.y;
    }

    /**
     * 校验图例所占位置是否会与其他图例重叠
     * @param target
     * @returns {boolean}
     */
    public static verifyOverlay(target): boolean {
        let min = (target.y - target.size.height / 2) / 17,
            max = (target.y + target.size.height / 2) / 17,
            isOverlay = false;
        AmendUtil.graph.graphModel.forEach(item => {
            if (item.get('type') && item.get('type') === TYPES.CABINET || item.get('type') === TYPES.GRIFF) {
                if (item.id !== target.id) {
                    let _min = (item.y - item.size.height / 2) / 17,
                        _max = (item.y + item.size.height / 2) / 17;
                    /**
                     * 目标图例的上下边在其他图例内部 或者目标图例将其他图例包裹在自己内部
                     */
                    if (min > _min && min < _max || (max > _min && max < _max) || (min <= _min && max >= _max)) {
                        isOverlay = true;
                        return false;
                    }
                }
            }
        });
        return isOverlay;
    }

    /**
     * 刀箱卡槽、刀片服务器偏移位置修正
     * @param target
     * @param {number} offsetY
     */
    public static amendChildren(target, offsetY: number): void {
        let _minX: number = 0;
        target.children.datas.forEach((item, index) => {
            if (item.get('type') !== TYPES.SERVER) {
                if (index === 0) {
                    _minX = item.x;
                }
                if (item.x < _minX) {
                    _minX = item.x;
                }
            }
        });
        target.children.datas.forEach(item => {
            item.x = item.x - _minX;
            item.y -= offsetY;
        });
    }

    /**
     * 正确放置刀片服务器于刀箱内的卡槽
     * @param griff
     * @param target
     */
    public static amendServer(griff, target): void {
        // 刀片服务器左边的横坐标
        let serverLeftSideX = target.x - target.size.width / 2,
            // 刀箱最左边横坐标
            griffLeftSideX = griff.x - griff.size.width / 2,
            // 离刀片最近的卡槽位置
            minX = 9999,
            minY = 9999,
            exceptY = 0,
            except = null,
            exceptIndex = 0,
            griffYs = [];
        griff.get('griff').forEach(item => {
            let y = item.y + griff.y - griff.size.height / 2 + item.h / 2;
            if (!griffYs.includes(y)) {
                griffYs.push(y)
            }
        });
        griffYs.forEach(item => {
            let _minY = Math.abs(target.y - item);
            if (_minY < minY) {
                minY = _minY;
                exceptY = item;
            }
        });
        griff.get('griff').forEach((item, index) => {
            let _minX = Math.abs(serverLeftSideX - griffLeftSideX - item.x);
            if (_minX < minX) {
                minX = _minX;
                except = item;
                exceptIndex = index;
            }
        });
        target.host = griff;
        target.parent = griff;
        target.set('index', exceptIndex);
        target.x = griffLeftSideX + except.x + target.size.width / 2;
        target.y = exceptY;
    }

    /**
     * 判断服务器是否可以放置于服务器内部
     * @param graph
     * @param target
     * @returns {boolean}
     */
    public static verifyServerOverflow(target) {
        let _item = null;
        AmendUtil.graph.graphModel.forEach(item => {
            if (item.get('type') === TYPES.GRIFF) {
                let _pMinY = item.y - item.size.height / 2,
                    _pMaxY = item.y + item.size.height / 2,
                    _cMinY = target.y - target.size.height / 2,
                    _cMaxY = target.y + target.size.height / 2;
                if (_cMaxY <= _pMaxY + AmendUtil.LH && _cMinY >= _pMinY - AmendUtil.LH) {
                    _item = item;
                    return false;
                }
            }
        });
        return _item;
    }

    /**
     * 拖拽刀片服务器 位置修正
     * @param ev
     * @param {{x: number; y: number}} previousPosition
     */
    public static dragServer(ev, previousPosition: { x: number, y: number }) {
        let p = this.graph.globalToLocal(ev);
        let l = this.graph.toLogical(p.x, p.y);
        console.log(l);
        let server = ev.getData();
        let serverX = server.x,
            serverY = server.y,
            flag = false;
        AmendUtil.graph.graphModel.forEach(griff => {
            if (griff.get('type') === TYPES.GRIFF) {
                let griffX = griff.x,
                    griffY = griff.y;

                if (serverX > griffX - griff.size.width / 2 - server.size.width
                    && serverX < griffX + griff.size.width / 2 + server.size.width
                    && serverY > griffY - griff.size.height / 2 - AmendUtil.LH
                    && serverY < griffY + griff.size.height / 2 + AmendUtil.LH
                ) {
                    flag = true;
                    console.log(griff.x, griff.y);
                    AmendUtil.verifyServerOverlay(griff, server);
                    AmendUtil.amendServer(griff, server);
                    return false;
                }
            }
        });
        if (flag) {
            AmendUtil.$service.info('有效操作！');
        } else {
            server.x = previousPosition.x;
            server.y = previousPosition.y;
            AmendUtil.$service.warning('无效操作！');
        }
    }

    public static verifyServerOverlay(griff, target) {
        console.log(griff, target);
        griff.children.datas.forEach(item => {
            if (item.get('index')) {

            }
        });
    }

    /**
     * u数转坐标Y
     * @param startU
     * @param standard
     * @param LN
     * @param LH
     * @return Y
     */
    public static uToCoordinate(startU,standard, LN: number = 42, LH: number = 17): number {
        let endU= startU-standard+1;
        let Y = (LN * LH / 2) - (endU - 1) * LH - standard*LH / 2;
        return Y
    }

    /**
     * 坐标Y转起始U位
     * @param Y
     * @param standard
     * @param LN
     * @param LH
     * @return StartU
     */
    public static coordinateToU(Y, standard,LN: number = 42, LH: number = 17): number {
        let endU = (-(Y - (LN * LH / 2) + standard*LH / 2) / LH) + 1;
        let startU = endU+standard-1;
        return startU
    }
}
