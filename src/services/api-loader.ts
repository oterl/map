import {
    Inject,
    Injectable,
    NgZone,
    OnDestroy,
    Optional
    } from '@angular/core';
import { first } from 'rxjs/operator/first';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { NG_MAP_CONFIG_TOKEN } from './config';
import {
    isMapsApiLoaded,
    loadScript
    } from './util';

type MapLoadConfig = {
    apiUrl: string;
};

export abstract class NgMapApiLoader implements OnDestroy {
    api$: ReplaySubject<any> = first.call(new ReplaySubject(1));

    private readonly defaultConf = {
        apiUrl: 'https://maps.google.com/maps/api/js'
    };

    abstract load(): void;

    constructor(
        protected config: MapLoadConfig
    ) {
        this.config = { ...this.defaultConf, ...this.config};
    }

    ngOnDestroy() {
        this.api$.complete();
    }
}

// #region Not used anymore
// @Injectable()
// export class NgMapAsyncCallbackApiLoader extends NgMapApiLoader {
//     readonly scriptLoadedCallback: string = 'mapDownloaded';
//     readonly scriptElementId: string = 'ngui-map-api';
//     readonly scriptElementSelector: string = `#${this.scriptElementId}`;

//     constructor(
//         protected _zone: NgZone,
//         @Optional() @Inject(NG_MAP_CONFIG_TOKEN) config
//     ) {
//         super(config);
//     }

//     load() {
//         if (typeof window === 'undefined') {
//             return;
//         }

//         if (isMapsApiLoaded()) {
//             this.api$.next(google.maps);
//             return;
//         }

//         if (!document.querySelector(this.scriptElementSelector)) {
//             (<any>window)['nguiMapRef'] = (<any>window)['nguiMapRef'] || [];
//             (<any>window)['nguiMapRef'].push({
//                 zone: this._zone,
//                 provideApiCallback: () => this.api$.next(google.maps)
//             });
//             this.addGoogleMapsApi();
//         }
//     }

//     private addGoogleMapsApi() {
//         (<any>window)[this.scriptLoadedCallback] =
//             (<any>window)[this.scriptLoadedCallback] ||
//                 function() {
//                     (<any>window)['nguiMapRef'].forEach(nguiMapRef => {
//                         nguiMapRef.zone.run(function() {
//                             nguiMapRef.provideApiCallback();
//                         });
//                     });
//                     (<any>window)['nguiMapRef'].splice(
//                         0,
//                         (<any>window)['nguiMapRef'].length
//                     );
//                 };

//         const script = document.createElement('script');

//         let apiUrl = this.config.apiUrl;
//         apiUrl += apiUrl.indexOf('?') !== -1 ? '&' : '?';
//         script.src = `${apiUrl}callback=${this.scriptLoadedCallback}`;
//         document.querySelector('body').appendChild(script);
//     }
// }
// #endregion

@Injectable()
export class NgMapAsyncApiLoader extends NgMapApiLoader {
    readonly scriptId = 'googleMaps';

    constructor(
        @Optional() @Inject(NG_MAP_CONFIG_TOKEN) config
    ) {
        super(config);
    }

    load() {
        if (isMapsApiLoaded()) {
            this.apiLoaded();
        }

        return loadScript(this.config.apiUrl, this.scriptId, window)
            .subscribe((loaded: boolean) => {
                if (loaded) this.apiLoaded();
            });
    }

    private apiLoaded() {
        this.api$.next(google.maps);
    }
}
