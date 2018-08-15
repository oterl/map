import { OnChanges, SimpleChanges } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MapService } from '../../services/map.service';
import { CustomMarkerOverlayViewService } from '../custom-marker/services/custom-marker-overlay-view.service';
import { NguiMapComponent } from '../ngui-map.component';
import { ElementRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
export declare class CustomMarkerComponent implements OnInit, OnDestroy, OnChanges {
    private readonly _customMarkerOverlayViewService;
    private readonly _nguiMapComponent;
    private readonly _elementRef;
    private readonly _mapService;
    initialized: EventEmitter<any>;
    draggable: boolean;
    position: {
        lat: string;
        lng: string;
    };
    attachToParentMap: boolean;
    intialized$: ReplaySubject<{}>;
    overlay: any;
    private _el;
    private readonly _destroyed$;
    constructor(_customMarkerOverlayViewService: CustomMarkerOverlayViewService, _nguiMapComponent: NguiMapComponent, _elementRef: ElementRef, _mapService: MapService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    private _init;
}
