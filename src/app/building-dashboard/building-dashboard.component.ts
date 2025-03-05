import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Building} from "../dtos/building";
import {GameDTOService} from "../services/game-dto.service";
import {BuildingService} from "../services/building.service";

@Component({
    selector: 'app-building-dashboard',
    templateUrl: './building-dashboard.component.html',
    styleUrls: ['./building-dashboard.component.css'],
    standalone: false
})
export class BuildingDashboardComponent implements OnInit {

  @Input() gameDTO!: ExtendedGameDTO;
  @Input() receivingViewType: string = '';
  @Output() passGameDTOToTopLevel = new EventEmitter<void>();

  allBuildings!: Building[];
  purchasedBuildings!: Building[];

  building: Building | null = null;

  ownedBuildingsView: string = 'overview';
  purchaseView: string = 'purchase';

  constructor(private gameDTOService: GameDTOService,
              private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.getAllBuildings();
    this.updatePurchasedBuildings();
  }

  updateGameDTO(building: Building): void {
    this.gameDTO.buildings.push(building);
    this.gameDTOService.updateGameDTO(this.gameDTO)
      .subscribe(() => {
        this.triggerGetGameDTO()
      })
  }

  triggerGetGameDTO() {
    this.passGameDTOToTopLevel.emit()
  }

  getAllBuildings() {
    this.buildingService.getAll()
      .subscribe((buildings: Building[]) => this.allBuildings = buildings)
  }

  updatePurchasedBuildings() {
    this.purchasedBuildings = this.gameDTO.buildings;
  }

  getBuildingViewType(emittedValue: string) {
    this.receivingViewType = emittedValue;
  }

  getGameDTO() {
    this.gameDTOService.getGameDto().subscribe(minimizedGameDTO => {
      this.buildingService.getBuildingsById(minimizedGameDTO)
        .subscribe(buildings =>
          this.gameDTO = this.gameDTOService.extendGameDTO(minimizedGameDTO, buildings))
    })
  }
}
