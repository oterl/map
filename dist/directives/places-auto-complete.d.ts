/// <reference types="googlemaps" />
import { NgMapApiLoader } from '../services/api-loader';
import { OptionBuilder } from '../services/option-builder';
import { EventEmitter, ElementRef } from '@angular/core';
export declare class PlacesAutoComplete {
    optionBuilder: OptionBuilder;
    elementRef: ElementRef;
    apiLoader: NgMapApiLoader;
    bounds: any;
    componentRestrictions: any;
    types: string[];
    place_changed: EventEmitter<any>;
    initialized$: EventEmitter<any>;
    objectOptions: any;
    autocomplete: google.maps.places.Autocomplete;
    constructor(optionBuilder: OptionBuilder, elementRef: ElementRef, apiLoader: NgMapApiLoader);
    initialize: () => void;
}
