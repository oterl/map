import { IJson } from './util';
/**
 * change any object to google object options
 * e.g. [1,2] -> new google.maps.LatLng(1,2);
 */
export declare class OptionBuilder {
    googlizeAllInputs(definedInputs: string[], userInputs: any): any;
    googlizeMultiple(inputs: any[], options?: IJson): any;
    googlize(input: any, options?: IJson): any;
    private getLatLng;
    private getJSONParsed;
    private getAnyMapObject;
    private getAnyMapConstant;
    /**
     * streetviewControl, panControl, etc, not a general control
     */
    private getMapControlOption;
    private getDateObject;
    private getMapIcons;
    private getMarkerIcon;
    private onlyOptionsGiven;
}
