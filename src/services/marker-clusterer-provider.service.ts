import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    map,
    publishReplay,
    refCount
    } from 'rxjs/operators';
import { loadScript } from '../services/util';

@Injectable()
export class MarkerClustererProviderService {
    private MarkerClusterer$: Observable<typeof MarkerClusterer>;

    // Docs here: http://htmlpreview.github.io/?https://github.com/googlemaps/v3-utility-library/blob/master/markerclustererplus/docs/reference.html
    private clustererLibUrl = 'https://cdnjs.cloudflare.com/ajax/libs/markerclustererplus/2.1.4/markerclusterer.min.js';

    getClusterer(): Observable<typeof MarkerClusterer> {
        if (!this.MarkerClusterer$) {
            this.MarkerClusterer$ = loadScript(
                this.clustererLibUrl,
                'marker-clusterer',
                window)
            .pipe(
                map(() => MarkerClusterer),
                publishReplay(1),
                refCount()
            );
        }

        return this.MarkerClusterer$;
    }
}