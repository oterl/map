import { isNil as isNilR } from 'ramda';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Observer } from 'rxjs/Observer';

/**
 * return json string from json-like string
 */
export function jsonize(str: string): string {
  try {       // if parsable already, return as it is
    JSON.parse(str);
    return str;
  } catch (e) { // if not parsable, change little
    return str
      .replace(/([\$\w]+)\s*:/g, // wrap keys without double quote
        function(_: any, $1: any) {
          return '"' + $1 + '":';
        }
      )
      .replace(/'([^']+)'/g,   // replacing single quote to double quote
        function(_: any, $1: any) {
          return '"' + $1 + '"';
        }
      );
  }
}

/**
 * Returns string to an object by using JSON.parse()
 */
export function getJSON(input: any): any {
  if (typeof input === 'string') {
    const re = /^[\+\-]?[0-9\.]+,[ ]*\ ?[\+\-]?[0-9\.]+$/; // lat,lng
    if (input.match(re)) {
      input = '[' + input + ']';
    }
    return JSON.parse(jsonize(input));
  } else {
    return input;
  }
}

/**
 * json type definition
 */
/* tslint:disable */
//interface IJsonArray extends Array<string|number|boolean|Date|IJson|IJsonArray> { }
export interface IJson {
  //[x: string]: string|number|boolean|Date|IJson|IJsonArray;
  [x: string]: string|number|boolean|Date|IJson|Array<string|number|boolean|Date|IJson>;
}
/* tslint:enable */


/**
 * Returns camel-cased from string 'Foo Bar' to 'fooBar'
 *
 * @param str string to convert
 */
export function toCamelCase(str: string): string {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

/**
 * Checks if global google.maps object is defined
 */
export function isMapsApiLoaded() {
  return typeof google === 'object' && typeof google.maps === 'object';
}

export function missingLibraryError(component, libName) {
  return Error(`${component}: library '${libName}' is missing, please ensure to include it in a 'libraries' parameter.
    Example:
      NguiMapModule.forRoot({
        apiUrl: 'https://maps.googleapis.com/maps/api/js?libraries=${libName}'
      })
  `);
}

/**
 * Loads script by url
 * @param url Url of script
 * @param scriptId Unique identificator of script - this will add id to script
 *                 element, also will be used to store script load state in window
 *                 object
 * @param window Window object
 * @returns Observable that emits when script is loaded, throws an error in case
 *          it is not possible to determine script load state
 */
export const loadScript = (
    url: string,
    scriptId: string,
    window,
    loadedObjKey = 'loadedScripts'
): Observable<any> => {
    if (typeof window === 'undefined') {
        return Observable.throw(
            new Error('"window" has to be defined to load script')
        );
    }

    window[loadedObjKey] = window[loadedObjKey] || {};
    const storage = window[loadedObjKey];

    if (document.querySelector(`#${scriptId}`)) {
        const scriptState = storage[scriptId];

        if (isNilR(scriptState)) {
            Observable.throw(new Error('Can not determine state of script loading'));
        }

        return of(scriptState);
    }

    // Set target script as not loaded
    storage[scriptId] = false;

    return Observable.create((observer: Observer<boolean>) => {

        // #region Creation of script element
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = url;
        script.type = 'text/javascript';
        script.onload = () => {
            storage[scriptId] = true;
            observer.next(true);
            observer.complete();
        };
        // #endregion

        document.querySelector('body').appendChild(script);
    });
};