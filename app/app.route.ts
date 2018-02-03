import { ModuleWithProviders } from '@angular/core';
import {
    RouterModule,
    Routes
    } from '@angular/router';
import { BicyclingLayerComponent } from './map-components/bicycling-layer.component';
import { CustomMarkerDemoComponent } from './map-components/custom-marker-demo.component';
import { CustomMarkerNgForComponent } from './map-components/custom-marker-ng-for.component';
import { DataLayerComponent } from './map-components/data-layer.component';
import { DirectionsRendererComponent } from './map-components/directions-renderer.component';
import { DrawingManagerComponent } from './map-components/drawing-manager.component';
import { EventArgumentsComponent } from './map-components/event-arguments.component';
import { ExperimentComponent } from './map-components/experiment.component';
import { HeatmapLayerComponent } from './map-components/heatmap-layer.component';
import { KmlLayerComponent } from './map-components/kml-layer.component';
import { MapChangeMultiplePropertiesComponent } from './map-components/map-change-multiple-properties.component';
import { MapWithOptionsComponent } from './map-components/map-with-options.component';
import { MapWithStreetviewComponent } from './map-components/map-with-streetview.component';
import { MarkerClustersComponent } from './map-components/marker-clusters.component';
import { MarkerNgForComponent } from './map-components/marker-ng-for.component';
import { MarkerWithCustomIconComponent } from './map-components/marker-with-custom-icon.component';
import { MultipleMapComponent } from './map-components/multiple-map.component';
import { PlacesAutoCompleteComponent } from './map-components/places-auto-complete.component';
import { PolygonComponent } from './map-components/polygon.component';
import { SimpleCircleComponent } from './map-components/simple-circle.component';
import { SimpleGroundOverlayComponent } from './map-components/simple-ground-overlay.component';
import { SimpleInfoWindowComponent } from './map-components/simple-info-window.component';
import { SimpleMapComponent } from './map-components/simple-map.component';
import { SimpleMarkerComponent } from './map-components/simple-marker.component';
import { SimplePolylineComponent } from './map-components/simple-polyline.component';
import { StreetViewPanoramaComponent } from './map-components/street-view-panorama.component';
import { TrafficLayerComponent } from './map-components/traffic-layer.component';
import { TransitLayerComponent } from './map-components/transit-layer.component';

export const routes: Routes = [
  { path: 'bicycling-layer', component: BicyclingLayerComponent },
  { path: 'data-layer', component: DataLayerComponent },
  { path: 'directions-renderer', component: DirectionsRendererComponent },
  { path: 'drawing-manager', component: DrawingManagerComponent },
  { path: 'heatmap-layer', component: HeatmapLayerComponent },
  { path: 'kml-layer', component: KmlLayerComponent },
  { path: 'map-with-options', component: MapWithOptionsComponent },
  { path: 'map-with-streetview', component: MapWithStreetviewComponent },
  { path: 'map-change-multiple-properties', component: MapChangeMultiplePropertiesComponent },
  { path: 'marker-ng-for', component: MarkerNgForComponent },
  { path: 'marker-with-custom-icon', component: MarkerWithCustomIconComponent},
  { path: 'multiple-map', component: MultipleMapComponent },
  { path: 'places-auto-complete', component: PlacesAutoCompleteComponent },
  { path: 'polygon', component: PolygonComponent },
  { path: 'simple-circle', component: SimpleCircleComponent },
  { path: 'simple-ground-overlay', component: SimpleGroundOverlayComponent },
  { path: 'simple-info-window', component: SimpleInfoWindowComponent },
  { path: 'simple-map', component: SimpleMapComponent },
  { path: 'simple-marker', component: SimpleMarkerComponent },
  { path: 'simple-polyline', component: SimplePolylineComponent },
  { path: 'street-view-panorama', component: StreetViewPanoramaComponent },
  { path: 'traffic-layer', component: TrafficLayerComponent },
  { path: 'transit-layer', component: TransitLayerComponent },
  { path: 'event-arguments', component: EventArgumentsComponent },
  { path: 'custom-marker', component: CustomMarkerDemoComponent },
  { path: 'custom-marker-ng-for', component: CustomMarkerNgForComponent },
  { path: 'experiment', component: ExperimentComponent },
  { path: 'marker-clusters', component: MarkerClustersComponent },
  { path: '',  redirectTo: '/simple-marker', pathMatch: 'full' },
];

export const APP_ROUTER_PROVIDERS: ModuleWithProviders = RouterModule.forRoot(routes);
export const APP_ROUTER_COMPONENTS = [
CustomMarkerDemoComponent,
  BicyclingLayerComponent,
  DataLayerComponent,
  DirectionsRendererComponent,
  DrawingManagerComponent,
  EventArgumentsComponent,
  HeatmapLayerComponent,
  KmlLayerComponent,
  MapWithOptionsComponent,
  MapWithStreetviewComponent,
  MapChangeMultiplePropertiesComponent,
  MarkerNgForComponent,
  MultipleMapComponent,
  PlacesAutoCompleteComponent,
  PolygonComponent,
  SimpleCircleComponent,
  SimpleGroundOverlayComponent,
  SimpleInfoWindowComponent,
  SimpleMapComponent,
  SimpleMarkerComponent,
  SimplePolylineComponent,
  StreetViewPanoramaComponent,
  TrafficLayerComponent,
  TransitLayerComponent,
  CustomMarkerDemoComponent,
  CustomMarkerNgForComponent,
  MarkerWithCustomIconComponent,
  ExperimentComponent,
  MarkerClustersComponent
];

