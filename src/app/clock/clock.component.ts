import { Component, OnInit, OnDestroy } from '@angular/core';
import {ClockService} from "../services/clock.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.css'],
    standalone: false
})
export class ClockComponent implements OnInit, OnDestroy {
  time: string = '00:00';
  private timeSubscription!: Subscription;

  constructor(private clockService: ClockService) {}

  ngOnInit(): void {
    this.timeSubscription = this.clockService.getTime().subscribe(time => {
      this.time = time;
    });
    this.clockService.startTimer();
  }

  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
    this.clockService.stopTimer();
  }
}
