import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {GameDTOService} from "./services/game-dto.service";
import {ExtendedGameDTO} from "./dtos/extendedGameDTO";
import {map, Subscription, switchMap, tap} from "rxjs";
import {BuildingService} from "./services/building.service";
import {MinimizedGameDTO} from "./dtos/minimizedGameDTO";
import {Building} from "./dtos/building";
import {GameEventsService} from "./game-events.service";
import {BuildingDashboardComponent} from "./building-dashboard/building-dashboard.component";
import {FactoryDashboardComponent} from "./factory-dashboard/factory-dashboard.component";
import {TownhallDashboardComponent} from "./townhall-dashboard/townhall-dashboard.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {CommonModule} from "@angular/common";
import {EventDTO} from "./eventDTO";
import {DaytimeWeatherComponent} from "./daytime-weather/daytime-weather.component";
import {EventComponent} from "./event/event.component";
import {UpdateDTOService} from "./services/update-dto.service";
import {UniversityComponent} from "./university/university.component";
import {ModalComponent} from "./modal/modal.component";

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
    // GridloadDashboardComponent,
    DaytimeWeatherComponent,
    EventComponent,
    UniversityComponent,
    ModalComponent
  ]
})
export class AppComponent implements OnInit {
  @ViewChild(FactoryDashboardComponent) factoryDashboardComponent?: FactoryDashboardComponent;

  title = 'Energy Management';

  @Input() gameDTO!: ExtendedGameDTO;
  allBuildings?: Building[];
  event: EventDTO | null = null;

  connectionError: boolean = false;
  private eventSubscription: Subscription | null = null;
  private incomeDTOSubscription: Subscription | null = null;
  private dayWeatherSubscription: Subscription | null = null;

  buildingViewComponentType: string = '';
  dashboardType!: string;
  townHallDashboard: string = 'town hall';
  factoryDashboard: string = 'factory';
  buildingDashboard: string = 'buildings';
  universityDashboard: string = 'university';
  showGridLoadDashboard: boolean = false;
  victoryThreshold: number = 2500;

  isVictory: boolean = false;
  isLoss: boolean = false;

  constructor(private gameDTOService: GameDTOService,
              private gameEventsService: GameEventsService,
              private buildingService: BuildingService,
              private updateDTOService: UpdateDTOService) {
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
        this.subscribeToIncomeDTO();
        this.subscribeToDayWeatherDTO();
      });
  }

  getGameDTO() {
    this.gameDTOService.getMinimizedGameDto().subscribe(minimizedGameDTO => {
      this.buildingService.findAllById(minimizedGameDTO)
        .subscribe((buildings: Building[]) => {
          this.gameDTO = this.gameDTOService.extendGameDTO(minimizedGameDTO, buildings);
        })
    })
  }

  subscribeToIncomeDTO(): void {
    this.connectionError = false;
    this.incomeDTOSubscription = this.gameEventsService.subscribeToIncomeAddDTO()
      .subscribe(incomeDTO => {
          console.log('subscribed to income')
          this.gameDTO = this.updateDTOService.processIncomeAddDTO(incomeDTO, this.gameDTO);
          console.log('executed gameDTO');
        }
      )
  }

  subscribeToDayWeatherDTO(): void {
    this.connectionError = false;
    this.incomeDTOSubscription = this.gameEventsService.subscribeToDayWeatherUpdateDTO()
      .subscribe(dayWeatherDTO => {
        this.gameDTO = this.updateDTOService.processDayWeatherUpdateDTO(dayWeatherDTO, this.gameDTO);
      })
  }

  processCompletedEvent(eventResult: { building: Building | null, popularityLoss: number }) {
    const processedBuilding: Building | null = eventResult.building;
    if (processedBuilding) {
      this.gameDTO = this.buildingService.processPurchasedBuilding(eventResult.building!, this.gameDTO);
      this.gameDTO = {...this.gameDTO}
      this.updateGameDTO(this.gameDTO);
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
          this.decideVictory();
        })
      );
  }

  getViewType(viewTypeset: { viewType: string, showGridLoadDashboard: boolean }) {
    this.dashboardType = viewTypeset.viewType;
    this.showGridLoadDashboard = viewTypeset.showGridLoadDashboard;
  }

  getBuildingViewType(value: string) {
    this.buildingViewComponentType = value;
    this.getAllBuildings();
  }

  getAllBuildings() {
    this.buildingService.findAll()
      .subscribe((buildings: Building[]) => {
        this.allBuildings = buildings;
        this.allBuildings.forEach((building: Building) => building.instanceId = undefined);
      });
  }

  decideVictory() {
    if (this.gameDTO.environmentalScore >= this.victoryThreshold) {
      this.toggleVictory();
    }
  }

  toggleVictory() {
    this.isVictory = !this.isVictory;
  }
}
