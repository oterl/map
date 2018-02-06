import { Component } from '@angular/core';
import { SourceCodeService } from '../source-code.service';

@Component({
  template: `
    <h1>Custom Marker</h1>
    <ngui-map center="Brampton, Canada">
      <custom-marker
        (click)="onMarkerClick($event)"
        (dragend)="onDragEnd($event)"
        [position]="position"
        [draggable]="true">
        <div><b>Hi, USA</b>
          <img src="http://icons.iconarchive.com/icons/custom-icon-design/2014-world-cup-flags/32/USA-icon.png" />
        </div>
      </custom-marker>
      <marker position="Brampton, Canada"></marker>
    </ngui-map>

    <button (click)="sc.plnkr(code)">See in plunker</button>

    <pre class="prettyprint">{{code}}</pre>
  `
})
export class CustomMarkerDemoComponent {
    position = { lat: 43.73154789999999, lng: -79.7449296972229 };
  code: string;
  constructor(public sc: SourceCodeService) {
    sc.getText('CustomMarkerComponent').subscribe(text => (this.code = text));
  }

  onDragEnd(event) {
      console.log(event);
  }

  onMarkerClick(event) {
      //console.log(event);
  }
}
