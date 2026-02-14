import {Component, OnInit} from '@angular/core';
import {SaveGameService} from "../../services/save-game.service";
import {FullGameDTO} from "../../dtos/fullGameDTO";
import {GameDTOService} from "../../services/game-dto.service";
import {BuildingService} from "../../services/building.service";
import {BuildingDTO} from "../../dtos/buildingDTO";
import {ModalComponent} from "../../components/modal/modal.component";
import {SaveGame} from "../../dtos/saveGame";
import {catchError, Subscription, switchMap} from "rxjs";
import {FormsModule} from "@angular/forms";
import {GameDtoMapperService} from "../../services/game-dto-mapper.service";
import {MinimizedGameDTO} from "../../dtos/minimizedGameDTO";
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

  gameDTO!: FullGameDTO;
  buildings!: BuildingDTO[];
  saveGames!: SaveGame[];
  existingSaveGame!: SaveGame;

  gameNameInput: string = ''

  isLoadGame: boolean = false;
  isSaveToggled: boolean = false;

  constructor(private saveGameService: SaveGameService,
              private gameDTOService: GameDTOService,
              private gameDTOMapper: GameDtoMapperService,
              private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.getSavedGames()
  }

  loadGame(id: number) {
    this.saveGameService.retrieveSaveGame(id).pipe(
      switchMap((loadGame: MinimizedGameDTO) => {
        return this.gameDTOMapper.extendGameDTO(loadGame)
      }),
      catchError(err => {
        console.log('Failed to load game', err.message())
        throw new Error('Failed to load game', err.message())
      }))
      .subscribe((gameDTO: FullGameDTO) => {
        this.gameDTO = gameDTO
        this.toggleLoadGame();
      })
  }

  // save(existingSaveGame?: SaveGame) {
  //   const saveGame: SaveGame = existingSaveGame ? this.mapSaveGame(existingSaveGame) : this.mapSaveGame();
  //   this.saveGameService.save(saveGame).subscribe(() => this.getSavedGames())
  // }

  private mapSaveGame(existingSaveGame: SaveGame | null): SaveGame {
    if (existingSaveGame) {
      return {
        id: existingSaveGame.id,
        name: existingSaveGame.name,
        supervisorInstanceId: existingSaveGame.supervisorInstanceId,
        tiles: existingSaveGame.tiles,
        buildingRequests: existingSaveGame.buildingRequests,
        funds: existingSaveGame.funds,
        popularity: existingSaveGame.popularity,
        research: existingSaveGame.research,
        environmentalScore: existingSaveGame.environmentalScore
      }
    } else {
      return {
        id: this.saveGames.length + 1,
        name: this.gameNameInput,
        supervisorInstanceId: this.gameDTO.supervisor.instanceId,
        tiles: this.gameDTO.tiles,
        buildingRequests: this.buildingService.minimizeToBuildingRequests(this.gameDTO),
        funds: this.gameDTO.funds,
        popularity: this.gameDTO.popularity,
        research: this.gameDTO.research,
        environmentalScore: this.gameDTO.environmentalScore
      }
    }
  }

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
