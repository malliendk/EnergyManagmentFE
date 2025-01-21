import {Injectable} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {GameDTO} from "../dtos/gameDTO";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private webSocket: WebSocket | null = null;
  private gameUpdateSubject = new Subject<GameDTO>();

  constructor() {}

  connect(url: string) {
    this.webSocket = new WebSocket(url);

    this.webSocket.onmessage = (event) => {
      const gameDto: GameDTO = JSON.parse(event.data);
      this.gameUpdateSubject.next(gameDto);
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    this.webSocket.onclose = () => {
      console.log('WebSocket connection closed');
    }
  }

  onGameUpdate(): Observable<GameDTO> {
    return this.gameUpdateSubject.asObservable();
  }

  disconnect() {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }
}
