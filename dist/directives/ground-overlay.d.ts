/// <reference types="googlemaps" />
import { NguiMapComponent } from '../components/ngui-map.component';
import { BaseMapDirective } from './base-map-directive';
export declare class GroundOverlay extends BaseMapDirective {
    mapObject: google.maps.GroundOverlay;
    objectOptions: google.maps.GroundOverlayOptions;
    constructor(nguiMapComp: NguiMapComponent);
    initialize(): void;
}
