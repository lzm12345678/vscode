import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RunParamService {
    private runParamSource = new Subject<RunParam>();
    private runParamSourceToChild = new Subject<RunParam>();

    runParamChangeHook = this.runParamSource.asObservable();
    runParamToChildChangeHook = this.runParamSourceToChild.asObservable();
    commitRunParam(data: RunParam) {
        console.log('runParam...', data);
        this.runParamSource.next(data);
    }

    commitRunParamToChild(data: RunParam) {
        console.log('appto child', data);
        this.runParamSourceToChild.next(data);
    }
}

class RunParam {
    public serverId: string;
    public serverSys: string;
    public runTime: string;
    public memoryParams: Array<any>;
    public diskParams: Array<any>;
}

