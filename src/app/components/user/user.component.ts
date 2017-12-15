/**
 * Created by WH1709055 on  2017/11/22 17:59
 */

import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
    pageFlag: string;
    isCollapse:boolean;
    constructor(
        private $router: Router,
        private $active: ActivatedRoute,
    ) { }
    //点击显示左边菜单---------
    toggleCollapse(): void {
        this.isCollapse = !this.isCollapse;
    }

    ngOnInit() {

        this.$router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.$active)
            .map(route => {
                if (route.firstChild) {
                    route = route.firstChild;
                    return route;
                }

            })
            .subscribe((event) => {

                // console.log('active:', event._routerState.snapshot.url);
                let _arr = window.location.href.split('/');
                this.pageFlag = _arr[_arr.length - 1];
            });


        let _arr = window.location.href.split('/');
        this.pageFlag = _arr[_arr.length - 1];
        console.log(this.pageFlag);
    }
}


