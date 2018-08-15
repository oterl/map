/// <reference types="googlemaps" />
import { ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { MapService } from '../services/map.service';
import { NguiMapComponent } from './ngui-map.component';
export declare class InfoWindow implements OnInit, OnChanges, OnDestroy {
    private elementRef;
    private nguiMap;
    private nguiMapComponent;
    initialized$: EventEmitter<any>;
    infoWindow: google.maps.InfoWindow;
    objectOptions: google.maps.InfoWindowOptions;
    inputChanges$: Subject<{}>;
    template: ViewContainerRef;
    constructor(elementRef: ElementRef, nguiMap: MapService, nguiMapComponent: NguiMapComponent);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    initialize(): void;
    open(anchor: google.maps.MVCObject): void;
    close(): void;
    ngOnDestroy(): void;
}
