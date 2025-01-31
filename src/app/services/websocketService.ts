import {Injectable} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {GameObject} from "../dtos/gameObject";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private webSocket: WebSocket | null = null;
  private gameUpdateSubject = new Subject<GameObject>();

  constructor() {}

  connect(url: string) {
    this.webSocket = new WebSocket(url);

    this.webSocket.onmessage = (event) => {
      const gameDto: GameObject = JSON.parse(event.data);
      this.gameUpdateSubject.next(gameDto);
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    this.webSocket.onclose = () => {
      console.log('WebSocket connection closed');
    }
  }

  onGameUpdate(): Observable<GameObject> {
    return this.gameUpdateSubject.asObservable();
  }

  disconnect() {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }
}
