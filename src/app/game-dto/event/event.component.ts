import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs";
import {ModalComponent} from "../../components/modal/modal.component";
import {NgClass} from "@angular/common";
import {BuildingInfoComponent} from "../../building-info/building-info.component";
import {GridComponent} from "../grid/grid.component";
import {FullGameDTO} from "../../dtos/fullGameDTO";
import {Tile} from "../../dtos/tile";
import {BuildingDTO} from "../../dtos/buildingDTO";
import {PurchaseService} from "../../services/purchase.service";
import {GameDTOService} from "../../services/game-dto.service";
import {EventDTO} from "../../dtos/eventDTO";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
  standalone: true,
  imports: [
    ModalComponent,
    GridComponent,
    BuildingInfoComponent,
    NgClass
  ]
})
export class EventComponent implements OnInit, OnChanges {

  private gameDTOSubscription = new Subscription()
  private eventSubscription: Subscription | null = null;
  connectionError: boolean = false;

  isModalOpen: boolean = false;

  @Input() event: EventDTO | null = null;
  gameDTO!: FullGameDTO;
  @Input() eventsInitialDelay!: number;
  @Input() isManualKickOff: boolean = false;

  tile?: Tile;

  errorMessage: string | undefined
  modalCustomWidth: string = '';
  showNoGridCapacityModal: boolean = false;

  private showNoFundsModal: boolean = false;

  constructor(private purchaseService: PurchaseService,
              private gameDTOService: GameDTOService) {
  }

  ngOnInit() {
    this.modalCustomWidth = 'width-80';
    this.addGameDTOSubscription()
    if (this.eventsInitialDelay !== 0) {
      setTimeout(() => {
        // this.subscribeToEvents();
      }, this.eventsInitialDelay * 1000);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isManualKickOff'] && changes['isManualKickOff'].currentValue === true) {
      this.kickoffEventScheduler();
    }
  }

  addGameDTOSubscription() {
    this.gameDTOSubscription.add(
      this.gameDTOService.gameDTO$
        .subscribe(updatedDTO => this.gameDTO = updatedDTO!)
    )
  }

  kickoffEventScheduler() {
    console.log("timer kicked off scheduler")
    // this.subscribeToEvents();
  }

  acceptBuilding(building: BuildingDTO) {
    const error = this.purchaseService.validateBuilding(building, this.gameDTO)
    if (error) {
      this.errorMessage = error
      return
    }
    this.purchaseService.purchaseBuilding(building, this.tile!, this.gameDTO)
      .subscribe(updatedDTO => this.gameDTOService.setGameDTO(updatedDTO))
  }

  rejectBuilding(event: EventDTO, gameDTO: FullGameDTO) {
    this.purchaseService.rejectBuilding(event, gameDTO)
    this.toggleEventModal();
  }

  // subscribeToEvents(): void {
  //   this.connectionError = false;
  //   this.eventSubscription = this.gameEventsService.subscribeToBuildingEvents()
  //     .subscribe({
  //       next: (event: EventDTO) => {
  //         console.log("new event recieved");
  //         this.event = event;
  //         this.toggleEventModal();
  //         // this.gameEventsService.pauseBuildingEventScheduler()
  //         //   .subscribe(() => console.log('building events paused'));
  //       },
  //       error: (err) => {
  //         console.error("Error in building event stream:", err);
  //         this.connectionError = true;
  //         this.gameEventsService.unsubscribeFromBuildingEvents();
  //         this.shutdownEventScheduler();
  //       },
  //       complete: () => {
  //         console.log("Building event stream completed");
  //         this.gameEventsService.unsubscribeFromBuildingEvents();
  //         this.shutdownEventScheduler();
  //       }
  //     })
  // }
  //
  // shutdownEventScheduler() {
  //   this.gameEventsService.shutdownEventScheduler().subscribe();
  // }

  toggleEventModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  toggleGridCapacityModal() {
    this.showNoGridCapacityModal = !this.showNoGridCapacityModal;
  }

  assignSelectedTile(tile: Tile) {
    this.tile = tile;
  }

  toggleFundsModal() {
    this.showNoFundsModal = !this.showNoFundsModal;
  }

  cancelEvent() {
    this.event = null;
  }
}
