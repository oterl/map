import { OnDestroy } from '@angular/core';
import { NguiMapComponent } from '../components/ngui-map.component';
import { BaseMapDirective } from './base-map-directive';
export declare class StreetViewPanorama extends BaseMapDirective implements OnDestroy {
    constructor(nguiMapComp: NguiMapComponent);
    initialize(): void;
    ngOnDestroy(): void;
}
