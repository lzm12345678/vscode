/**
 * Created by WH1709055 on  2017/11/17 19:37
 */

import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { CanActivateChild, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MissionService } from "../mission-store/mission.service";



@Injectable()
export class AssetGuardService implements CanActivateChild, CanActivate {
    $mission: MissionService;
    constructor(
        private $router: Router,
    ) {
        this.$mission = new MissionService();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (sessionStorage.getItem('authorization')) {
            return true;
        }
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let urls = state.url.split('/');
        let _url: string = '', breads = [];
        urls.forEach(item => {
            if (item) {
                _url += `/${item}`;
                breads.push({ label: `${item}`, url: _url });
            }
        });
        return true;
    }
}



