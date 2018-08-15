/// <reference types="googlemaps" />
import { OnInit } from '@angular/core';
import { NguiMapComponent } from '../components/ngui-map.component';
import { BaseMapDirective } from './base-map-directive';
export declare class Marker extends BaseMapDirective implements OnInit {
    private nguiMapComp;
    mapObject: google.maps.Marker;
    objectOptions: google.maps.MarkerOptions;
    constructor(nguiMapComp: NguiMapComponent);
    ngOnInit(): void;
    initialize(): void;
    setPosition(): void;
}
