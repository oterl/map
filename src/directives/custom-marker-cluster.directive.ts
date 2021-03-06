import {
    ContentChildren,
    Directive,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    QueryList
    } from '@angular/core';
import { combineLatest as combine ,  of } from 'rxjs';
import {
    combineLatest,
    filter,
    first
    } from 'rxjs/operators';
import { CustomMarkerComponent } from '../components/custom-marker/custom-marker.component';
import { NguiMapComponent } from '../components/ngui-map.component';
import { MapLoadedService } from '../services/map-loaded.service';
import { MapService } from '../services/map.service';
import { MarkerClustererProviderService } from '../services/marker-clusterer-provider.service';

const getDefaultImageInline = (color: string = '#004b7a') => `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="-100 -100 200 200">
        <defs>
            <g
                id="a"
                transform="rotate(45)">
                <path
                    d="M0 47A47 47 0 0 0 47 0L62 0A62 62 0 0 1 0 62Z"
                    fill-opacity="0.7"/>
                <path
                    d="M0 67A67 67 0 0 0 67 0L81 0A81 81 0 0 1 0 81Z"
                    fill-opacity="0.5"/>
                <path
                    d="M0 86A86 86 0 0 0 86 0L100 0A100 100 0 0 1 0 100Z"
                    fill-opacity="0.3"/>
            </g>
        </defs>
        <g transform="rotate(${Math.round(Math.random() * 120)})" fill="${color}">
            <circle r="42"/>
            <g>
                <use xlink:href="#a"/>
            </g>
            <g transform="rotate(120)">
                <use xlink:href="#a"/>
            </g>
            <g transform="rotate(240)">
                <use xlink:href="#a"/>
            </g>
        </g>
    </svg>
`;

const outputs = [
    'click',
    'clusteringbegin',
    'clusteringend',
    'mouseout',
    'mouseover'
];

@Directive({
    selector: 'custom-marker-cluster',
    outputs
})
export class CustomMarkerClusterDirective implements OnInit, OnDestroy {
    /**
     * Default styles are: {
     *     width: 40,
     *     height: 40,
     *     textColor: 'white',
     *     textSize: 12,
     *     url: undefined
     * }
     */
    @Input() set clusterStyles(clusterStyles: ClusterIconStyle) {
        this._clusterStyles = {
            ...this._defaultClusterStyles,
            ...clusterStyles || {}
        };
    }

    /**
     * Image of cluster
     * In case rawImage is provided color property will not be used
     */
    @Input() rawImage: string;

    /**
     * Color of the cluster image, this cannot be changed during cluster life
     * But that can be done if needed
     */
    @Input() color: string;

    /**
     * Configuration options for marker clusterer
     * Default options are { averageCenter: true, maxZoom: 12 }
     * Dont use styles because these will be overriden
     */
    @Input() set options(options: MarkerClustererOptions) {
        this._options = { ...this._defaultOptions, ...(options || {}) };
    }

    @ContentChildren(CustomMarkerComponent)
    set customMarkers (customMarkers: QueryList<CustomMarkerComponent>) {
        this._customMarkers = customMarkers;
        this._updateMarkers();
    }

    cluster: MarkerClusterer;

    private readonly _defaultOptions = { averageCenter: true, maxZoom: 12 };
    private readonly _defaultClusterStyles = {
        width: 40,
        height: 40,
        textColor: 'white',
        textSize: 12,
        url: undefined
    };

    private MarkerClusterer: typeof MarkerClusterer;
    private _clusterStyles: ClusterIconStyle = this._defaultClusterStyles;
    private _options: MarkerClustererOptions = this._defaultOptions;
    private _markerOverlays: any[];
    private _map: google.maps.Map;
    private _customMarkers: QueryList<CustomMarkerComponent>;

    constructor(
        private readonly _markerClustererProviderService: MarkerClustererProviderService,
        private readonly _mapLoadedService: MapLoadedService,
        private readonly _mapService: MapService,
        private readonly _nguiMapComponent: NguiMapComponent
    ) {
        outputs.forEach((eventName: string) => this[eventName] = new EventEmitter());
    }

    ngOnInit(): void {
        this._mapLoadedService.loaded$
            .pipe(
                filter(Boolean),
                combineLatest(this._markerClustererProviderService.getClusterer()),
                first())
            .subscribe(([, MarkerClusterer]) => {
                this.MarkerClusterer = MarkerClusterer;
                this._map = this._nguiMapComponent.map;
                this._initCluster();
            });
    }

    ngOnDestroy(): void {
        this._removeCluster();
    }

    private _updateMarkers() {
        (this._customMarkers.length === 0
            ? of([])
            : combine(
                ...this._customMarkers.map(
                    (customMarkerCmp: CustomMarkerComponent) =>
                            customMarkerCmp.intialized$)))
                .subscribe((overlays: any[]) => {
                    this._markerOverlays = overlays;
                    this.cluster
                        ? this._reloadClusterOverlays()
                        : this._initCluster();
                });
    }

    private _initCluster(): void {
        if (this.cluster) {
            this._removeCluster();
        }

        if (!this.MarkerClusterer ||
            !this._map ||
            !this._markerOverlays) {
            return;
        }

        this.cluster = new this.MarkerClusterer(
            this._map,
            this._markerOverlays,
            { ...this._options, styles: this._getClusterStyles() }
        );

        this._mapService.setObjectEvents(outputs, this, this.cluster);
    }

    private _removeCluster(): void {
        this.cluster && this.cluster.clearMarkers();
        this._mapService.clearObjectEvents(outputs, this, 'cluster');
    }

    private _reloadClusterOverlays(): void {
        if (!this.cluster || ! this._markerOverlays) {
            return;
        }

        this.cluster.clearMarkers();

        this.cluster.addMarkers(this._markerOverlays);
    }

    private _getClusterStyles() {
        return [{
            ...this._clusterStyles,
            url: this._getGoogleClusterInlineSvg(),
        }];
    }

    private _getGoogleClusterInlineSvg() {
        const encoded = window.btoa(
            this.rawImage || getDefaultImageInline(this.color)
        );

        return `data:image/svg+xml;base64,${encoded}`;
    }
}