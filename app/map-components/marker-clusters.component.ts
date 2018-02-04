import {
    ChangeDetectionStrategy,
    Component
    } from '@angular/core';
import { Subject } from 'rxjs';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import {
    delay,
    map,
    mapTo,
    merge
    } from 'rxjs/operators';
import { SourceCodeService } from '../source-code.service';

@Component({
    template: `
        <h1>Marker With Clusters</h1>
        <ngui-map
            [style.height.px]="750"
            zoom="7"
            center="Brampton, Canada">
            <custom-marker-cluster
                (clusteringbegin)="onClusteringBegin()">
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
            <custom-marker-cluster
                (clusteringbegin)="onClusteringBegin()">
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
        <button (click)="regenerate()">Regenerate</button>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkerClustersComponent {
    reg = new Subject();
    public positions = Observable
        .of(this.getRandomMarkers()).pipe(delay(2000))
        .pipe(merge(this.reg.pipe(map(() => this.getRandomMarkers()))));

    code: string;

    constructor(public sc: SourceCodeService) { }

    getRandomMarkers() {
        let randomLat: number, randomLng: number;

        let positions = [];
        for (let i = 0 ; i < 20000; i++) {
            randomLat = Math.random() * (45.8500 - 43.7300) + 43.7300;
            randomLng = Math.random() * (-85.9500 - -79.7699) + -79.7699;
            positions.push({ lat: randomLat, lng: randomLng });
        }
        return positions;
    }

    regenerate() {
        this.reg.next();
    }

    onClusteringBegin() {
        console.log('clustering begin');
    }

    // showMarkersFromObservable() {
    //     Observable
    //         .of(this.getRandomMarkers())
    //         .subscribe( positions => {
    //             this.positions = positions;
    //         });
    // }
}
