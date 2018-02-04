import {
    Injectable,
    NgZone,
    SimpleChanges
    } from '@angular/core';
import { GeoCoder } from './geo-coder';
import { OptionBuilder } from './option-builder';

/**
 * collection of map instance-related properties and methods
 */
@Injectable()
export class MapService {
    constructor(
        private geoCoder: GeoCoder,
        private optionBuilder: OptionBuilder,
        private zone: NgZone
    ) { }

    /**
     * Listens for map object events and calls respective emit component methods
     * @param definedEvents List of events that map object supports
     * @param componentInstance Instance of Angular component
     * @param mapObject Map object that is compatible with Google Maps
     */
    setObjectEvents(
        definedEvents: string[],
        componentInstance: any,
        mapObject: {
            addListener(
                eventName: string,
                callback: (event: google.maps.event) => void
            ): void
        }
    ) {
        definedEvents.forEach((definedEvent: string) => {
            const eventName = this.normalizeEventName(definedEvent);
            const zone = this.zone;

            zone.runOutsideAngular(() => {
                mapObject.addListener(
                    eventName,
                    function(event: google.maps.event) {
                        let param: any = event ? event : {};
                        param.target = this;
                        zone.run(
                            () => componentInstance[definedEvent].emit(param)
                        );
                    });
            });
        });
    }

    clearObjectEvents(definedEvents: string[], thisObj: any, prefix: string) {
        definedEvents.forEach(definedEvent => {
            const eventName = this.normalizeEventName(definedEvent);

            this.zone.runOutsideAngular(() => {
                if (thisObj[prefix]) {
                    google.maps.event.clearListeners(thisObj[prefix], eventName);
                }
            });
        });

        if (thisObj[prefix]) {
            if (thisObj[prefix].setMap) {
                thisObj[prefix].setMap(null);
            }

            delete thisObj[prefix].nguiMapComponent;
            delete thisObj[prefix];
        }
    }

  updateGoogleObject = (object: any, changes: SimpleChanges) => {
    let val: any, currentValue: any, setMethodName: string;
    if (object) {
      for (let key in changes) {
        setMethodName = `set${key.replace(/^[a-z]/, x => x.toUpperCase())}`;
        currentValue = changes[key].currentValue;
        if (
          ['position', 'center'].indexOf(key) !== -1 &&
          typeof currentValue === 'string'
        ) {
          // To preserve setMethod name in Observable callback, wrap it as a function, then execute
          (setMethodName => {
            this.geoCoder
              .geocode({ address: currentValue })
              .subscribe(results => {
                if (typeof object[setMethodName] === 'function') {
                  object[setMethodName](results[0].geometry.location);
                } else {
                  console.error(
                    'Not all options are dynamically updatable according to Googles Maps API V3 documentation.\n' +
                      'Please check Google Maps API documentation, and use "setOptions" instead.'
                  );
                }
              });
          })(setMethodName);
        } else {
          val = this.optionBuilder.googlize(currentValue);
          if (typeof object[setMethodName] === 'function') {
            object[setMethodName](val);
          } else {
            console.error(
              'Not all options are dynamically updatable according to Googles Maps API V3 documentation.\n' +
                'Please check Google Maps API documentation, and use "setOptions" instead.'
            );
          }
        }
      }
    }
  }

    private normalizeEventName(definedEvent: string): string {
        return definedEvent
            // positionChanged -> position_changed
            .replace(/([A-Z])/g, $1 => `_${$1.toLowerCase()}`)
            .replace(/^map_/, ''); // map_click -> click  to avoid DOM conflicts
    }
}
