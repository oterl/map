import { OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
declare type MapLoadConfig = {
    apiUrl: string;
};
export declare abstract class NgMapApiLoader implements OnDestroy {
    protected config: MapLoadConfig;
    api$: ReplaySubject<any>;
    private readonly defaultConf;
    abstract load(): void;
    constructor(config: MapLoadConfig);
    ngOnDestroy(): void;
}
export declare class NgMapAsyncApiLoader extends NgMapApiLoader {
    readonly scriptId: string;
    constructor(config: any);
    load(): import("../../../../../../../../../Users/oleksandr_terletskyy/Desktop/map/node_modules/rxjs/internal/Subscription").Subscription;
    private apiLoaded;
}
export {};
