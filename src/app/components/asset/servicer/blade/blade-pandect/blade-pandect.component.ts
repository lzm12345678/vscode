/**
 * Created by WH1709055 on  2017/11/10 10:43
 */

import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'app-blade-pandect',
    templateUrl: './blade-pandect.component.html',
    styleUrls: ['./blade-pandect.component.scss']
})

export class BladePandectComponent implements OnInit {
    constructor(
        public $router: Router
    ) {}
    ngOnInit() {}

    public routerToChild(param) {
        this.$router.navigate([`/asset/servicer/blade/blade-pandect/${param}`], { preserveQueryParams: true })
    }
}


