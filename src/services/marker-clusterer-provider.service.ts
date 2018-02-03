import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    first,
    map,
    tap
    } from 'rxjs/operators';
import { loadScript } from '../services/util';

@Injectable()
export class MarkerClustererProviderService {
    private MarkerClusterer: typeof MarkerClusterer;
    // private clustererLibUrl = 'https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js';
    private clustererLibUrl = 'https://cdnjs.cloudflare.com/ajax/libs/markerclustererplus/2.1.4/markerclusterer.min.js';

    getClusterer(): Observable<typeof MarkerClusterer> {
        if (this.MarkerClusterer) {
            return Observable.of(this.MarkerClusterer);
        }

        return loadScript(this.clustererLibUrl, 'marker-clusterer', window)
            .pipe(
                map(() => MarkerClusterer),
                tap(() => { this.MarkerClusterer = MarkerClusterer; }),
                first()
            );
    }
}