import {Component, OnInit} from '@angular/core';
import {InitiateGameDto} from "../dtos/initiateGameDto";
import {DifficultyLevel} from "../difficultyLevel";
import {GameDto} from "../gameDto";
import {GameDtoService} from "../game-dto.service";

@Component({
  selector: 'app-game-mode-select',
  templateUrl: './game-mode-select.component.html',
  styleUrls: ['./game-mode-select.component.css']
})
export class GameModeSelectComponent implements OnInit{

  initDto!: InitiateGameDto;
  gameDto!: GameDto;

  constructor(private dtoService: GameDtoService) {
  }

  ngOnInit(): void {
    this.initDto = {localityName: '', difficultyLevel: DifficultyLevel.EMPTY};
  }

  startGame(initDto: InitiateGameDto) {
    return this.dtoService.initiateGame(initDto);
  }



}
