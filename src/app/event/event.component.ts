import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {GameEventsService} from "../game-events.service";
import {EventDTO} from "../eventDTO";
import {ModalComponent} from "../modal/modal.component";
import {Building} from "../dtos/building";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
  standalone: true,
  imports: [
    ModalComponent,
    NgStyle
  ]
})
export class EventComponent implements OnInit {

  private eventSubscription: Subscription | null = null;
  connectionError: boolean = false;

  isModalOpen: boolean = false;

  @Input() event!: EventDTO;
  @Output() passEventResult = new EventEmitter<{
    building: Building | null,
    popularityLoss: number
  }>();

  constructor(private gameEventsService: GameEventsService) {
  }

  ngOnInit() {
    this.subscribeToEvents();
  }

  acceptBuilding(building: Building) {
    this.passEventResult.emit({building: building, popularityLoss: 0});
    this.toggleModal()
  }

  rejectBuilding(building: Building) {
    this.passEventResult.emit({building: null, popularityLoss: building.popularityCost});
    this.toggleModal();
  }

  subscribeToEvents(): void {
    this.connectionError = false;
    this.eventSubscription = this.gameEventsService.subscribeToBuildingEvents()
      .subscribe({
        next: (event: EventDTO) => {
          console.log("new event recieved");
          this.event = event;
          this.toggleModal()
        }
      })
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
}
