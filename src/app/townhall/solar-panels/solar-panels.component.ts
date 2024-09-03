import {Component, OnInit} from '@angular/core';
import {GameDto} from "../../dtos/gameDto";
import {mockGameDto} from "../../mocks/mock-game-dto";

@Component({
  selector: 'app-solar-panels',
  templateUrl: './solar-panels.component.html',
  styleUrls: ['./solar-panels.component.css']
})
export class SolarPanelsComponent implements OnInit{

  mockGameDto: GameDto = mockGameDto;

  isSideBarGradient: boolean = true;
  sideBarColorCode: string = '#7777FF, #FFFFFF';


  ngOnInit() {

  }

}
