import {Component, OnInit} from '@angular/core';
import {BuildingDTO} from "../dtos/buildingDTO";
import {CommonModule} from "@angular/common";
import {Tile} from "../dtos/tile";
import {PurchaseViewComponent} from "../purchase-view/purchase-view.component";
import {BuildingService} from "../services/building.service";
import {Subscription} from "rxjs";
import {TileService} from "../services/tile.service";
import {BuildingViewComponent} from "../building-view/building-view.component";
import {POWER_LINE_ID} from "../power-line-values";

@Component({
  selector: 'app-building-dashboard',
  templateUrl: './building-dashboard.component.html',
  styleUrls: ['./building-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, PurchaseViewComponent, BuildingViewComponent]
})
export class BuildingDashboardComponent implements OnInit {

  private tileSubscription = new Subscription()
  private buildingSubscription = new Subscription()

  allBuildings!: BuildingDTO[]

  building: BuildingDTO | null = null;
  powerLine: BuildingDTO | null = null;
  tiles!: Tile[];
  tile: Tile | null = null;

  constructor(private buildingService: BuildingService,
              private tileService: TileService) {
  }

  ngOnInit() {
    this.buildingService.findAll().subscribe(buildings => {
      this.allBuildings = buildings
      this.powerLine = this.allBuildings.find(building => building.id === POWER_LINE_ID)!;
    })
    this.addTileSubscription()
    this.addBuildingSubscription()
  }

  addTileSubscription() {
    this.tileSubscription.add(
      this.tileService.tile$
        .subscribe(tile => this.tile = tile!)
    )
  }

  addBuildingSubscription() {
    this.buildingSubscription.add(
      this.buildingService.building$
        .subscribe(building => this.building = building!)
    )
  }
}
