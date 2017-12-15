/**
 * Created by GyjLoveLh on  2017/12/8
 */
import { Position } from "./position.model"
import { Node } from "./node.model"
import { Edge } from "./edge.model"
import { Subnet } from "./subnet.model";

export class Topology {
    id: string;
    name?: string;
    type?: string = 'topology';
    subnets?: Subnet[] = [];
    nodes: Node[] = [];
    edges: Edge[] = [];
    location?: Position;
}


