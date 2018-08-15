import { Observable } from 'rxjs';
/**
 * return json string from json-like string
 */
export declare function jsonize(str: string): string;
/**
 * Returns string to an object by using JSON.parse()
 */
export declare function getJSON(input: any): any;
/**
 * json type definition
 */
export interface IJson {
    [x: string]: string | number | boolean | Date | IJson | Array<string | number | boolean | Date | IJson>;
}
/**
 * Returns camel-cased from string 'Foo Bar' to 'fooBar'
 *
 * @param str string to convert
 */
export declare function toCamelCase(str: string): string;
/**
 * Checks if global google.maps object is defined
 */
export declare function isMapsApiLoaded(): boolean;
export declare function missingLibraryError(component: any, libName: any): Error;
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
export declare const loadScript: (url: string, scriptId: string, window: any, loadedObjKey?: string) => Observable<any>;
