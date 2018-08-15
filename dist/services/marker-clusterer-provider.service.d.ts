/// <reference types="markerclustererplus" />
import { Observable } from 'rxjs';
export declare class MarkerClustererProviderService {
    private MarkerClusterer$;
    private clustererLibUrl;
    getClusterer(): Observable<typeof MarkerClusterer>;
}
