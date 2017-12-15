/**
 * Created by GyjLoveLh on  2017/12/10
 */

export class TopologyUtils {
    private Q = window['Q'];
    private graph;
    private static _instance: TopologyUtils;

    constructor(graph) {
        this.graph = graph;

        this.graph.originAtCenter = false;
        this.graph.enableTooltip = true;
        this.graph.tooltipDelay = 0;
        this.graph.tooltipDuration = 10000;
    }

    static getInstance(graph) {
        if (!TopologyUtils._instance) {
            TopologyUtils._instance = new TopologyUtils(graph);
        }
        return TopologyUtils._instance;
    }

    /**
     * 绘制子网
     * @param obj
     */
    public createSubnet(obj) {
        let node = new this.Q.Node();
        // node.name = obj.name || "";
        node.size = {
            width: 20, height: 20
        };
        node.image = 'net';

        node.tooltip = `<p>this is ${obj.name}</p>`;
        node.x = Math.random() * 500;
        node.y = Math.random() * 500;
        node.set('customType', obj.type);
        node.set('topologyId', obj.id);
        node.setStyle(this.Q.Styles.BORDER, 1);
        node.setStyle(this.Q.Styles.BORDER_COLOR, "#2b87ee");
        node.setStyle(this.Q.Styles.PADDING, new this.Q.Insets(5));
        node.setStyle(this.Q.Styles.BORDER_RADIUS, { x: 99, y: 99 });
        this.graph.graphModel.add(node);
    }

    /**
     * 绘制节点
     * @param obj
     */
    public createNode(obj) {
        let node = new this.Q.Node();
        // node.name = obj.name || "";
        node.size = {
            width: 20, height: 20
        };
        node.image = 'node';
        node.tooltip = `<p>this is ${obj.name}</p>`;
        node.x = Math.random() * 500;
        node.y = Math.random() * 500;
        node.set('customType', obj.type);
        node.set('topologyId', obj.id);
        node.setStyle(this.Q.Styles.BORDER, 1);
        node.setStyle(this.Q.Styles.BORDER_COLOR, "#2b87ee");
        node.setStyle(this.Q.Styles.PADDING, new this.Q.Insets(5));
        node.setStyle(this.Q.Styles.BORDER_RADIUS, { x: 99, y: 99 });
        this.graph.graphModel.add(node);
    }

    /**
     * 绘制链路
     * @param target
     */
    public createEdge(target) {
        let _from = null, _to = null;
        this.graph.graphModel.forEach(item => {
            if (item.get('topologyId') === target.from) {
                _from = item;
            }
            if (item.get('topologyId') === target.to) {
                _to = item;
            }
        });
        let edge = new this.Q.Edge(_from, _to);
        edge.id = target.id;
        // edge.name = target.name;

        edge.setStyle(this.Q.Styles.EDGE_COLOR, '#2b87ee');
        edge.setStyle(this.Q.Styles.EDGE_WIDTH, 1);

        this.graph.graphModel.add(edge);
    }
}
