/// <reference types="googlemaps" />
import { NguiMapComponent } from '../components/ngui-map.component';
import { BaseMapDirective } from './base-map-directive';
export declare class Circle extends BaseMapDirective {
    private nguiMapComp;
    mapObject: google.maps.Circle;
    objectOptions: google.maps.CircleOptions;
    constructor(nguiMapComp: NguiMapComponent);
    initialize(): void;
    setCenter(): void;
}
