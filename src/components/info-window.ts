import {
    Component,
    ElementRef,
    EventEmitter,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
    } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MapService } from '../services/map.service';
import { NguiMapComponent } from './ngui-map.component';

const INPUTS = [
  'content', 'disableAutoPan', 'maxWidth', 'pixelOffset', 'position', 'zIndex', 'options'
];
const OUTPUTS = [
  'closeclick', 'content_changed', 'domready', 'position_changed', 'zindex_changed'
];

@Component({
  selector: 'ngui-map > info-window',
  inputs: INPUTS,
  outputs: OUTPUTS,
  template: `<div #template><ng-content></ng-content></div>`,
})
export class InfoWindow implements OnInit, OnChanges, OnDestroy {
  @Output() initialized$: EventEmitter<any> = new EventEmitter();

  public infoWindow: google.maps.InfoWindow;
  public objectOptions: google.maps.InfoWindowOptions = {};
  public inputChanges$ = new Subject();
  @ViewChild('template', {read: ViewContainerRef}) template: ViewContainerRef;

  constructor(
    private elementRef: ElementRef,
    private nguiMap: MapService,
    private nguiMapComponent: NguiMapComponent,
  ) {
    this.elementRef.nativeElement.style.display = 'none';
    OUTPUTS.forEach(output => this[output] = new EventEmitter());
  }

  // Initialize this map object when map is ready
  ngOnInit() {
    if (this.nguiMapComponent.mapIdledOnce) { // map is ready already
      this.initialize();
    } else {
      this.nguiMapComponent.mapReady$.subscribe(() => this.initialize());
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.inputChanges$.next(changes);
  }

  // called when map is ready
  initialize(): void {
    this.objectOptions = this.nguiMapComponent.optionBuilder.googlizeAllInputs(INPUTS, this);
    this.infoWindow = new google.maps.InfoWindow(this.objectOptions);
    this.infoWindow['mapObjectName'] = 'InfoWindow';

    // register infoWindow ids to NguiMap, so that it can be opened by id
    if (this.elementRef.nativeElement.id) {
      this.nguiMapComponent.infoWindows[this.elementRef.nativeElement.id] = this;
    } else {
      console.error('An InfoWindow must have an id. e.g. id="detail"');
    }

    // set google events listeners and emits to this outputs listeners
    this.nguiMap.setObjectEvents(OUTPUTS, this, this.infoWindow);

    // update object when input changes
    this.inputChanges$
        .pipe(debounceTime(1000))
        .subscribe((changes: SimpleChanges) => this.nguiMap.updateGoogleObject(this.infoWindow, changes));

    this.nguiMapComponent.addToMapObjectGroup('InfoWindow', this.infoWindow);
    this.initialized$.emit(this.infoWindow);
  }

  open(anchor: google.maps.MVCObject) {
    // set content and open it
    this.infoWindow.setContent(this.template.element.nativeElement);
    this.infoWindow.open(this.nguiMapComponent.map, anchor);
  }
  close() {
    // check if infoWindow exists, and closes it
    if (this.infoWindow)
      this.infoWindow.close();
  }
  ngOnDestroy() {
    this.inputChanges$.complete();
    if (this.infoWindow) {
      this.nguiMap.clearObjectEvents(OUTPUTS, this, 'infoWindow');
      delete this.infoWindow;
    }
  }
}
