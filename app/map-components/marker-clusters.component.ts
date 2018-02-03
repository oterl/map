import {
    ChangeDetectionStrategy,
    Component
    } from '@angular/core';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { delay } from 'rxjs/operators';
import { SourceCodeService } from '../source-code.service';

@Component({
    template: `
        <h1>Marker With Clusters</h1>
        <ngui-map zoom="7" center="Brampton, Canada">
            <custom-marker-cluster>
                <custom-marker
                    *ngFor="let pos of positions | async"
                    [attachToParentMap]="false"
                    [position]="pos">
                    <div
                        style="
                            width: 5px;
                            height: 5px;
                            border-radius: 50%;
                            background-color: black;
                        ">
                    </div>
                </custom-marker>
            </custom-marker-cluster>
        </ngui-map>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkerClustersComponent {
    public positions = Observable.of(this.getRandomMarkers()).pipe(delay(2000));

    code: string;

    constructor(public sc: SourceCodeService) { }

    getRandomMarkers() {
        let randomLat: number, randomLng: number;

        let positions = [];
        for (let i = 0 ; i < 10000; i++) {
            randomLat = Math.random() * (45.8500 - 43.7300) + 43.7300;
            randomLng = Math.random() * (-85.9500 - -79.7699) + -79.7699;
            positions.push({ lat: randomLat, lng: randomLng });
        }
        return positions;
    }

    // showMarkersFromObservable() {
    //     Observable
    //         .of(this.getRandomMarkers())
    //         .subscribe( positions => {
    //             this.positions = positions;
    //         });
    // }
}
