import { Component } from '@angular/core';
import { SourceCodeService } from '../source-code.service';

@Component({
  template: `      `
})
export class SimpleMarkerComponent {
  code: string;
  constructor(public sc: SourceCodeService) {
    sc.getText('SimpleMarkerComponent').subscribe(text => this.code = text);
  }
  log(event, str) {
    if (event instanceof MouseEvent) {
      return false;
    }
  }
}
