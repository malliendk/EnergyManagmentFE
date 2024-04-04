import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameModeService {

  private gameModeSource = new BehaviorSubject<string>('defaultGameMode');
  currentGameMode = this.gameModeSource.asObservable();

  constructor() { }

  chooseGameMode(gameMode: string) {
    this.gameModeSource.next(gameMode);
  }
}
