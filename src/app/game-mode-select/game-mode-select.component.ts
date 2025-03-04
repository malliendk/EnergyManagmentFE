// // game-mode-select.component.ts
// import {Component, Input, OnInit} from '@angular/core';
// import { InitiateGameDTO } from "../dtos/initiateGameDTO";
// import { DifficultyLevel } from "../difficultyLevel";
// import { GameDTOService } from "../services/game-dto.service";
// import { Router } from "@angular/router";
// import {ClockService} from "../services/clock.service";
//
//
// @Component({
//     selector: 'app-game-mode-select',
//     templateUrl: './game-mode-select.component.html',
//     styleUrls: ['./game-mode-select.component.css'],
//     standalone: false
// })
// export class GameModeSelectComponent implements OnInit {
//
//
//   initDto!: InitiateGameDTO;
//   difficultyLevel = DifficultyLevel;
//   selectedDifficultyLevel = '';
//   playerScope = '';
//   selectedLocalityName = '';
//   showScopeChoice = false;
//   showLocalityChoice = false;
//   showDifficultyLevel = false;
//   showConfirmation = false;
//
//   private difficultyLevelMap = {
//     [DifficultyLevel.EASY]: 'Easy',
//     [DifficultyLevel.MEDIUM]: 'Medium',
//     [DifficultyLevel.HARD]: 'Hard',
//   }
//
//   constructor(private gameDtoService: GameDTOService,
//               private router: Router,
//               private clockService: ClockService) {
//   }
//
//   ngOnInit() {
//     console.log("GameModeSelect component initialized");
//     this.initDto = {localityName: '', difficultyLevel: DifficultyLevel.EASY};
//     this.showScopeChoice = true;
//   }
//
//   onLocalitySelected(localityName: string) {
//     this.selectedLocalityName = localityName;
//   }
//
//
//   setPlayerScope(scope: string) {
//     this.playerScope = scope;
//     this.showScopeChoice = false;
//     if (this.playerScope == 'locality'){
//       this.showLocalityChoice = true;
//     }
//     console.log(scope);
//   }
//
//   setLocality(localityName: string) {
//     this.initDto.localityName = localityName;
//     this.showLocalityChoice = false;
//     this.showDifficultyLevel = true;
//     console.log(localityName);
//     console.log(this.initDto.localityName);
//     console.log(this.initDto);
//   }
//
//   setDifficultyLevel(difficultyLevel: DifficultyLevel) {
//     this.initDto.difficultyLevel = difficultyLevel;
//     this.selectedDifficultyLevel = this.difficultyLevelMap[difficultyLevel];
//     this.showDifficultyLevel = false;
//     this.showConfirmation = true;
//     console.log(difficultyLevel);
//     console.log(this.initDto.localityName);
//     console.log(this.initDto);
//   }
//
//   startGame() {
//     this.gameDtoService.startGame()
//       .subscribe(gameDto => {
//         this.router.navigate(['game-mode-select'])
//           .then(() => {
//             console.log(`Game initiated with ${JSON.stringify(gameDto)}`);
//             this.clockService.startTimer();
//           });
//       });
//   }
//
//   resetChoices() {
//     window.location.reload();
//   }
// }
//
//
