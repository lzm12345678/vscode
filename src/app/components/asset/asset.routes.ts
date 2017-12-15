/**
 * Created by GyjLoveLh on  2017/12/13
 */
import { Routes } from '@angular/router'
import { AssetComponent } from "./asset.component"
import { RockComponent } from "./servicer/rock/rock.component"
import { RockDetailComponent } from "./servicer/rock/rock-detail/rock-detail.component"

import { NetworkAssetComponent } from './servicer/network-asset/network-asset.component';
import { NetworkDetailComponent } from './servicer/network-asset/network-detail/network-detail.component';

export const ROUTER_CONFIG: Routes = [
    {
        path: '',
        component: AssetComponent,
        children: [
            {
                path: 'servicer',
                children: [
                    { path: 'rock', component: RockComponent },
                    // {
                    //     path: 'rock/pandect',
                    //     component: PandectComponent,
                    //     children: [
                    //         // { path: 'base', component: PandectBaseComponent },
                    //         // { path: 'alarm', component: AlarmListComponent },
                    //         // { path: 'operation', component: OperationParameterComponent },
                    //         // { path: 'mt', component: MonitorTaskComponent },
                    //         // { path: 'rtm', component: RealtimeMonitorComponent },
                    //         // { path: 'history', component: HistoryComponent },
                    //         // { path: 'protocol', component: ProtocolConfigurationComponent},
                    //         // { path: 'hardware', component: HardwareComponent },
                    //         // { path: 'sensor', component: SensorThresholdComponent },
                    //         // { path: 'sel', component: SelLogComponent },
                    //         // { path: 'bmc', component: BmcListComponent },
                    //         // { path: 'reset', component: ResetComponent },
                    //         // { path: 'other', component: PandectOtherComponent }
                    //     ]
                    // },
                    { path: 'rock/:type', component: RockDetailComponent },
                    { path: 'networkAsset', component:NetworkAssetComponent},
                    { path: 'networkAsset/:type', component:NetworkDetailComponent}
                ]
            }
        ]
    }
];
