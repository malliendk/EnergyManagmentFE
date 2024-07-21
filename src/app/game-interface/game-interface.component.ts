import {Component, Input, OnInit} from '@angular/core';
import {GameDto} from "../dtos/gameDto";
import {mockGameDto} from "../mocks/mock-game-dto";

@Component({
  selector: 'app-game-interface',
  templateUrl: './game-interface.component.html',
  styleUrls: ['./game-interface.component.css']
})
export class GameInterfaceComponent implements OnInit{

  view: string = 'townhall';

  ngOnInit(): void {
  }

  toFactories() {
    this.view = 'factories';
  }
}
