import { Injectable } from '@angular/core';
import {
    BehaviorSubject,
    Observable
    } from 'rxjs';

@Injectable()
export class MapLoadedService {
    loaded$: Observable<boolean>;
    private readonly _loaded$: BehaviorSubject<boolean>;

    constructor() {
        this._loaded$ = new BehaviorSubject(false);
        this.loaded$ = this._loaded$.asObservable();
    }

    isLoaded = (): boolean => {
        return this._loaded$.value;
    }

    loaded = (loaded: boolean = true) => {
        this._loaded$.next(loaded);
    }
}