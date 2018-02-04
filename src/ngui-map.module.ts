import { CommonModule } from '@angular/common';
import {
    ModuleWithProviders,
    NgModule
    } from '@angular/core';
import { CustomMarkerComponent } from './components/custom-marker/custom-marker.component';
import { InfoWindow } from './components/info-window';
import { NguiMapComponent } from './components/ngui-map.component';
import { BicyclingLayer } from './directives/bicycling-layer';
import { Circle } from './directives/circle';
import { CustomMarkerClusterDirective } from './directives/custom-marker-cluster.directive';
import { DataLayer } from './directives/data-layer';
import { DirectionsRenderer } from './directives/directions-renderer';
import { DrawingManager } from './directives/drawing-manager';
import { GroundOverlay } from './directives/ground-overlay';
import { HeatmapLayer } from './directives/heatmap-layer';
import { KmlLayer } from './directives/kml-layer';
import { Marker } from './directives/marker';
import { PlacesAutoComplete } from './directives/places-auto-complete';
import { Polygon } from './directives/polygon';
import { Polyline } from './directives/polyline';
import { StreetViewPanorama } from './directives/street-view-panorama';
import { TrafficLayer } from './directives/traffic-layer';
import { TransitLayer } from './directives/transit-layer';
import {
    NgMapApiLoader,
    NgMapAsyncApiLoader
    } from './services/api-loader';
import {
    ConfigOption,
    NG_MAP_CONFIG_TOKEN
    } from './services/config';
import { GeoCoder } from './services/geo-coder';
import { MapService } from './services/map.service';
import { NavigatorGeolocation } from './services/navigator-geolocation';
import { OptionBuilder } from './services/option-builder';

const COMPONENTS_DIRECTIVES = [
    BicyclingLayer,
    Circle,
    CustomMarkerClusterDirective,
    CustomMarkerComponent,
    DataLayer,
    DirectionsRenderer,
    DrawingManager,
    GroundOverlay,
    HeatmapLayer,
    InfoWindow,
    InfoWindow,
    KmlLayer,
    Marker,
    NguiMapComponent,
    PlacesAutoComplete,
    Polygon,
    Polyline,
    StreetViewPanorama,
    TrafficLayer,
    TransitLayer,
];

@NgModule({
    imports: [CommonModule],
    declarations: COMPONENTS_DIRECTIVES,
    exports: [COMPONENTS_DIRECTIVES],
    providers: [
        GeoCoder,
        NavigatorGeolocation,
        MapService,
        OptionBuilder,
        { provide: NgMapApiLoader, useClass: NgMapAsyncApiLoader }
    ]
})
export class NguiMapModule {
  static forRoot(config: ConfigOption = {}): ModuleWithProviders {
    return {
      ngModule: NguiMapModule,
      providers: [{ provide: NG_MAP_CONFIG_TOKEN, useValue: config }]
    };
  }
}
