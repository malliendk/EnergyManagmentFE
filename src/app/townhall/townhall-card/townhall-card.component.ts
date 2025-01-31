import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-townhall-card',
    templateUrl: './townhall-card.component.html',
    styleUrls: ['./townhall-card.component.css'],
    standalone: false
})
export class TownhallCardComponent {

  @Input() sidebarColorCode!: string;
  @Input() isSideBarGradient!: boolean;

  get sideBarStyles() {
    if (this.isSideBarGradient) {
      return { 'background-image': 'linear-gradient('+ this.sidebarColorCode +')'};
    } else {
      return { 'background-color': this.sidebarColorCode };
    }
  }
}
