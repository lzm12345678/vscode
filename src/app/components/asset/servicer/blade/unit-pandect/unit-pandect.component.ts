/**
 * Created by WH1711028 on  2017/11/22
 */

import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'app-unit-pandect',
    templateUrl: './unit-pandect.component.html',
    styleUrls: ['./unit-pandect.component.scss']
})

export class UnitPandectComponent implements OnInit {
    constructor(
        public $router: Router
    ) {}
    ngOnInit() {}

    public routerToChild(param) {
        this.$router.navigate([`/asset/servicer/blade/unit-pandect/${param}`], { preserveQueryParams: true })
    }
}


