import {Component} from '@angular/core';
import {BuildingDetailComponent} from "../building-detail/building-detail.component";
import {BuildingService} from "../services/building.service";
import {AsyncPipe} from "@angular/common";
import {BuildingListComponent} from "../building-list/building-list.component";

@Component({
  selector: 'app-building-view',
  imports: [
    BuildingDetailComponent,
    AsyncPipe,
    BuildingListComponent
  ],
  templateUrl: './building-view.component.html',
  standalone: true,
  styleUrl: './building-view.component.css'
})
export class BuildingViewComponent {

  building$ = this.buildingService.building$;
  allBuildings$ = this.buildingService.allBuildings$

  constructor(private buildingService: BuildingService) {
  }
}
