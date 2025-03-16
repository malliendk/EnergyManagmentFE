import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameDTOService} from "./services/game-dto.service";
import {ExtendedGameDTO} from "./dtos/extendedGameDTO";
import {Subscription} from "rxjs";
import {BuildingService} from "./services/building.service";
import {MinimizedGameDTO} from "./dtos/minimizedGameDTO";
import {Building} from "./dtos/building";
import {GameEventsService} from "./game-events.service";
import {cloneDeep} from "lodash";
import {DayWeatherService} from "./services/day-weather.service";
import {BuildingDashboardComponent} from "./building-dashboard/building-dashboard.component";
import {FactoryDashboardComponent} from "./factory-dashboard/factory-dashboard.component";
import {TownhallDashboardComponent} from "./townhall-dashboard/townhall-dashboard.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {CommonModule} from "@angular/common";
import {GridloadDashboardComponent} from "./gridload-dashboard/gridload-dashboard.component";
import {Event} from "./event";
import {SharedModule} from "./shared.module";
import {ModalComponent} from "./modal/modal.component";
import {DaytimeWeatherComponent} from "./daytime-weather/daytime-weather.component";
import {EventComponent} from "./event/event.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    TownhallDashboardComponent,
    FactoryDashboardComponent,
    BuildingDashboardComponent,
    GridloadDashboardComponent,
    DaytimeWeatherComponent,
    EventComponent,
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Energy Management';

  gameDTO!: ExtendedGameDTO;
  allBuildings?: Building[];
  event: Event | null = null;

  connectionError: boolean = false;
  private gameDTOSubscription: Subscription | null = null;
  private eventSubscription: Subscription | null = null;

  buildingViewComponentType: string = '';
  passingViewType!: string;
  viewTypeTownHall: string = 'town hall';
  viewTypeFactory: string = 'factory';
  viewTypeBuildings: string = 'buildings';

  constructor(private gameDTOService: GameDTOService,
              private gameEventsService: GameEventsService,
              private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.passingViewType = this.viewTypeBuildings;
    this.buildingViewComponentType = this.viewTypeBuildings;
    this.unsubscribeEvents();
    this.initiateGame();
  }

  initiateGame() {
    console.log("initiating game")
    this.gameDTOService.startGame()
      .subscribe(() => {
        this.getGameDTO();
        this.subscribeToGameDTO();
      });
  }

  getGameDTO() {
    this.gameDTOService.getMinimizedGameDto().subscribe(minimizedGameDTO => {
      this.buildingService.getBuildingsById(minimizedGameDTO)
        .subscribe((buildings: Building[]) => {
          this.gameDTO = this.gameDTOService.extendGameDTO(minimizedGameDTO, buildings);
          console.log('got gameDTO: {}', this.gameDTO)
        })
    })
  }

  subscribeToGameDTO(): void {
    this.connectionError = false;
    this.gameDTOSubscription = this.gameEventsService.subscribeToGameDTO()
      .subscribe({
        next: (minimizedDTO: MinimizedGameDTO) => {
          this.buildingService.getBuildingsById(minimizedDTO)
            .subscribe({
              next: (gameBuildings: Building[]) => {
                gameBuildings.forEach(b => b.instanceId = this.buildingService.generateUniqueId());
                this.gameDTO = this.gameDTOService.extendGameDTO(minimizedDTO, gameBuildings);
              },
              error: (buildingError) => {
                console.error('Error fetching buildings:', buildingError);
              }
            });
          this.connectionError = false;
        },
        error: (error) => {
          console.error('SSE connection error:', error);
          this.connectionError = true;
          setTimeout(() => this.subscribeToGameDTO(), 5000);
        }
      });
  }

  processCompletedEvent(eventResult: {building: Building | null, popularityLoss: number}) {
    const processedBuilding: Building | null = eventResult.building;
    if (processedBuilding) {
      this.buildingService.processPurchasedBuilding(eventResult.building!, this.gameDTO);
      this.updateGameDTO(this.gameDTO)
    } else {
      this.gameDTO.popularity -= eventResult.popularityLoss;
    }
  }

  updateGameDTO(passedGameDTO: ExtendedGameDTO) {
    this.gameDTOService.updateGameDTO(passedGameDTO)
      .subscribe(() => this.gameDTOService.getMinimizedGameDto()
        .subscribe((minimizedDTO: MinimizedGameDTO) => {
          this.gameDTO = this.gameDTOService.extendGameDTO(minimizedDTO, passedGameDTO.buildings);
          this.getAllBuildings();
        }));
  }

  getViewType(value: string) {
    this.passingViewType = value;
  }

  getBuildingViewType(value: string) {
    this.buildingViewComponentType = value;
    this.getAllBuildings();
  }

  getAllBuildings() {
    this.buildingService.getAll()
      .subscribe((buildings: Building[]) => {
        this.allBuildings = cloneDeep(buildings);
        this.allBuildings.forEach((building: Building) => building.instanceId = undefined);
      });
  }


  ngOnDestroy(): void {
    this.unsubscribeEvents();
  }

  unsubscribeEvents() {
    if (this.gameDTOSubscription) {
      this.gameDTOSubscription.unsubscribe();
      this.gameEventsService.unsubscribe();
    }
  }
}
