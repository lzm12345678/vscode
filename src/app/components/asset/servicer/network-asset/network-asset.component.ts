import { Component, OnInit } from '@angular/core';
//导入组要的数据模型--
import { Network, Cabinet } from "../../../../models";

import { Router } from '@angular/router';
import { MissionService } from "../../../../mission-store/mission.service";
import { NetworkAssetService } from './network-asset.service';
import { NzMessageService } from 'ng-zorro-antd';

import { ServicerService } from "../../../../core/models-service/servicer-service"
import { RoomService, Room } from "../../../../core/models-service/room-service"

@Component({
  selector: 'app-network-asset',
  templateUrl: './network-asset.component.html',
  styleUrls: ['./network-asset.component.scss'],
  providers: [ MissionService, NetworkAssetService ]
})
export class NetworkAssetComponent implements OnInit {

     
    //  startUs = [];   // 可用U位
     
//   disabledButton = true;
//   data=[];
  
//--------------------------------------
//   _allChecked = false;
//   _indeterminate = false;
//   _displayData:Network[] = [];
  constructor(
    private $mission: MissionService,
    private $service: NetworkAssetService,
    private $router: Router,
    private $$service: ServicerService,
    private $roomService: RoomService,
    private $message: NzMessageService
    
  ) { }

  //重构之后的代码参数配置========================================
//获取table的数据需要参数
//   netWrok: Network[] = [];
  network=[];
  pageSize:number=20;
  pageIndex: number = 1;
  total: number = 1;
  //查询的----------
  users = [];  // 所有责任人
  rooms=[];    //机房的
  versions = []; // 所有型号
  cabinets: Cabinet[] = []; //机柜
  allStartUs = [];    // 所有U位

  //告警的状态--------------------------
  alarmArr = [
        { label: '严重警告', value: 1 },
        { label: '主要警告', value: 2 },
        { label: '次要警告', value: 3 },
        { label: '提示警告', value: 4 }
    ]; 
    //new 一个我引入的数据模型-------
    search:Network=new Network();
     isSearchOpen: boolean = false;
  //排序参数--------------
  sortMap = {
    sortItem: '',
    sortWay: -1
  };

  //table de arr
  tableColumn = [];
  operateButtons = [
      { title: '新&nbsp;&nbsp;增', icon: 'anticon-plus', clickEvent:()=> { 
            this.routerToDetail('insert',null);
      } },
      { title: '同步服务器', batch: true, icon: 'anticon-sync', clickEvent:(arr)=> {
          console.log(arr);
      } },
      { title: '批量删除', batch: true, icon: 'anticon-minus', clickEvent:(arr)=> {
          alert(arr);
      } }
  ];
  ngOnInit() {
    
    this.$service.getAllVersion(result => {
      this.versions = result;
    });
    this.$roomService.getRooms().then(success => {
      this.rooms = success.data;
    });
    this.$service.getAllUser(result => {
      this.users = result.data;
    });

    this.initNetwork();
    this.initTable();

  }
  /**
   * @initNetwork  初始化table的数据 ---------------------------------
   */
  initNetwork(){
      // this.$service.getNetworkByField(this.pageIndex, this.pageSize, this.search, this.sortMap, result => {
      //     this.netWrok = result.data;
      //     console.log(33333333333333333333)
      //     console.log(this.netWrok)
      //     this.total = result.totalCount;
      // });

      this.$$service
      .getServicerPagination({ pageIndex: this.pageIndex, pageSize: this.pageSize }, this.search, this.sortMap)
      .then(success => {
          this.network = success.data.data;
          console.log(333333333333)
          console.log(this.network)
          this.total = success.data.totalCount;
      })
  }
  
    initTable(){
      var _self:any = this;
      this.tableColumn = [
        { type: 'selection', selectChange() {} },
        { title: '资产名称', key: 'serverName', href: true},
        { title: '资产IP', key: 'serverIp', href: true, 
            clickEvent(row) {
                console.log(row);
            } },
        { title: '资产型号', key: 'serverModel', sortable: true,
            sortChange() {},
            clickEvent(row) {
                console.log(row);
            }
        },    
        { title: '管理状态', key: 'computerRoomId' },
        { title: '告警状态', key: 'alarmLevel', type: 'icon',
            icons: [
                { value: '1', title: '严重告警', iconClass: 'error' },
                { value: '2', title: '重要告警', iconClass: 'primary' },
                { value: '3', title: '次要告警', iconClass: 'success' },
                { value: '4', title: '提示告警', iconClass: 'warning' },
                { title: '正常', iconClass: 'normal' },
            ]
        },
        { title: '设备分类', key: 'computerRoomName' },
        { title: '资产位置', key: 'computerRoomName', sortable: true,
            sortChange() {},
            clickEvent(row) {
                console.log(row);
            }
        },
        { title: '资产编号', key: 'serverCode', sortable: true,
            sortChange() {},
            clickEvent(row) {
                console.log(row);
            }
        },       
        { title: '所属项目', key: 'serverProject' },
        { title: '责任人', key: 'serverFirstuser' },
        { title: '操作', type: 'buttons',
            buttons: [
                {
                    label: '修改',
                    iconClass: ['btn-edit'],
                    okEvent:(target, event)=>{
                        this.routerToDetail('insert',null);
                    }
                },
                {
                    label: '删除',
                    type: 'confirm',
                    iconClass: ['btn-delate'],
                    popContent: '确认删除这个服务器吗？',
                    okEvent(target, event) {
                        console.log(target, event);
                    }
                }
               
            ]
        }
    ];
    }

    /**
     * 查询--获取机房下所有机柜
     * @param id
     */
    public roomChange(id) {
      this.$service.getAllCabinet(id, result => {
          this.search.cabinetId = null;
          this.search.startU = null;
          this.cabinets = result.cabinetSet || [];
          this.allStartUs = [];
      });
    }

    /**
     * 查询--机柜下所有可用U位
     * @param id
     */
    public cabinetAllChange(id) {
      this.$service.getAllStartUs(id, result => {
          let temp = [];
          this.search.startU = null;
          for (let i = 1; i <= result; i++) {
              temp.push(i);
          }
          this.allStartUs = temp;
      });
    }

    /**
     * 模糊查询
     */
    public searchByField() {
      this.initNetwork();
    }

    /**
     * 查询告警
     * @param value
     */
    alarmChange(value) {
      this.search.alarmStatusArr = [];
      value.forEach(item => {
          if (item.checked) {
              this.search.alarmStatusArr.push(item.value);
          }
      });
    }

    /**
     * 清空查询条件
     */
    public clearField() {
      this.search = new Network();
      this.alarmArr.forEach(item => {
          item['checked'] = false;
      });
      //重置显示全部
      this.initNetwork();
      
    }

  /**
   * 展开/合拢 按钮
   */
   toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;

  }

  /**
   * 点击新增----------------------
   * @param type 
   * @param id 
   */
  routerToDetail(type, id) {
    this.$router.navigate([`/asset/servicer/networkAsset/${type}`], { queryParams: { id } });
}


}
