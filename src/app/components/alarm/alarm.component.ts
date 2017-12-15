
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'

@Component({
    selector: 'app-alarm',
    templateUrl: './alarm.component.html',
    styleUrls: ['./alarm.component.scss']
})

export class AlarmComponent implements OnInit {
    private pageFlag: string;
    private isCollapse:boolean;
    constructor(
        private $router: Router,
        private $active: ActivatedRoute
    ) { }

    //点击显示左边菜单---------
    toggleCollapse(): void {
        this.isCollapse = !this.isCollapse;
    }

    ngOnInit() {
        // this.$router.events
        //     .filter(event => event instanceof NavigationEnd)
        //     .map(() => this.$active)
        //     .map(route => {
        //         if (route.firstChild) {
        //             route = route.firstChild;
        //             return route;
        //         }
        //
        //     })
        //     .subscribe((event) => {
        //
        //         // console.log('active:', event._routerState.snapshot.url);
        //         let _arr = window.location.href.split('/');
        //         this.pageFlag = _arr[_arr.length - 1];
        //     });
        //
        //
        // let _arr = window.location.href.split('/');
        // this.pageFlag = _arr[_arr.length - 1];
        // console.log(this.pageFlag);
    }
}


