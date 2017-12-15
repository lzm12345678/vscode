import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {
    CanDeactivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import {RoomComponent} from "./room.component";
import {NzModalService} from "_ng-zorro-antd@0.5.5@ng-zorro-antd";
import {CabinetComponent} from "../cabinet/cabinet.component";

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<RoomComponent> {
    constructor(private confirmSrv: NzModalService) {
    }

    canDeactivate(component: RoomComponent,
                  route: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot): Observable<boolean> | boolean {
        console.log(route.paramMap.get('id'));
        console.log(state.url);
        if (component.isModelChange) {
            return new Observable((observer) => {
                this.confirmSrv.confirm({
                    title: '确认要离开吗？',
                    content: '你已经修改了部分机房信息是否保存。',
                    okText: '保存并离开',
                    cancelText: '取消并离开',
                    onOk: () => {
                        component.roomSave();
                        component.isModelChange = false;
                        observer.next(true);
                        observer.complete();
                    },
                    onCancel: () => {
                        observer.next(true);
                        component.isModelChange = false;
                        observer.complete();
                    }
                });
            });

        } else {
            return true;
        }
    }
}

@Injectable()
export class CabinetCanDeactivateGuard implements CanDeactivate<CabinetComponent> {
    constructor(private confirmSrv: NzModalService) {
    }

    canDeactivate(component: CabinetComponent,
                  route: ActivatedRouteSnapshot,
                  state: RouterStateSnapshot): Observable<boolean> | boolean {
        // Get the Crisis Center ID
        console.log(route.paramMap.get('id'));

        // Get the current URL
        console.log(state.url);
        if (component && component.isModelChange) {
            return new Observable((observer) => {
                this.confirmSrv.confirm({
                    title: '确认要离开吗？',
                    content: '你已经修改了部分机柜信息是否保存。',
                    okText: '保存并离开',
                    cancelText: '取消并离开',
                    onOk: () => {
                        component.saveCabinet();
                        component.isModelChange = false;
                        observer.next(true);
                        observer.complete();
                    },
                    onCancel: () => {
                        observer.next(true);
                        component.isModelChange = false;
                        observer.complete();
                    }
                });
            });

        } else {
            return true;
        }
    }
}
