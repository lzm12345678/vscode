/*
 * @Author: linZimo 
 * @Date: 2017-12-12 10:46:35 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2017-12-12 10:50:45
 */
import { Component, OnInit } from '@angular/core';
import { Series } from '../../../../../models';
import {Router, ActivatedRoute} from '@angular/router'
@Component({
  selector: 'app-series-detail',
  templateUrl: './series-detail.component.html',
  styleUrls: ['./series-detail.component.css']
})
export class SeriesDetailComponent implements OnInit {
  veries:Series=new Series();
  column = [];
  constructor(
    private $active: ActivatedRoute,
    public $router: Router

  ) { }

  ngOnInit() {
    this.initColumn();
  }

  //初始化新增的 表单的样子----------
  
  public initColumn(){
    let $component = this;
    this.column = [
        {label: '系列名称', key: 'name', type: 'input', require: true },
        
        {label: '所属品牌', key: 'level', type: 'select',  require: true, rules: [ {require: true} ], selectInfo: {
          
        }},
        // {label: '类型', key: 'name', type: 'input', require: true },
        {label: '描述', key: 'description', type: 'textarea', rules: [ {require: true}],require: true,}
    ];

  }

  //返回---------------------------
  public backSeries(){
    window.history.go(-1);
    
  }

  public saveSeries(){
    alert("保存")
  }
  

}
