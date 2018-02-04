import {
    AfterContentInit,
    ContentChildren,
    Directive,
    Input,
    OnInit,
    QueryList
    } from '@angular/core';
import {
    AfterContentChecked,
    OnDestroy
    } from '@angular/core/src/metadata/lifecycle_hooks';
import { prop as propR } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { combineLatest as cl } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/operators/combineLatest';
import { CustomMarkerComponent } from '../components/custom-marker/custom-marker.component';
import { NguiMapComponent } from '../components/ngui-map.component';
import { MapLoadedService } from '../services/map-loaded.service';
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
        <g fill="${color}">
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

@Directive({
    selector: 'custom-marker-cluster'
})
export class CustomMarkerClusterDirective implements OnInit, AfterContentChecked, OnDestroy {
    @Input() imageRow: string;
    @Input() color: string;

    @ContentChildren(CustomMarkerComponent)
    customMarkers: QueryList<CustomMarkerComponent>;

    cluster: MarkerClusterer;
    markerOverlays: any[];

    private MarkerClusterer: typeof MarkerClusterer;
    private _map: google.maps.Map;

    constructor(
        private readonly _markerClustererProviderService: MarkerClustererProviderService,
        private readonly _mapLoadedService: MapLoadedService,
        private readonly _nguiMapComponent: NguiMapComponent
    ) { }

    ngOnInit(): void {
        this._nguiMapComponent.mapReady$
            .pipe(
                combineLatest(this._markerClustererProviderService.getClusterer()),
                first())
            .subscribe(([, MarkerClusterer]) => {
                this.MarkerClusterer = MarkerClusterer;
                this._map = this._nguiMapComponent.map;
                this._initCluster();
            });
    }

    ngAfterContentChecked(): void {
        (this.customMarkers.length === 0
            ? Observable.of([])
            : cl(
                ...this.customMarkers.map(
                    (customMarkerCmp: CustomMarkerComponent) =>
                            customMarkerCmp.intialized$)))
                .subscribe((overlays: any[]) => {
                    this.markerOverlays = overlays;
                    this.cluster
                        ? this._reloadClusterOverlays()
                        : this._initCluster();
                });
    }

    ngOnDestroy(): void {
        this._removeCluster();
    }

    private _initCluster() {
        if (this.cluster) {
            this._removeCluster();
        }

        if (!this.MarkerClusterer ||
            !this._map ||
            !this.markerOverlays) {
            return;
        }

        this.cluster = new this.MarkerClusterer(
            this._map,
            this.markerOverlays,
            { styles: this._getClusterStyles() }
        );
    }

    private _removeCluster() {
        this.cluster.setMap(null);
        this.cluster = null;
    }

    private _reloadClusterOverlays() {
        if (!this.cluster || ! this.markerOverlays) {
            return;
        }

        this.cluster.clearMarkers();

        this.cluster.addMarkers(this.markerOverlays);
    }

    private _getClusterStyles() {
        return [{
            width: 40,
            height: 40,
            url: this._getGoogleClusterInlineSvg(),
            textColor: 'white',
            textSize: 12
        }];
    }

    private _getGoogleClusterInlineSvg() {
        const encoded = window.btoa(
            this.imageRow || getDefaultImageInline(this.color)
        );

        return `data:image/svg+xml;base64,${encoded}`;
    }
}