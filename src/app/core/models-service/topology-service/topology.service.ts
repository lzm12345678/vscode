/**
 * Created by GyjLoveLh on  2017/12/8
 */
import { Injectable } from '@angular/core'
import { Topology } from "./topology.model"
import { Edge } from "./edge.model"
import { Node } from "./node.model"
import { TopologyInterface } from "./topology.interface"
import { Result } from "../Result"
import { CommonUtils } from "../../utils/common-utils"
import { Subnet } from "./subnet.model";

@Injectable()
export class TopologyService implements TopologyInterface {
    private data: Topology[] = [];
    private edges: Edge[] = [];
    constructor() {
        for (let i = 0; i < 4; i++) {
            let topology = new Topology();
            topology.id = CommonUtils.getUUID();
            topology.name = `光谷片区${i + 1}`;
            for (let j = 0; j < 4; j++) {
                let subnet = new Subnet();
                subnet.id = CommonUtils.getUUID();
                subnet.name = `子网${(i + 1)}${(j + 1)}`;

                let random = Math.floor(Math.random() * 15) + 15;

                for (let k = 0; k < random; k++) {
                    let node = new Node();
                    node.id = CommonUtils.getUUID();
                    node.name = `node${(i + 1)}${(j + 1)}${k + 1}`
                    subnet.nodes.push(node);
                }
                for (let k = 0; k < random; k++) {
                    let edge = new Edge();
                    edge.id = CommonUtils.getUUID();
                    edge.name = `edge${(i + 1)}${(j + 1)}${k + 1}`;
                    edge.from = subnet.nodes[Math.floor(Math.random() * random)].id;
                    edge.to = subnet.nodes[k % random].id;
                    subnet.edges.push(edge);
                }
                topology.subnets.push(subnet);
            }

            for (let k = 0; k < 8; k++) {
                let node = new Node();
                node.id = CommonUtils.getUUID();
                node.name = `node${(i + 1)}${k + 1}`;
                node.type = 'node';
                topology.nodes.push(node);
            }
            for (let k = 0; k < 8; k++) {
                let edge = new Edge();
                edge.id = CommonUtils.getUUID();
                edge.name = `edge${(i + 1)}${k + 1}`;
                edge.from = topology.nodes[3].id;
                edge.to = topology.nodes[k].id;
                topology.edges.push(edge);
            }
            this.data.push(topology);
        }
    }
    getTopologies() {
        return new Promise((resolve, reject) => {
            resolve(this.data);
        });
    }

    getSubnetById(id) {
        return new Promise((resolve, reject) => {
            let subnet = this.data.filter(item => item.id === id)[0];
            let _result = [];
            subnet.nodes.forEach(item => {
                let { id, name } = item;
                _result.push(Object.assign({ id, name }, { type: 'node' }));
            });
            subnet.subnets.forEach(item => {
                let { id, name } = item;
                _result.push(Object.assign({ id, name }, { type: 'subnet' }));
            });
            resolve(_result);
        });
    }

    getSubnetDetailById(id) {
        return new Promise((resolve, reject) => {
            let _data = this.data.filter(item => item.id === id);
            if (_data.length > 0) {
                resolve(_data[0]);
            } else {
                let data = null;
                this.data.forEach(item => {
                    let subnet = item.subnets.filter(subnet => subnet.id === id);
                    if (subnet.length > 0) {
                        data = subnet;
                    }
                });
                resolve(data[0]);
            }
        });
    }
}

