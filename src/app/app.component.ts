import {Component, Input, OnInit} from '@angular/core';
import {GameDTOService} from "./services/game-dto.service";
import {ExtendedGameDTO} from "./extendedGameDTO";
import {mockGameObject} from "./mocks/mock-game-object";
import {Observable} from "rxjs";
import {TimeOfDay, TimesOfDay} from "./timeOfDay";
import {BuildingService} from "./services/building.service";
import {MinimizedGameDTO} from "./minimizedGameDTO";
import {Building} from "./dtos/building";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'Energy Management';

  gameDTO!: ExtendedGameDTO;

  buildingViewComponentType: string = '';
  passingViewType!: string;
  viewTypeTownHall: string = 'town hall';
  viewTypeFactory: string = 'factory';
  viewTypeBuildings: string = 'buildings'

  constructor(private gameDTOService: GameDTOService,
              private buildingService: BuildingService) {
  }

  ngOnInit(): void {
  }

  initiateGame() {
    console.log("initiating game")
    this.gameDTOService.startGame()
      .subscribe(gameDTO => {

      })
  }

  getViewType(value: string) {
    this.passingViewType = value;
    console.log(`passing view types from navbar: ${this.passingViewType}`, ` ${this.buildingViewComponentType}`)
  }

  getBuildingViewType(value: string) {
    this.buildingViewComponentType = value;
  }

  getGameDTO() {
    this.gameDTOService.getGameDto()
      .subscribe((minimizedGameDTO => {
        //new ExtendedGameDTO = blabla + buildings = getBuildingsByID
      }
  }

  getBuildingsById(minimizedGameDTO: MinimizedGameDTO): Building[] {
    const ids: number[] = minimizedGameDTO.buildingRequests.map(request => request.buildingId);
    let finalBuildingList: Building[] = [];
    this.buildingService.getBuildingsById(ids)
      .subscribe(buildings => {
          finalBuildingList = this.duplicateBuildingsIfNecessary(ids, buildings);
          finalBuildingList = this.setSolarPanelAmountToBuildings(minimizedGameDTO, finalBuildingList);
        }
      )
    return finalBuildingList;
  }

  duplicateBuildingsIfNecessary(ids: number[], retrievedBuildings: Building[]) {
    let finalBuildingList: Building[] = [];
    ids.forEach((id) => {
      retrievedBuildings.forEach(building => {
        if (building.id == id) {
          finalBuildingList.push(building)
        }
      })
    })
    return finalBuildingList;
  }

  setSolarPanelAmountToBuildings(minimizedGameDTO: MinimizedGameDTO, buildings: Building[]): Building[] {
    let requestMap = minimizedGameDTO.buildingRequests.map(request => ({
      id: request.buildingId,
      solarPanelAmount: request.solarPanelAmount
    }));
    buildings.forEach(building => {
      requestMap.forEach(map => {
        if (map.id == building.id) {
          building.solarPanelAmount = map.solarPanelAmount;
        }
      })
    })
    return buildings;
  }

}
