import { Injectable, NgModule } from '@angular/core'
import { CanActivate } from '@angular/router'
import { MissionService } from '../mission-store/mission.service';

@NgModule({
    providers: [ MissionService ]
})

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(
        private $mission: MissionService
    ) {
        $mission.loginStatusChangeHook.subscribe(user => {
            console.log(user);
        });
    }
    canActivate() {
        console.log('canActive');
        return true;
    }
}
