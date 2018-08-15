/// <reference types="googlemaps" />
import { OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { NguiMapComponent } from '../components/ngui-map.component';
import { NavigatorGeolocation } from '../services/navigator-geolocation';
import { BaseMapDirective } from './base-map-directive';
export declare class DirectionsRenderer extends BaseMapDirective implements OnChanges, OnDestroy {
    geolocation: NavigatorGeolocation;
    directionsRequest: google.maps.DirectionsRequest;
    directionsService: google.maps.DirectionsService;
    directionsRenderer: google.maps.DirectionsRenderer;
    constructor(nguiMapComponent: NguiMapComponent, geolocation: NavigatorGeolocation);
    initialize(): void;
    ngOnChanges(changes: SimpleChanges): void;
    showDirections(directionsRequest: google.maps.DirectionsRequest): void;
    ngOnDestroy(): void;
}
