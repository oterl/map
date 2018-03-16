import {
    Directive,
    OnInit
    } from '@angular/core';
import { NguiMapComponent } from '../components/ngui-map.component';
import { BaseMapDirective } from './base-map-directive';


const INPUTS = [
  'anchorPoint', 'animation', 'clickable', 'cursor', 'draggable', 'icon', 'label', 'opacity',
  'optimized', 'place', 'position', 'shape', 'title', 'visible', 'zIndex', 'options',
  // ngui-map specific inputs
  'geoFallbackPosition'
];
const OUTPUTS = [
  'animationChanged', 'click', 'clickableChanged', 'cursorChanged', 'dblclick', 'drag', 'dragend', 'draggableChanged',
  'dragstart', 'flatChanged', 'iconChanged', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'positionChanged', 'rightclick',
  'shapeChanged', 'titleChanged', 'visibleChanged', 'zindexChanged'
];

@Directive({
  selector: 'ngui-map > marker',
  inputs: INPUTS,
  outputs: OUTPUTS,
})
export class Marker extends BaseMapDirective implements OnInit {
  public mapObject: google.maps.Marker;
  public objectOptions: google.maps.MarkerOptions = <google.maps.MarkerOptions>{};

  constructor(private nguiMapComp: NguiMapComponent) {
    super(nguiMapComp, 'Marker', INPUTS, OUTPUTS);
  }

  // Initialize this map object when map is ready
  ngOnInit() {
    if (this.nguiMapComponent.mapIdledOnce) { // map is ready already
      this.initialize();
    } else {
      this.nguiMapComponent.mapReady$.subscribe(() => this.initialize());
    }
  }

  initialize(): void {
    super.initialize();
    this.setPosition();
  }

  setPosition(): void {
    if (!this['position']) {
      this._subscriptions.push(this.nguiMapComp.geolocation.getCurrentPosition().subscribe(
        position => {
          let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.mapObject.setPosition(latLng);
        },
        () => {
          this.mapObject.setPosition(this.objectOptions['geoFallbackPosition'] || new google.maps.LatLng(0, 0));
        }
      ));
    } else if (typeof this['position'] === 'string') {
      this._subscriptions.push(this.nguiMapComp.geoCoder.geocode({address: this['position']}).subscribe(
        results => {
          this.mapObject.setPosition(results[0].geometry.location);
        },
        () => {
          this.mapObject.setPosition(this.objectOptions['geoFallbackPosition'] || new google.maps.LatLng(0, 0));
        }
      ));
    }
  }
}
