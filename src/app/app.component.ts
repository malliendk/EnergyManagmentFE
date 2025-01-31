import {Component, OnInit} from '@angular/core';
import {GameDtoService} from "./services/game-dto.service";
import {GameObject} from "./dtos/gameObject";
import {mockGameObject} from "./mocks/mock-game-object";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Energy Management';

  mockGameDto = mockGameObject;

  buildingViewComponentType: string = '';
  passingViewType!: string;
  viewTypeTownHall: string = 'town hall';
  viewTypeFactory: string = 'factory';
  viewTypeBuildings: string = 'buildings'

  constructor(private gameDtoService: GameDtoService) {
  }

  ngOnInit(): void {
    mockGameObject.gridLoadTotal = this.gameDtoService.calculateTotalGridLoad()
  }

  getViewType(value: string) {
    this.passingViewType = value;
    console.log(`passing view types from navbar: ${this.passingViewType}`,` ${this.buildingViewComponentType}`)
  }

  getBuildingViewType(value: string) {
   this.buildingViewComponentType = value;
  }
}
