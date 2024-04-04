import {Component, OnInit} from '@angular/core';
import {GameModeService} from "../services/game-mode.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  gameMode!: string;

  constructor(private gameModeService: GameModeService) {
  }

  ngOnInit(): void {
    this.gameModeService.currentGameMode.subscribe(gameMode => {
      this.gameMode = gameMode
    })
  }


}
