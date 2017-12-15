/**
 * Created by GyjLoveLh on  2017/12/11
 */
import { Node } from "./node.model"
import { Edge } from "./edge.model"

export class Subnet {
    id: string;
    name: string;
    type?: string = 'subnet';
    subnets: Subnet[] = [];
    nodes: Node[] = [];
    edges: Edge[] = [];
}

