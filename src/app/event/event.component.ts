import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {GameEventsService} from "../game-events.service";
import {Event} from "../event";
import {ModalComponent} from "../modal/modal.component";
import {Building} from "../dtos/building";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-event',
  imports: [
    ModalComponent,
    NgStyle
  ],
  templateUrl: './event.component.html',
  standalone: true,
  styleUrl: './event.component.css'
})
export class EventComponent implements OnInit {

  private eventSubscription: Subscription | null = null;
  connectionError: boolean = false;

  isModalOpen: boolean = true;

  @Input() event!: Event;
  @Output() passEventResult = new EventEmitter<{
    building: Building | null,
    popularityLoss: number
  }>();

  imgUrl: string = 'assets/photos/tropisch-zwemparadijs.png';
  goldIncome = 125;
  popIncome = 175;
  scienceIncome = 0;
  energyConsumption = 2500;
  goldCost = 3500;
  popCost = 2500;
  score = 0;

  constructor(private gameEventsService: GameEventsService) {
  }

  ngOnInit() {
    this.subscribeToEvents();
    this.event = {
      id: 1,
      name: 'Bouw van een tropisch zwemparadijs',
      description: 'Een investeerder heeft plannen om een tropisch zwemparadijs te bouwen in je gemeente. ' +
        'Er is al langer de roep van je inwoners om een luxe zwemgelegenheid als deze.',
      buildingDTO: null};
  }

  acceptBuilding(building: Building) {
    this.passEventResult.emit({building: building, popularityLoss: 0});
    this.isModalOpen = false
  }

  rejectBuilding(building: Building) {
    this.passEventResult.emit({building: null, popularityLoss: building.popularityCost});
    this.isModalOpen = false;
  }

  subscribeToEvents(): void {
    this.connectionError = false;
    this.eventSubscription = this.gameEventsService.subscribeToEvents()
      .subscribe({
        next: (event: Event) => {
          this.event = event;
        }
      })
  }
}
