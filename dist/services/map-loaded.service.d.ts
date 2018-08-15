import { Observable } from 'rxjs';
export declare class MapLoadedService {
    loaded$: Observable<boolean>;
    private readonly _loaded$;
    constructor();
    isLoaded: () => boolean;
    loaded: (loaded?: boolean) => void;
}
