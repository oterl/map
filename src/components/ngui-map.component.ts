import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    NgZone,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewEncapsulation
    } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgMapApiLoader } from '../services/api-loader';
import { GeoCoder } from '../services/geo-coder';
import { MapLoadedService } from '../services/map-loaded.service';
import { MapService } from '../services/map.service';
import { MarkerClustererProviderService } from '../services/marker-clusterer-provider.service';
import { NavigatorGeolocation } from '../services/navigator-geolocation';
import { OptionBuilder } from '../services/option-builder';
import { toCamelCase } from '../services/util';
import { CustomMarkerOverlayViewService } from './custom-marker/services/custom-marker-overlay-view.service';
import { InfoWindow } from './info-window';

const INPUTS = [
  'backgroundColor',
  'center',
  'disableDefaultUI',
  'disableDoubleClickZoom',
  'draggable',
  'draggableCursor',
  'draggingCursor',
  'fullscreenControl',
  'fullscreenControlOptions',
  'geoFallbackCenter',
  'heading',
  'keyboardShortcuts',
  'mapMaker',
  'mapTypeControl',
  'mapTypeControlOptions',
  'mapTypeId',
  'maxZoom',
  'minZoom',
  'noClear',
  'options',
  'overviewMapControl',
  'overviewMapControlOptions',
  'panControl',
  'panControlOptions',
  'rotateControl',
  'rotateControlOptions',
  'scaleControl',
  'scaleControlOptions',
  'scrollwheel',
  'streetView',
  'streetViewControl',
  'streetViewControlOptions',
  'styles',
  'tilt',
  'zoom',
  'zoomControl',
  'zoomControlOptions',
  // ngui-map-specific inputs
];

const OUTPUTS = [
  'bounds_changed',
  'center_changed',
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'heading_changed',
  'idle',
  'typeid_changed',
  'mousemove',
  'mouseout',
  'mouseover',
  'projection_changed',
  'resize',
  'rightclick',
  'tilesloaded',
  'tile_changed',
  'zoom_changed',
  // to avoid DOM event conflicts
  'mapClick',
  'mapMouseover',
  'mapMouseout',
  'mapMousemove',
  'mapDrag',
  'mapDragend',
  'mapDragstart'
];

@Component({
  selector: 'ngui-map',
  providers: [
    MapService,
    OptionBuilder,
    GeoCoder,
    NavigatorGeolocation,
    MapLoadedService,
    CustomMarkerOverlayViewService,
    MarkerClustererProviderService
],
  styles: [`
    ngui-map {display: block; height: 300px;}
    .google-map {width: 100%; height: 100%}
  `],
  inputs: INPUTS,
  outputs: OUTPUTS,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="google-map"></div>
    <ng-content></ng-content>
  `,
})
export class NguiMapComponent implements OnChanges, OnDestroy, AfterViewInit, AfterViewChecked {
  @Output() public mapReady$: EventEmitter<any> = new EventEmitter();

  public el: HTMLElement;
  public map: google.maps.Map;
  public mapOptions: google.maps.MapOptions = {};

  public inputChanges$ = new Subject();

  // map objects by group
  public infoWindows: { [id: string]: InfoWindow } = { };

  // map has been fully initialized
  public mapIdledOnce: boolean = false;

  private initializeMapAfterDisplayed = false;
  private apiLoaderSub;

  constructor(
    public optionBuilder: OptionBuilder,
    public elementRef: ElementRef,
    public geolocation: NavigatorGeolocation,
    public geoCoder: GeoCoder,
    public nguiMap: MapService,
    public apiLoader: NgMapApiLoader,
    public zone: NgZone,
    private readonly _mapLoadedService: MapLoadedService
  ) {
    apiLoader.load();

    // all outputs needs to be initialized,
    // http://stackoverflow.com/questions/37765519/angular2-directive-cannot-read-property-subscribe-of-undefined-with-outputs
    OUTPUTS.forEach(output => this[output] = new EventEmitter());
  }

  ngAfterViewInit() {
    this.apiLoaderSub = this.apiLoader.api$.subscribe(() => this.initializeMap());
  }

  ngAfterViewChecked() {
      if (this.initializeMapAfterDisplayed && this.el && this.el.offsetWidth > 0) {
        this.initializeMap();
      }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.inputChanges$.next(changes);
  }

  initializeMap(): void {
    this.el = this.elementRef.nativeElement.querySelector('.google-map');
    if (this.el && this.el.offsetWidth === 0) {
        this.initializeMapAfterDisplayed = true;
        return;
    }

    this.initializeMapAfterDisplayed = false;
    this.mapOptions = this.optionBuilder.googlizeAllInputs(INPUTS, this);

    this.mapOptions.zoom = this.mapOptions.zoom || 15;
    typeof this.mapOptions.center === 'string' && (delete this.mapOptions.center);

    this.zone.runOutsideAngular(() => {
      this.map = new google.maps.Map(this.el, this.mapOptions);
      this.map['mapObjectName'] = 'NguiMapComponent';

      if (!this.mapOptions.center) { // if center is not given as lat/lng
        this.setCenter();
      }

      // set google events listeners and emits to this outputs listeners
      this.nguiMap.setObjectEvents(OUTPUTS, this, this.map);

      this.map.addListener('idle', () => {
        if (!this.mapIdledOnce) {
          this.mapIdledOnce = true;
          setTimeout(() => { // Why????, subsribe and emit must not be in the same cycle???
            this.mapReady$.emit(this.map);
            this._mapLoadedService.loaded();
          });
        }
      });

      // update map when input changes
      this.inputChanges$
        .pipe(debounceTime(1000))
        .subscribe((changes: SimpleChanges) => this.nguiMap.updateGoogleObject(this.map, changes));

      if (typeof window !== 'undefined' && (<any>window)['nguiMapRef']) {
        // expose map object for test and debugging on (<any>window)
        (<any>window)['nguiMapRef'].map = this.map;
      }
    });
  }

  setCenter(): void {
    if (!this['center']) { // center is not from user. Thus, we set the current location
      this.geolocation.getCurrentPosition().subscribe(
        position => {
          console.log('setting map center from current location');
          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.map.setCenter(latLng);
        },
        () => {
          console.error('ngui-map: Error finding the current position');
          this.map.setCenter(this.mapOptions['geoFallbackCenter'] || new google.maps.LatLng(0, 0));
        }
      );
    }
    else if (typeof this['center'] === 'string') {
      this.geoCoder.geocode({address: this['center']}).subscribe(
        results => {
          console.log('setting map center from address', this['center']);
          this.map.setCenter(results[0].geometry.location);
        },
        () => {
          this.map.setCenter(this.mapOptions['geoFallbackCenter'] || new google.maps.LatLng(0, 0));
        });
    }
  }

  openInfoWindow(id: string, anchor: google.maps.MVCObject) {
    this.infoWindows[id].open(anchor);
  }

  closeInfoWindow(id: string) {
    // if infoWindow for id exists, close the infoWindow
    if (this.infoWindows[id])
      this.infoWindows[id].close();
  }

  ngOnDestroy() {
    this.inputChanges$.complete();
    if (this.el && !this.initializeMapAfterDisplayed) {
      this.nguiMap.clearObjectEvents(OUTPUTS, this, 'map');
    }
    if (this.apiLoaderSub) {
      this.apiLoaderSub.unsubscribe();
    }
  }

  // map.markers, map.circles, map.heatmapLayers.. etc
  addToMapObjectGroup(mapObjectName: string, mapObject: any) {
    let groupName = toCamelCase(mapObjectName.toLowerCase()) + 's'; // e.g. markers
    this.map[groupName] = this.map[groupName] || [];
    this.map[groupName].push(mapObject);
  }

  // TODO:
  // Why not just use mapObject.setMap(null);
  removeFromMapObjectGroup(mapObjectName: string, mapObject: any) {
    let groupName = toCamelCase(mapObjectName.toLowerCase()) + 's'; // e.g. markers
    if (this.map && this.map[groupName]) {
      let index = this.map[groupName].indexOf(mapObject);
      (index > -1) && this.map[groupName].splice(index, 1);
    }
  }
}
