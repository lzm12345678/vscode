export class tools {
    private static graph;

    public static init(graph) {
        tools.graph = graph;
    }

    /**
     * 判断机柜之间是否都重叠
     * @param model
     * @param e
     * @param obj
     * @returns {boolean}
     */
    public static checkOverLap(model, e, obj): boolean {
        let isOverFlow, targetX, targetY, targetW, targetH;
        if (e.getData) {
            isOverFlow = false;
            targetX = e.getData().x;
            targetY = e.getData().y;
            targetW = e.getData().size.width;
            targetH = e.getData().size.height;
        } else {
            let p = tools.graph.globalToLocal(e);
            let l = tools.graph.toLogical(p.x, p.y);
            console.log(l);
            isOverFlow = false;
            targetX = l.x;
            targetY = l.y;
            targetW = obj._width - 0;
            targetH = obj._height - 0;
        }
        for (let item of model.datas) {
            if (!item.size || item.type === 'Q.ShapeNode' || item.host || item.get('type') === 'alarm') {
                // return;
            } else if (item.get('type') === 'cabinet' || item.get('type') === 'customCabinet') {
                let sourceX = item.x,
                    sourceY = item.y,
                    sourceW = item.size.width - 0,
                    sourceH = item.size.height - 0;
                if (e.getData) {
                    if (item.id !== e.getData().id) {
                        if (Math.abs(targetX - sourceX) < (targetW - 0 + sourceW) / 2) {
                            if (Math.abs(targetY - sourceY) < (targetH - 0 + sourceH) / 2) {
                                // 重合
                                isOverFlow = true;
                                break;
                            }
                        }
                    }
                } else {
                    if (Math.abs(targetX - sourceX) < (targetW + sourceW) / 2) {
                        if (Math.abs(targetY - sourceY) < (targetH + sourceH) / 2) {
                            // 重合
                            isOverFlow = true;
                            break;
                        }
                    }

                }


            }
        }
        return isOverFlow;

    }

    /**
     * 调整位置自动贴边
     * @param number
     * @param size
     * @returns {number}
     */
    public static correctLocation(number, size): number {
        let newNumber = number % 10 > 5 ? Math.ceil(number / 10) * 10 : Math.floor(number / 10) * 10;
        // 不用自动贴边功能
        // if (+size % 4 == 0) {
        //     return newNumber;
        // } else if (+size % 4 != 0) {
        //     console.log('单数');
        //     return newNumber + 5;
        // }
        return number;

    }

    /**
     * 绘制机房
     * @param Q
     * @param graph
     * @param roomWidth
     * @param roomHeight
     */
    public static drawRoom(Q, graph, roomWidth, roomHeight): void {
        // 绘制横线 比例1米=100px 方格为10px*10px 20cm*20cm 的正方形 1px= 2cm;
        var roomWidth = roomWidth, roomHeight = roomHeight;
        // 对多的数据进行取整
        // roomWidth = roomWidth % 30 == 0 ? roomWidth : Math.floor(roomWidth / 30) * 20;
        // roomHeight = roomHeight % 30 == 0 ? roomHeight : Math.floor(roomHeight / 30) * 20;
        var rowNumber = roomHeight / 10;
        for (var i = 0; i < rowNumber + 1; i++) {
            var row = graph.createShapeNode();
            var height = i * 10;
            row.zIndex = 2;
            row.moveTo(0 - roomWidth / 2, height - roomHeight / 2);
            row.lineTo(roomWidth - roomWidth / 2, height - roomHeight / 2);
            row.setStyle(Q.Styles.SHAPE_STROKE_STYLE, '#cccccc');
            row.setStyle(Q.Styles.SHAPE_STROKE, 0.5);
            row.setStyle(Q.Styles.SHAPE_LINE_DASH, [5, 2]);
            row.isSelected = function () {
                return false;
            };
            row.isMovable = function () {
                return false;
            };
            if (i % 3 === 0) {
                row.setStyle(Q.Styles.SHAPE_LINE_DASH, [5, 0]);
            }
        }
        // 绘制竖线
        var lineNumber = roomWidth / 10;
        for (var i = 0; i < lineNumber + 1; i++) {
            var line = graph.createShapeNode();
            line.zIndex = 2;
            var width = i * 10;
            line.moveTo(width - roomWidth / 2, 0 - roomHeight / 2);
            line.lineTo(width - roomWidth / 2, roomHeight - roomHeight / 2);
            line.setStyle(Q.Styles.SHAPE_STROKE_STYLE, '#cccccc');
            line.setStyle(Q.Styles.SHAPE_LINE_DASH, [5, 2]);
            if (i % 3 == 0) {
                line.setStyle(Q.Styles.SHAPE_LINE_DASH, [5, 0]);

            }
        }
    }

    /**
     * 绘制机柜
     * @param Q
     * @param graph
     * @param x
     * @param y
     * @param w
     * @param h
     * @param name
     * @param image
     * @return any
     */
    public static drawCabinet(Q, graph, name, coed, x, y, w, h, image, cabinetId, alarmLevel = ''): any {
        let _name = name.replace(/[\u4e00-\u9fa5]/g, "aa").length > 8 ? name.substring(0, 4) + '...' : name;
        let demo = graph.createNode(_name, x, y);
        demo.image = image || './../../../assets/room/mx-cabinet4white.svg';
        demo.zIndex = 3;
        demo.size = {width: w, height: h};
        tools.setToolTip(demo, name, coed);
        demo.set('type', 'cabinet');
        demo.set('cabinetId', cabinetId);
        demo.set('code', coed);
        demo.set('name', name);
        demo.setStyle(Q.Styles.LABEL_OFFSET_Y, -h / 2 - 5);
        demo.setStyle(Q.Styles.IMAGE_BORDER, 1);
        demo.setStyle(Q.Styles.IMAGE_BORDER_RADIUS, 0);
        let alarmUI = graph.createNode('', x - w / 2 - 10, y);
        alarmUI.set('type', 'alarm');
        if (alarmLevel === '1') {
            alarmUI.image = './../../../assets/room/alarm-red.svg';
        } else if (alarmLevel === '2') {
            alarmUI.image = './../../../assets/room/alarm-blue.svg';
        } else {
            alarmUI.image = './../../../assets/room/alarm-blue.svg'
        }
        let Level = parseInt(alarmLevel);
        let color = Level === 1 ? '#ff0000' : Level === 2 ? '#ff9900' : Level === 3 ? '#ffff00' : Level === 4 ? '#00ccff' : '#2bd544';
        alarmUI.setStyle(Q.Styles.IMAGE_ALPHA, 0.1);
        alarmUI.setStyle(Q.Styles.BACKGROUND_COLOR, color);
        alarmUI.setStyle(Q.Styles.BORDER_RADIUS, 5);
        alarmUI.size = {width: 10};
        alarmUI.zIndex = 999;
        alarmUI.host = demo;
        alarmUI.parent = demo;
        return demo.id;
    }

    /**
     * 绘制基建
     * @param Q
     * @param graph
     */
    public static drawRoomWall(Q, graph, x, y): void {
        let demo = graph.createNode('', x, y);
        demo.image = './../../../assets/room/mx-cabinet2.svg';
        demo.size = {width: 10, height: 60};
        demo.set('type', 'roomWall');
    }

    /**
     * 绘制自定义机柜
     * @param Q
     * @param graph
     */
    public static drawCustomCabinet(Q, graph, x, y): void {
        let demo = graph.createNode('自定义', x, y);
        demo.image = './../../../assets/room/mx-cabinet4white.svg';
        demo.size = {width: 50, height: 50};
        demo.set('type', 'customCabinet');
        demo.setStyle(Q.Styles.LABEL_OFFSET_Y, -50 / 2);
        demo.setStyle(Q.Styles.BORDER, 1);
        demo.setStyle(Q.Styles.BORDER_RADIUS, 0);
    }

    /**
     * 绘制机房背景
     * @param Q
     * @param graph
     */
    public static drawRoomBackground(Q, graph, image: string = './../../../assets/room/backgroundflor2.png'): void {
        let demo = graph.createNode('', 0, 0);
        demo.image = image;
        // demo.size = {width: 1200, height: 600};
        demo.set('type', 'roomBackground');
        demo.set('isLock', true);
        demo.zIndex = 1;
    }

    /**
     * @param Q
     * @param graph
     * @param name
     * @param x
     * @param y
     * @param w
     * @param h
     * @param image
     * @param cabinetId
     */
    public static drawNewCabinet(Q, graph, name, x, y, w, h, image, cabinetId) {
        let demo = graph.createText(name, x, y);
        demo.size = {width: w, height: h};
        demo.set('type', 'cabinet');
        demo.set('cabinetId', cabinetId);
        demo.setStyle(Q.Styles.LABEL_OFFSET_Y, -h / 2);
        demo.setStyle(Q.Styles.BORDER, 1);
        demo.setStyle(Q.Styles.BORDER_RADIUS, 0);
        demo.setStyle(Q.Styles.BACKGROUND_COLOR, '#2898E0');
        let size = new Q.Size(+w, +h);
        demo.setStyle(Q.Styles.LABEL_SIZE, size);
        let alarmUI = graph.createNode('', x - w - 20, y);
        alarmUI.image = './../../../assets/room/alarm-light.svg';
        alarmUI.size = {width: 20};
        alarmUI.zIndex = 999;
        alarmUI.host = demo;
        alarmUI.parent = demo;
    }

    public static setToolTip(target, name, code = '无数据') {
        target.tooltip = `
            <p >名称：${name} </p>
            <p>编号：${code} </p>
        `;
    }

    public static drawTools(Q, graph, target) {
        let edit = graph.createNode();
        edit.image = './../../../assets/room/edit.svg';
        edit.size = {width: 20};
        edit.zIndex = 888;
        edit.x = target.x + target.size.width / 2 + 10;
        edit.y = target.y;
        edit.setStyle(Q.Styles.DISPALY, 'none');
        edit.host = target;
        edit.parent = target;
    }

}
