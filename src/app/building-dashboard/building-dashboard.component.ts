import {Component, OnInit} from '@angular/core';
import {BuildingDTO} from "../dtos/buildingDTO";
import {CommonModule} from "@angular/common";
import {BuildingService} from "../services/building.service";
import {BuildingViewComponent} from "../building-view/building-view.component";
import {GridComponent} from "../grid/grid.component";

@Component({
  selector: 'app-building-dashboard',
  templateUrl: './building-dashboard.component.html',
  styleUrls: ['./building-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, BuildingViewComponent, GridComponent]
})
export class BuildingDashboardComponent implements OnInit {

  buildings: BuildingDTO[] = [];

  constructor(private buildingService: BuildingService) {
  }

  ngOnInit() {
    window.scroll(0,0)
  }
}
