import { Injectable } from '@angular/core';
import {
    Observable,
    ReplaySubject
    } from 'rxjs';
import {
    filter,
    first
    } from 'rxjs/operators';
import { MapLoadedService } from '../../../services/map-loaded.service';
import { CustomMarkerOverlayView } from '../mixins/custom-marker-overlay-view.mixin';

@Injectable()
export class CustomMarkerOverlayViewService {
    CustomMarkerOverlayView;

    overlayDefined$: Observable<boolean>;

    constructor(
        readonly _mapLoadedService: MapLoadedService
    ) {
        const _overlayDefined$ = new ReplaySubject<boolean>();
        this.overlayDefined$ = _overlayDefined$.asObservable();

        _mapLoadedService.loaded$
            .pipe(
                filter(Boolean),
                first())
            .subscribe(() => {
                this.CustomMarkerOverlayView = CustomMarkerOverlayView(
                    google.maps.OverlayView
                );
                _overlayDefined$.next(true);
            });
    }
}