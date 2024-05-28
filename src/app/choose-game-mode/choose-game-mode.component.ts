import {Component} from '@angular/core';
import {GameModeService} from "../services/game-mode.service";
import {GameMode} from "../gameMode";

@Component({
  selector: 'app-choose-game-mode',
  templateUrl: './choose-game-mode.component.html',
  styleUrls: ['./choose-game-mode.component.css']
})
export class ChooseGameModeComponent {

  GameMode = GameMode;
  difficultyLevel = false;
  

  constructor(private gameModeService: GameModeService) {
  }

  chooseGameMode(gameMode: GameMode) {
    this.gameModeService.chooseGameMode(gameMode)
  }
}
