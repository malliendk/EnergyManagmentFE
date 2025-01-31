import {Component, Input, OnInit} from '@angular/core';
import {GameObject} from "../dtos/gameObject";
import {mockGameObject} from "../mocks/mock-game-object";

@Component({
    selector: 'app-game-interface',
    templateUrl: './game-interface.component.html',
    styleUrls: ['./game-interface.component.css'],
    standalone: false
})
export class GameInterfaceComponent implements OnInit{

  view: string = 'townhall';

  ngOnInit(): void {
  }

  toFactories() {
    this.view = 'factories';
  }
}
