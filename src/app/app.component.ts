import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {EventDTO} from "./eventDTO";
import {SharedModule} from "./shared.module";
import {ModalComponent} from "./modal/modal.component";
import {DaytimeWeatherComponent} from "./daytime-weather/daytime-weather.component";
import {EventComponent} from "./event/event.component";
import {Router} from "@angular/router";
import {BuildingViewComponent} from "./building-view/building-view.component";

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
export class AppComponent implements OnInit {
  @ViewChild(BuildingDashboardComponent) buildingDashboardComponent?: BuildingDashboardComponent;

  title = 'Energy Management';

  gameDTO!: ExtendedGameDTO;
  allBuildings?: Building[];
  event: EventDTO | null = null;

  connectionError: boolean = false;
  private gameDTOSubscription: Subscription | null = null;
  private eventSubscription: Subscription | null = null;

  buildingViewComponentType: string = '';
  buildingViewOverview: string = 'overview';
  dashboardType!: string;
  townHallDashboard: string = 'town hall';
  factoryDashboard: string = 'factory';
  buildingDashboard: string = 'buildings';
  showGridLoadDashboard: boolean = false;

  constructor(private gameDTOService: GameDTOService,
              private gameEventsService: GameEventsService,
              private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.dashboardType = this.factoryDashboard;
    this.buildingViewComponentType = this.buildingDashboard;
    this.initiateGame();
  }


  initiateGame() {
    console.log("initiating game")
    this.gameDTOService.startGame()
      .subscribe(() => {
        this.getGameDTO();
        this.gameDTO.timeOfDay = 'night';
        this.subscribeToGameDTO();
      });
  }

  getGameDTO() {
    this.gameDTOService.getMinimizedGameDto().subscribe(minimizedGameDTO => {
      this.buildingService.getBuildingsById(minimizedGameDTO)
        .subscribe((buildings: Building[]) => {
          this.gameDTO = this.gameDTOService.extendGameDTO(minimizedGameDTO, buildings);
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
                gameBuildings.forEach(building => this.buildingService.generateInstanceId(building));
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
      this.gameDTO = this.buildingService.processPurchasedBuilding(eventResult.building!, this.gameDTO);
      this.gameDTO = {...this.gameDTO}
      this.updateGameDTO(this.gameDTO);
      if (this.buildingDashboardComponent) {
        this.buildingDashboardComponent.updateHeldBuildingsOverview();
      }
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
          // this.buildingViewComponentType = this.buildingViewOverview;
        }));
  }

  getViewType(viewTypeset: {viewType: string, showGridLoadDashboard: boolean}) {
    this.dashboardType = viewTypeset.viewType;
    this.showGridLoadDashboard = viewTypeset.showGridLoadDashboard;
  }

  getBuildingViewType(value: string) {
    this.buildingViewComponentType = value;
    this.getAllBuildings();
  }

  getAllBuildings() {
    this.buildingService.getAll()
      .subscribe((buildings: Building[]) => {
        this.allBuildings = buildings;
        this.allBuildings.forEach((building: Building) => building.instanceId = undefined);
      });
  }


}
