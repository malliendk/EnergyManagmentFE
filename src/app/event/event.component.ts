import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {GameEventsService} from "../services/game-events.service";
import {EventDTO} from "../services/eventDTO";
import {ModalComponent} from "../modal/modal.component";
import {Building} from "../dtos/building";
import {NgStyle} from "@angular/common";
import {GridComponent} from "../grid/grid.component";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {BuildingInfoComponent} from "../building-info/building-info.component";
import {Tile} from "../dtos/tile";
import {BuildingService} from "../services/building.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
  standalone: true,
  imports: [
    ModalComponent,
    GridComponent,
    BuildingInfoComponent
  ]
})
export class EventComponent implements OnInit {

  private eventSubscription: Subscription | null = null;
  connectionError: boolean = false;

  isModalOpen: boolean = false;

  @Input() event!: EventDTO;
  @Input() gameDTO!: ExtendedGameDTO;
  @Output() passGameDTO = new EventEmitter<ExtendedGameDTO>();
  @Output() passEventResult = new EventEmitter<{
    building: Building | null,
    popularityLoss: number
  }>();

  tile?: Tile;

  modalCustomWidth = '';

  constructor(private gameEventsService: GameEventsService,
              private buildingService: BuildingService ) {
  }

  ngOnInit() {
    this.modalCustomWidth = 'width-80'
    this.subscribeToEvents();
  }

  acceptBuilding(building: Building) {
    if (this.tile && !this.tile.building && this.gameDTO.funds >= building.price) {
      const district = this.gameDTO.districts.find(d => d.id === this.tile!.districtId);
      if (district) {
        const actualTile = district.tiles.find(t => t.id === this.tile!.id);
        if (actualTile) {
          actualTile.building = building;
          actualTile.buildingId = building.id;
        }
      }
      this.gameDTO.buildings.push(building);
      this.gameDTO.funds -= building.price;
    }

    this.passEventResult.emit({building: building, popularityLoss: 0});
    this.passGameDTO.emit(this.gameDTO);
    this.toggleModal();
    this.gameEventsService.resumeBuildingEventScheduler()
      .subscribe(() => console.log('building events scheduler resumed'));
  }

  rejectBuilding() {
    this.gameDTO.popularity -= this.event.buildingDTO!.popularityCost;
    this.passGameDTO.emit(this.gameDTO);
    this.toggleModal();
    this.gameEventsService.resumeBuildingEventScheduler()
      .subscribe(() => console.log('building events schedulder resumed')
      );
  }

  subscribeToEvents(): void {
    this.connectionError = false;
    this.eventSubscription = this.gameEventsService.subscribeToBuildingEvents()
      .subscribe({
        next: (event: EventDTO) => {
          console.log("new event recieved");
          this.event = event;
          this.toggleModal();
          this.gameEventsService.pauseBuildingEventScheduler()
            .subscribe(() => console.log('building events paused'));
        }
      })
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  assignSelectedTile(tile: Tile) {
    this.tile = tile;
  }
}
