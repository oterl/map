import { OnDestroy } from '@angular/core';
import {
    ReplaySubject,
    Subscription
} from 'rxjs';
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
    load(): Subscription;
    private apiLoaded;
}
export {};
