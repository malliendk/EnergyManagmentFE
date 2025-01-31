import {Component, Input, OnInit} from '@angular/core';
import {GameObject} from "../dtos/gameObject";
import {mockGameObject} from "../mocks/mock-game-object";
import {Building} from "../dtos/building";
import {GameDtoService} from "../services/game-dto.service";
import {ActivatedRoute} from "@angular/router";
import {mockBuildings} from "../mocks/mock-buildings";
import {BuildingService} from "../services/building.service";

@Component({
    selector: 'app-building-dashboard',
    templateUrl: './building-dashboard.component.html',
    styleUrls: ['./building-dashboard.component.css'],
    standalone: false
})
export class BuildingDashboardComponent implements OnInit {

  protected readonly mockBuildings = mockBuildings;

  @Input() recievingViewType: string = '';

  mockGameDto!: GameObject;
  allBuildings!: Building[];

  building: Building | null = null;

  viewTypeOverview: string = 'overview';
  viewTypePurchase = 'purchase';

  ownedBuildingsView: string = 'overview';
  purchaseView: string = 'purchase';

  constructor(private gameDTOService: GameDtoService,
              private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.mockGameDto = mockGameObject;
    this.mockGameDto.buildings = this.mockGameDto.buildings.filter((building, index) => index < 5);
    this.allBuildings = this.buildingService.getAll();
  }

  updateGameDTO(building: Building): void {
    this.mockGameDto.buildings.push(building);
    this.gameDTOService.updateGameDTO(this.mockGameDto)
      .subscribe(() => this.getGameDTO())
  }

  getGameDTO() {
    this.gameDTOService.getGameDto()
      .subscribe(updatedGameDTO => this.mockGameDto = updatedGameDTO);
  }

  private getMockGameObject() {
    return this.gameDTOService.getMockGameObject();
  }

  getBuildingViewType(emittedValue: string) {
    this.recievingViewType = emittedValue;
  }
}
