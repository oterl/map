/// <reference types="googlemaps" />
import { NgZone, SimpleChanges } from '@angular/core';
import { GeoCoder } from './geo-coder';
import { OptionBuilder } from './option-builder';
/**
 * collection of map instance-related properties and methods
 */
export declare class MapService {
    private geoCoder;
    private optionBuilder;
    private zone;
    constructor(geoCoder: GeoCoder, optionBuilder: OptionBuilder, zone: NgZone);
    /**
     * Listens for map object events and calls respective emit component methods
     * @param definedEvents List of events that map object supports
     * @param componentInstance Instance of Angular component
     * @param mapObject Map object that is compatible with Google Maps
     */
    setObjectEvents(definedEvents: string[], componentInstance: any, mapObject: {
        addListener(eventName: string, callback: (event: google.maps.event) => void): void;
    }): void;
    clearObjectEvents(definedEvents: string[], thisObj: any, prefix: string): void;
    updateGoogleObject: (object: any, changes: SimpleChanges) => void;
    private normalizeEventName;
}
