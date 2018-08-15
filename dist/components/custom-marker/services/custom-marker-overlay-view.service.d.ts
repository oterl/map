import { Observable } from 'rxjs';
import { MapLoadedService } from '../../../services/map-loaded.service';
export declare class CustomMarkerOverlayViewService {
    readonly _mapLoadedService: MapLoadedService;
    CustomMarkerOverlayView: any;
    overlayDefined$: Observable<boolean>;
    constructor(_mapLoadedService: MapLoadedService);
}
