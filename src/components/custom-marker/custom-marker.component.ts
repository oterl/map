import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
    } from '@angular/core';
import {
    debounceTime,
    takeUntil
    } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { MapService } from '../../services/ngui-map';
import { CustomMarkerOverlayViewService } from '../custom-marker/services/custom-marker-overlay-view.service';
import { NguiMapComponent } from '../ngui-map.component';

const INPUTS = [
    'position'
];
// to avoid DOM event conflicts map_*
const OUTPUTS = [
    'animationChanged',
    'click',
    'clickableChanged',
    'cursorChanged',
    'dblclick',
    'drag',
    'dragend',
    'draggableChanged',
    'dragstart',
    'flatChanged',
    'iconChanged',
    'map_click',
    'map_drag',
    'map_dragend',
    'map_mousedown',
    'map_mouseout',
    'map_mouseover',
    'map_mouseup',
    'mousedown',
    'mouseout',
    'mouseover',
    'mouseup',
    'positionChanged',
    'rightclick',
    'shapeChanged',
    'titleChanged',
    'visibleChanged',
    'zindexChanged'
];

@Component({
    selector: 'ngui-map > custom-marker',
    // inputs: INPUTS,
    // outputs: OUTPUTS,
    templateUrl: './custom-marker.component.html',
})
export class CustomMarkerComponent implements OnInit, OnDestroy, OnChanges {
    @Output() initialized: EventEmitter<any> = new EventEmitter();

    @Input() position: any;

    // private _inputChange: Subject<SimpleChanges> = new Subject<SimpleChanges>();
    private _el: HTMLElement;
    private _markerOverlay: any;
    private readonly _destroyed$ = new Subject();

    constructor(
        private readonly _customMarkerOverlayViewService: CustomMarkerOverlayViewService,
        private nguiMapComponent: NguiMapComponent,
        private elementRef: ElementRef,
        private _mapService: MapService
    ) {
        this.elementRef.nativeElement.style.display = 'none';
        // OUTPUTS.forEach(output => this[output] = new EventEmitter());
    }

    ngOnInit() {
        this._customMarkerOverlayViewService.overlayDefined$
            .pipe(takeUntil(this._destroyed$))
            .subscribe(() => this._init());
    }

    ngOnChanges(changes: SimpleChanges) {
        // this._inputChange.next(changes);
    }

    ngOnDestroy() {
        // this._inputChange.complete();
        this.nguiMapComponent.removeFromMapObjectGroup('CustomMarker', this._markerOverlay);

        // if (this._markerOverlay) {
        //     this._mapService.clearObjectEvents(OUTPUTS, this, 'mapObject');
        // }
    }

    private _init(): void {
        this._el = this.elementRef.nativeElement;

        this._markerOverlay = new this._customMarkerOverlayViewService.CustomMarkerOverlayView(
            this._el, this['position']
        );

        this._markerOverlay.setMap(this.nguiMapComponent.map);

        // set google events listeners and emits to this outputs listeners
        // TODO: I dont this this is needed
        // this._mapService.setObjectEvents(OUTPUTS, this, 'mapObject');

        // update object when input changes
        // TODO: makes sense to remove that for performance
        // this._inputChange
        //     .pipe(debounceTime(1000))
        //     .subscribe((changes: SimpleChanges) =>
        //         this._mapService.updateGoogleObject(this._markerOverlay, changes));

        this.nguiMapComponent.addToMapObjectGroup('CustomMarker', this._markerOverlay);
        this.initialized.emit(this._markerOverlay);
    }
}
