import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SaveGame} from "../dtos/saveGame";
import {Observable} from "rxjs";
import {GameDTOService} from "./game-dto.service";
import {MinimizedGameDTO} from "../dtos/minimizedGameDTO";

@Injectable({
  providedIn: 'root'
})
export class SaveGameService {

  private calculationServiceUrl: string = 'http://localhost:8093';
  private storageServiceUrl: string = 'http://localhost:8090/save-game';

  constructor(private http: HttpClient,
              private gameDTOService: GameDTOService) { }

  retrieveSaveGame(id: number): Observable<MinimizedGameDTO> {
    return this.http.get<MinimizedGameDTO>(`${this.storageServiceUrl}/load/${id}`);
  }

  findAllSavedGames(): Observable<SaveGame[]> {
    return this.http.get<SaveGame[]>(`${this.storageServiceUrl}/games`);
  }

  save(saveGame: SaveGame): Observable<SaveGame> {
    return this.http.post<SaveGame>(`${this.storageServiceUrl}/save-game`, saveGame);
  }

  updateSaveGame(saveGame: SaveGame, id: number) {
    return this.http.put(`${this.storageServiceUrl}/save-game/${id}`, saveGame)
  }
}
