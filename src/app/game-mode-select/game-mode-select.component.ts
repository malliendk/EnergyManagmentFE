// game-mode-select.component.ts
import {Component, Input, OnInit} from '@angular/core';
import { InitiateGameDto } from "../dtos/initiateGameDto";
import { DifficultyLevel } from "../difficultyLevel";
import { GameDtoService } from "../services/game-dto.service";
import { Router } from "@angular/router";
import {ClockService} from "../services/clock.service";


@Component({
  selector: 'app-game-mode-select',
  templateUrl: './game-mode-select.component.html',
  styleUrls: ['./game-mode-select.component.css']
})
export class GameModeSelectComponent implements OnInit {


  initDto!: InitiateGameDto;
  difficultyLevel = DifficultyLevel;
  selectedDifficultyLevel = '';
  playerScope = '';
  selectedLocalityName = '';
  showScopeChoice = false;
  showLocalityChoice = false;
  showDifficultyLevel = false;
  showConfirmation = false;

  private difficultyLevelMap = {
    [DifficultyLevel.EASY]: 'Easy',
    [DifficultyLevel.MEDIUM]: 'Medium',
    [DifficultyLevel.HARD]: 'Hard',
  }

  constructor(private gameDtoService: GameDtoService,
              private router: Router,
              private clockService: ClockService) {
  }

  ngOnInit() {
    console.log("GameModeSelect component initialized");
    this.initDto = {localityName: '', difficultyLevel: DifficultyLevel.EASY};
    this.showScopeChoice = true;
  }

  onLocalitySelected(localityName: string) {
    this.selectedLocalityName = localityName;
  }


  setPlayerScope(scope: string) {
    this.playerScope = scope;
    this.showScopeChoice = false;
    if (this.playerScope == 'locality'){
      this.showLocalityChoice = true;
    }
    console.log(scope);
  }

  setLocality(localityName: string) {
    this.initDto.localityName = localityName;
    this.showLocalityChoice = false;
    this.showDifficultyLevel = true;
    console.log(localityName);
    console.log(this.initDto.localityName);
    console.log(this.initDto);
  }

  setDifficultyLevel(difficultyLevel: DifficultyLevel) {
    this.initDto.difficultyLevel = difficultyLevel;
    this.selectedDifficultyLevel = this.difficultyLevelMap[difficultyLevel];
    this.showDifficultyLevel = false;
    this.showConfirmation = true;
    console.log(difficultyLevel);
    console.log(this.initDto.localityName);
    console.log(this.initDto);
  }

  startGame(initDto: InitiateGameDto) {
    this.gameDtoService.startGame(initDto)
      .subscribe(gameDto => {
        this.router.navigate(['game-mode-select'])
          .then(() => {
            console.log(`Game initiated with ${JSON.stringify(gameDto)}`);
            this.clockService.startTimer();
          });
      });
  }

  resetChoices() {
    window.location.reload();
  }
}


