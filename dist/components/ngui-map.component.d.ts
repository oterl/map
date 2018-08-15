/// <reference types="googlemaps" />
import { AfterViewChecked, AfterViewInit, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { NgMapApiLoader } from '../services/api-loader';
import { GeoCoder } from '../services/geo-coder';
import { MapLoadedService } from '../services/map-loaded.service';
import { MapService } from '../services/map.service';
import { NavigatorGeolocation } from '../services/navigator-geolocation';
import { OptionBuilder } from '../services/option-builder';
import { InfoWindow } from './info-window';
export declare class NguiMapComponent implements OnChanges, OnDestroy, AfterViewInit, AfterViewChecked {
    optionBuilder: OptionBuilder;
    elementRef: ElementRef;
    geolocation: NavigatorGeolocation;
    geoCoder: GeoCoder;
    nguiMap: MapService;
    apiLoader: NgMapApiLoader;
    zone: NgZone;
    private readonly _mapLoadedService;
    mapReady$: EventEmitter<any>;
    el: HTMLElement;
    map: google.maps.Map;
    mapOptions: google.maps.MapOptions;
    inputChanges$: Subject<{}>;
    infoWindows: {
        [id: string]: InfoWindow;
    };
    mapIdledOnce: boolean;
    private initializeMapAfterDisplayed;
    private apiLoaderSub;
    constructor(optionBuilder: OptionBuilder, elementRef: ElementRef, geolocation: NavigatorGeolocation, geoCoder: GeoCoder, nguiMap: MapService, apiLoader: NgMapApiLoader, zone: NgZone, _mapLoadedService: MapLoadedService);
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    ngOnChanges(changes: SimpleChanges): void;
    initializeMap(): void;
    setCenter(): void;
    openInfoWindow(id: string, anchor: google.maps.MVCObject): void;
    closeInfoWindow(id: string): void;
    ngOnDestroy(): void;
    addToMapObjectGroup(mapObjectName: string, mapObject: any): void;
    removeFromMapObjectGroup(mapObjectName: string, mapObject: any): void;
}
