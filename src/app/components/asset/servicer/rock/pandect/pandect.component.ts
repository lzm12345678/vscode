/**
 * Created by WH1709055 on  2017/11/10 10:43
 */

import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'app-pandect',
    templateUrl: './pandect.component.html',
    styleUrls: ['./pandect.component.scss']
})

export class PandectComponent implements OnInit {
    constructor(
        public $router: Router
    ) {}
    ngOnInit() {}

    public routerToChild(param) {
        this.$router.navigate([`/asset/servicer/rock/pandect/${param}`], { preserveQueryParams: true })
    }
}


