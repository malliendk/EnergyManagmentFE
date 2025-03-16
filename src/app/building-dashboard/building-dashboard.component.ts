import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Building} from "../dtos/building";
import {BuildingService} from "../services/building.service";
import {BuildingViewComponent} from "../building-view/building-view.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-building-dashboard',
  templateUrl: './building-dashboard.component.html',
  styleUrls: ['./building-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, BuildingViewComponent]
})
export class BuildingDashboardComponent implements OnInit {

  @ViewChild(BuildingViewComponent) buildingViewComponent?: BuildingViewComponent

  @Input() gameDTO!: ExtendedGameDTO;
  @Input() allBuildings?: Building[];
  @Input() receivingViewType!: string;
  @Output() passGameDTOToTopLevel = new EventEmitter<ExtendedGameDTO>();

  building: Building | null = null;

  ownedBuildingsView: string = 'overview';
  purchaseView: string = 'purchase';

  constructor(private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.receivingViewType = this.ownedBuildingsView;
    this.buildingService.getAll()
      .subscribe(buildings => this.allBuildings = buildings)
    console.log('buildings retrieved for the first time: {}')
  }

  updateBuildings(building: Building): void {
    this.buildingService.processPurchasedBuilding(building, this.gameDTO);
    this.passGameDTOToTopLevel.emit(this.gameDTO);
    if (this.buildingViewComponent) {
      this.buildingViewComponent.isDetailView = false
      this.buildingViewComponent.building = null;
    }
  }

  updatePurchasedSolarSets(purchasedSet: { building: Building, totalCost: number }) {
    this.gameDTO.funds -= purchasedSet.totalCost;
    this.gameDTO.buildings.forEach(building => {
      if (building.instanceId === purchasedSet.building.instanceId) {
        building.solarPanelAmount = purchasedSet.building.solarPanelAmount
      }
    })
    this.passGameDTOToTopLevel.emit(this.gameDTO);
  }

  getBuildingViewType(emittedValue: string) {
    this.receivingViewType = emittedValue;
  }
}
