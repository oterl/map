import { EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NguiMapComponent } from '../components/ngui-map.component';
import { MapService } from '../services/map.service';
import { OptionBuilder } from '../services/option-builder';
export declare abstract class BaseMapDirective implements OnInit, OnChanges, OnDestroy {
    protected nguiMapComponent: NguiMapComponent;
    mapObjectName: string;
    protected inputs: string[];
    protected outputs: string[];
    initialized$: EventEmitter<any>;
    mapObject: any;
    objectOptions: any;
    nguiMap: MapService;
    optionBuilder: OptionBuilder;
    libraryName: string;
    protected _subscriptions: any[];
    constructor(nguiMapComponent: NguiMapComponent, mapObjectName: string, inputs: string[], outputs: string[]);
    ngOnInit(): void;
    initialize(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
}
