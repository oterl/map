import {
    ChangeDetectionStrategy,
    OnChanges,
    SimpleChanges
    } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { MapService } from '../../services/map.service';
import { CustomMarkerOverlayViewService } from '../custom-marker/services/custom-marker-overlay-view.service';
import { NguiMapComponent } from '../ngui-map.component';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    } from '@angular/core';

// const INPUTS = [
//     'position'
// ];
// to avoid DOM event conflicts map_*
const OUTPUTS = [
//     'animationChanged',
     'click',
//     'clickableChanged',
//     'cursorChanged',
//     'dblclick',
//     'drag',
     'dragend',
//     'draggableChanged',
//     'dragstart',
//     'flatChanged',
//     'iconChanged',
//     'map_click',
//     'map_drag',
//     'map_dragend',
//     'map_mousedown',
//     'map_mouseout',
//     'map_mouseover',
//     'map_mouseup',
//     'mousedown',
//     'mouseout',
//     'mouseover',
//     'mouseup',
//     'positionChanged',
//     'rightclick',
//     'shapeChanged',
//     'titleChanged',
//     'visibleChanged',
//     'zindexChanged'
];

// TODO: should be directive
@Component({
    selector: 'ngui-map > custom-marker',
    // inputs: INPUTS,
    outputs: OUTPUTS,
    templateUrl: './custom-marker.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomMarkerComponent implements OnInit, OnDestroy, OnChanges {
    @Output() initialized: EventEmitter<any> = new EventEmitter();

    @Input() draggable: boolean = false;
    @Input() position: { lat: string, lng: string };
    @Input() attachToParentMap: boolean = true;

    intialized$ = new ReplaySubject(1);
    overlay: any;

    // private _inputChange: Subject<SimpleChanges> = new Subject<SimpleChanges>();
    private _el: HTMLElement;
    private readonly _destroyed$ = new Subject();

    constructor(
        private readonly _customMarkerOverlayViewService: CustomMarkerOverlayViewService,
        private readonly _nguiMapComponent: NguiMapComponent,
        private readonly _elementRef: ElementRef,
        private readonly _mapService: MapService
    ) {
        this._elementRef.nativeElement.style.display = 'none';
        OUTPUTS.forEach(output => this[output] = new EventEmitter());
    }

    ngOnInit() {
        this._customMarkerOverlayViewService.overlayDefined$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => this._init());
    }

    ngOnChanges(changes: SimpleChanges) {
        // this._inputChange.next(changes);

        if (changes['draggable'] && this.overlay) {
            this.overlay.setDraggable(this.draggable);
        }

        if (changes['position'] && this.overlay) {
            this.overlay.setPosition(
                new google.maps.LatLng(
                    +this.position.lat,
                    +this.position.lng
                )
            );
        }
    }

    ngOnDestroy() {
        // this._inputChange.complete();
        // TODO not sure if this is needed
        // this.overlay.setMap(null);
        // this.nguiMapComponent.removeFromMapObjectGroup('CustomMarker', this._markerOverlay);

        if (this.overlay) {
            this._mapService.clearObjectEvents(OUTPUTS, this, 'overlay');
        }
    }

    private _init(): void {
        this._el = this._elementRef.nativeElement;

        this.overlay = new this._customMarkerOverlayViewService.CustomMarkerOverlayView(
            this._el,
            this['position'],
            this.draggable
        );

        if (this.attachToParentMap) {
            this.overlay.setMap(this._nguiMapComponent.map);
        }

        // set google events listeners and emits to this outputs listeners
        // TODO: I dont this this is needed
        this._mapService.setObjectEvents(OUTPUTS, this, this.overlay);

        // update object when input changes
        // TODO: makes sense to remove that for performance
        // this._inputChange
        //     .pipe(debounceTime(1000))
        //     .subscribe((changes: SimpleChanges) =>
        //         this._mapService.updateGoogleObject(this._markerOverlay, changes));

        // this.nguiMapComponent.addToMapObjectGroup('CustomMarker', this._markerOverlay);
        this.initialized.emit(this.overlay);
        this.intialized$.next(this.overlay);
    }
}
