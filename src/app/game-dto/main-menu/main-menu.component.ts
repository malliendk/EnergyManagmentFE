import {Component, OnInit} from '@angular/core';
import {SaveGameService} from "../../services/save-game.service";
import {GameDTO} from "../../dtos/gameDTO";
import {GameDTOService} from "../../services/game-dto.service";
import {BuildingService} from "../../services/building.service";
import {BuildingDTO} from "../../dtos/buildingDTO";
import {ModalComponent} from "../../components/modal/modal.component";
import {SaveGame} from "../../dtos/saveGame";
import {catchError, Subscription} from "rxjs";
import {FormsModule} from "@angular/forms";
import {Supervisor} from "../../dtos/supervisor";

@Component({
  selector: 'app-main-menu',
  imports: [
    ModalComponent,
    FormsModule
  ],
  templateUrl: './main-menu.component.html',
  standalone: true,
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent implements OnInit {

  private gameDTOSubscription = new Subscription()

  gameDTO!: GameDTO;
  buildings!: BuildingDTO[];
  saveGames!: SaveGame[];
  existingSaveGame!: SaveGame;

  gameNameInput: string = ''

  isLoadGame: boolean = false;
  isSaveToggled: boolean = false;

  constructor(private saveGameService: SaveGameService,
              private gameDTOService: GameDTOService,
              private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.getSavedGames()
  }

  loadGame(id: number) {
    this.saveGameService.retrieveSaveGame(id).pipe(
      catchError(err => {
        console.log('Failed to load game', err.message())
        throw new Error('Failed to load game', err.message())
      }))
      .subscribe((gameDTO: GameDTO) => {
        this.gameDTO = gameDTO
        this.toggleLoadGame();
      })
  }

  // save(existingSaveGame?: SaveGame) {
  //   const saveGame: SaveGame = existingSaveGame ? this.mapSaveGame(existingSaveGame) : this.mapSaveGame();
  //   this.saveGameService.save(saveGame).subscribe(() => this.getSavedGames())
  // }

  getSavedGames() {
    this.saveGameService.findAllSavedGames()
      .subscribe((savedGames: SaveGame[]) => this.saveGames = savedGames)
  }

  toggleLoadGame() {
    this.isLoadGame = !this.isLoadGame;
    if (!this.saveGames) {
      this.getSavedGames();
    } else {
      this.saveGames = [];
    }
  }

  toggleSave() {
    this.isSaveToggled = !this.isSaveToggled;
  }

  startNewGame(superVisor: Supervisor) {
    this.gameDTOService.startGame(superVisor)
      .subscribe(gameDTO => {
        this.gameDTO = gameDTO
      })
  }

}
