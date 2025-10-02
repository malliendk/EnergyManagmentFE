import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs";
import {GameEventsService} from "../services/game-events.service";
import {EventDTO} from "../services/eventDTO";
import {ModalComponent} from "../modal/modal.component";
import {Building} from "../dtos/building";
import {NgClass} from "@angular/common";
import {GridComponent} from "../grid/grid.component";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {BuildingInfoComponent} from "../building-info/building-info.component";
import {Tile} from "../dtos/tile";
import {DistrictInfoComponent} from "../district-info/district-info.component";
import {District} from "../dtos/district";
import {ValidationService} from "../services/validation.service";
import {b} from "@angular/core/navigation_types.d-u4EOrrdZ";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
  standalone: true,
  imports: [
    ModalComponent,
    GridComponent,
    BuildingInfoComponent,
    DistrictInfoComponent,
    NgClass
  ]
})
export class EventComponent implements OnInit, OnChanges {

  private eventSubscription: Subscription | null = null;
  connectionError: boolean = false;

  isModalOpen: boolean = false;

  @Input() event!: EventDTO;
  @Input() gameDTO!: ExtendedGameDTO;
  @Input() eventsInitialDelay!: number;
  @Input() isManualKickOff: boolean = false;
  @Output() passGameDTO = new EventEmitter<ExtendedGameDTO>();
  @Output() passEventResult = new EventEmitter<{
    building: Building | null,
    popularityLoss: number
  }>();

  tile?: Tile;
  district?: District;

  modalCustomWidth: string = '';
  showNoGridCapacityModal: boolean = false;
  noGridCapacityText: string = 'Dit district heeft niet genoeg netcapaciteit om dit gebouw te kunnen bouwen';
  private showNoFundsmodal: boolean = false;

  constructor(private gameEventsService: GameEventsService,
              private validationService: ValidationService) {
  }

  ngOnInit() {
    this.modalCustomWidth = 'width-80';
    if (this.eventsInitialDelay !== 0) {
      setTimeout(() => {
        this.subscribeToEvents();
      }, this.eventsInitialDelay * 1000);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isManualKickOff'] && changes['isManualKickOff'].currentValue === true) {
      this.kickoffEventScheduler();
    }
  }

  kickoffEventScheduler() {
    console.log("timer kicked off scheduler")
    this.subscribeToEvents();
  }

  acceptBuilding(building: Building) {
    if (building.price > this.gameDTO.funds) {
      return;
    }
    console.log(building.price);
    if (this.tile && !this.tile.building) {
      const district = this.gameDTO.districts.find(d => d.id === this.tile!.districtId);
      if (district) {
        const actualTile = district.tiles.find(t => t.id === this.tile!.id);
        if (actualTile) {
          actualTile.building = building;
          actualTile.buildingId = building.id;
        }
      }
      console.log(building.price);
      this.gameDTO.buildings.push(building);
      this.gameDTO.funds -= building.price * 2;
    }

    this.passEventResult.emit({building: building, popularityLoss: 0});
    this.passGameDTO.emit(this.gameDTO);
    this.toggleModal();
    // this.gameEventsService.resumeBuildingEventScheduler()
    //   .subscribe(() => console.log('building events scheduler resumed'));
  }

  rejectBuilding() {
    this.gameDTO.popularity -= this.event.buildingDTO!.popularityCost;
    this.passGameDTO.emit(this.gameDTO);
    this.toggleModal();
    // this.gameEventsService.resumeBuildingEventScheduler()
    //   .subscribe(() => console.log('building events scheduler resumed'));
  }

  validateGridCapacity(district: District, building: Building) {
    if (!this.validationService.validateGridCapacity(district, building)) {
      this.toggleGridCapacityModal();
    }
  }

  validateFunds(building: Building) {
    if (!this.validationService.validateFunds(this.gameDTO, building)) {
      this.toggleFundsModal();
    }
  }

  subscribeToEvents(): void {
    this.connectionError = false;
    this.eventSubscription = this.gameEventsService.subscribeToBuildingEvents()
      .subscribe({
        next: (event: EventDTO) => {
          console.log("new event recieved");
          this.event = event;
          this.toggleModal();
          // this.gameEventsService.pauseBuildingEventScheduler()
          //   .subscribe(() => console.log('building events paused'));
        },
        error: (err) => {
          console.error("Error in building event stream:", err);
          this.connectionError = true;
          this.gameEventsService.unsubscribeFromBuildingEvents();
          this.shutdownEventScheduler();
        },
        complete: () => {
          console.log("Building event stream completed");
          this.gameEventsService.unsubscribeFromBuildingEvents();
          this.shutdownEventScheduler();
        }
      })
  }

  shutdownEventScheduler() {
    this.gameEventsService.shutdownEventScheduler().subscribe();
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  toggleGridCapacityModal() {
    this.showNoGridCapacityModal = !this.showNoGridCapacityModal;
  }

  assignSelectedTile(tile: Tile) {
    this.tile = tile;

    if (this.gameDTO.districts && tile.districtId !== undefined) {
      this.district = this.gameDTO.districts.find(d => d.id === tile.districtId);
    } else {
      console.warn('Districts not initialized or tile has no districtId');
    }
  }

  toggleFundsModal() {
    this.showNoFundsmodal = !this.showNoFundsmodal;
  }
}
