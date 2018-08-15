/// <reference types="markerclustererplus" />
import { OnDestroy, OnInit, QueryList } from '@angular/core';
import { CustomMarkerComponent } from '../components/custom-marker/custom-marker.component';
import { NguiMapComponent } from '../components/ngui-map.component';
import { MapLoadedService } from '../services/map-loaded.service';
import { MapService } from '../services/map.service';
import { MarkerClustererProviderService } from '../services/marker-clusterer-provider.service';
export declare class CustomMarkerClusterDirective implements OnInit, OnDestroy {
    private readonly _markerClustererProviderService;
    private readonly _mapLoadedService;
    private readonly _mapService;
    private readonly _nguiMapComponent;
    /**
     * Default styles are: {
     *     width: 40,
     *     height: 40,
     *     textColor: 'white',
     *     textSize: 12,
     *     url: undefined
     * }
     */
    clusterStyles: ClusterIconStyle;
    /**
     * Image of cluster
     * In case rawImage is provided color property will not be used
     */
    rawImage: string;
    /**
     * Color of the cluster image, this cannot be changed during cluster life
     * But that can be done if needed
     */
    color: string;
    /**
     * Configuration options for marker clusterer
     * Default options are { averageCenter: true, maxZoom: 12 }
     * Dont use styles because these will be overriden
     */
    options: MarkerClustererOptions;
    customMarkers: QueryList<CustomMarkerComponent>;
    cluster: MarkerClusterer;
    private readonly _defaultOptions;
    private readonly _defaultClusterStyles;
    private MarkerClusterer;
    private _clusterStyles;
    private _options;
    private _markerOverlays;
    private _map;
    private _customMarkers;
    constructor(_markerClustererProviderService: MarkerClustererProviderService, _mapLoadedService: MapLoadedService, _mapService: MapService, _nguiMapComponent: NguiMapComponent);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private _updateMarkers;
    private _initCluster;
    private _removeCluster;
    private _reloadClusterOverlays;
    private _getClusterStyles;
    private _getGoogleClusterInlineSvg;
}
