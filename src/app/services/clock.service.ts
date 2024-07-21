import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClockService {
  private startTime!: number;
  private timerId: any;
  private timeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('00:00');

  getTime(): Observable<string> {
    return this.timeSubject.asObservable();
  }

  startTimer(): void {
    this.startTime = Date.now();
    this.timerId = setInterval(() => this.updateTime(), 1000);
  }

  stopTimer(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private updateTime(): void {
    const elapsedTime = Date.now() - this.startTime;
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    this.timeSubject.next(`${minutes}:${seconds}`);
  }
}
