import {Component} from '@angular/core';
import {GridComponent} from "../game-dto/grid/grid.component";
import {BuildingDetailComponent} from "../building-detail/building-detail.component";
import {BuildingService} from "../services/building.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-building-view',
  imports: [
    GridComponent,
    BuildingDetailComponent,
    AsyncPipe
  ],
  templateUrl: './building-view.component.html',
  standalone: true,
  styleUrl: './building-view.component.css'
})
export class BuildingViewComponent{

  building$ = this.buildingService.building$;

  constructor(private buildingService: BuildingService) {
  }




}
