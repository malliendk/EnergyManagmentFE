import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Building} from "../dtos/building";
import {BuildingService} from "../services/building.service";
import {BuildingViewComponent} from "../building-view/building-view.component";

@Component({
  selector: 'app-building-dashboard',
  templateUrl: './building-dashboard.component.html',
  styleUrls: ['./building-dashboard.component.css'],
  standalone: false
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
    this.gameDTO.buildings.push(building);
    this.gameDTO.funds -= building.price;
    this.passGameDTOToTopLevel.emit(this.gameDTO)
    if (this.buildingViewComponent) {
      this.buildingViewComponent.isDetailView = false
      this.buildingViewComponent.building = null;
    }
  }

  getBuildingViewType(emittedValue: string) {
    this.receivingViewType = emittedValue;
  }
}
