import {Component, OnInit, ViewChild} from '@angular/core';
import {GameDTOService} from "./services/game-dto.service";
import {ExtendedGameDTO} from "./dtos/extendedGameDTO";
import {Subscription} from "rxjs";
import {BuildingService} from "./services/building.service";
import {MinimizedGameDTO} from "./dtos/minimizedGameDTO";
import {Building} from "./dtos/building";
import {BuildingDashboardComponent} from "./components/building-dashboard/building-dashboard.component";
import {CommonModule} from "@angular/common";
import {EventDTO} from "./services/eventDTO";
import {UpdateDTOService} from "./services/update-dto.service";
import {GameEventsService} from "./services/game-events.service";
import {Supervisor} from "./dtos/supervisor";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {DaytimeWeatherComponent} from "./components/daytime-weather/daytime-weather.component";
import {ModalComponent} from "./components/modal/modal.component";
import {EventComponent} from "./components/event/event.component";
import {TownhallDashboardComponent} from "./components/townhall-dashboard/townhall-dashboard.component";
import {FactoryDashboardComponent} from "./components/factory-dashboard/factory-dashboard.component";
import {UniversityComponent} from "./components/university/university.component";
import {SupervisorComponent} from "./components/supervisor/supervisor.component";
import {MainMenuComponent} from "./main-menu/main-menu.component";

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
    DaytimeWeatherComponent,
    EventComponent,
    UniversityComponent,
    ModalComponent,
    SupervisorComponent,
    NavbarComponent,
    DaytimeWeatherComponent,
    ModalComponent,
    EventComponent,
    MainMenuComponent
  ]
})
export class AppComponent implements OnInit {
  @ViewChild(FactoryDashboardComponent) factoryDashboardComponent?: FactoryDashboardComponent;

  title = 'Energy Management';

  gameDTO!: ExtendedGameDTO;
  supervisor!: Supervisor;
  allBuildings?: Building[];
  event: EventDTO | null = null;
  buildingViewComponentType: string = '';
  dashboardType!: string;
  townHallDashboardText: string = 'town hall';
  factoryDashboardText: string = 'factory';
  buildingDashboardText: string = 'buildings';
  universityDashboard: string = 'university';
  supervisorDashboardText: string = 'supervisor';
  showGridLoadDashboard: boolean = false;
  victoryThreshold: number = 2500;
  isGameInfo = true;
  isChoosePlayer = false;
  selectedDelay: number | null = null;

  isVictory: boolean = false;
  isLoss: boolean = false;
  isGamePreparation: boolean = true;
  isSupervisorDashboard: boolean = false;
  isStartGameWarning: boolean = false;
  startGameWarningText: string = 'Kies een supervisor.'

  isIncomeConnected = false;
  isIncomeConnecting = false;
  incomeErrorMessage: string | null = null;
  isWeatherConnected = false;
  isWeatherConnecting = false;
  weatherErrorMessage: string | null = null;
  initialDelaySchedulers!: number;
  initialDelayNone: number = 0;
  initialDelayMedium: number = 120;
  initialDelayLong: number = 300;
  initialDelayVeryLong: number = 600;
  isManualKickOffEvents: boolean = false;


  private subscriptions: Subscription[] = [];
  infoPageNumber: number = 1;
  isMenu: boolean = false;

  constructor(private gameDTOService: GameDTOService,
              private gameEventsService: GameEventsService,
              private buildingService: BuildingService,
              private updateDTOService: UpdateDTOService) {
  }

  ngOnInit() {
    this.dashboardType = this.buildingDashboardText;
  }

  setInitialDelay(delayChoice: number) {
    this.initialDelaySchedulers = delayChoice;
    this.selectedDelay = delayChoice;
  }

  goToChoosePlayer() {
    this.isGameInfo = false;
    this.isChoosePlayer = true
    this.infoPageNumber = 1;
  }

  startGame() {
    if (!this.supervisor) {
      this.isStartGameWarning = true;
      return;
    } else {
      this.isStartGameWarning = false;
      this.isGamePreparation = false;
      this.initiateGame(this.supervisor);
    }
  }

  initiateGame(supervisor: Supervisor) {
    console.log("initiating game")
    console.log('passing supervisor' + supervisor)
    this.gameDTOService.startGame(supervisor)
      .subscribe(() => {
        console.log(supervisor);
        this.getGameDTO();
        this.subscribeToServerEvents();
        // this.startPopularityScheduler();
      });
  }

  receiveGameDTO(value: ExtendedGameDTO) {
    this.gameDTO = value;
  }

  toggleSupervisorDashboard() {
    this.isSupervisorDashboard = !this.isSupervisorDashboard;
    this.dashboardType = this.supervisorDashboardText;
  }

  toggleMainMenu() {
    this.isMenu = !this.isMenu;
  }

  getGameDTO() {
    this.gameDTOService.getMinimizedGameDto()
      .subscribe(minimizedGameDTO => {
        console.log('minimized gameDTO: {}', minimizedGameDTO);
      this.buildingService.findAllById(minimizedGameDTO)
        .subscribe((buildings: Building[]) => {
          this.gameDTO = this.gameDTOService.extendGameDTO(minimizedGameDTO, buildings);
        })
    });
    this.isGamePreparation = false;
  }

  updateGameDTO(passedGameDTO: ExtendedGameDTO) {
    this.gameDTOService.updateGameDTO(passedGameDTO)
      .subscribe(() => this.gameDTOService.getMinimizedGameDto()
        .subscribe((minimizedDTO: MinimizedGameDTO) => {
          console.log('minimizedDTO: {}', minimizedDTO)
          this.gameDTO = this.gameDTOService.extendGameDTO(minimizedDTO, passedGameDTO.buildings);
          this.getAllBuildings();
          this.decideVictory();
          this.decideLoss();
        })
      );
  }

  turnPage() {
    this.infoPageNumber++;
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

  getSupervisor(supervisorDTO: Supervisor) {
    this.supervisor = supervisorDTO;
  }

  getCityView(value: string) {
    this.dashboardType = value;
  }

  decideVictory() {
    if (this.gameDTO.environmentalScore >= this.victoryThreshold) {
      this.toggleVictory();
    }
  }

  decideLoss() {
    if (this.gameDTO.popularity <= 0) {
      this.toggleLoss();
    }
  }

  toggleVictory() {
    this.isVictory = !this.isVictory;
  }

  toggleLoss() {
    this.isLoss = !this.isLoss;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.gameEventsService.disconnectFromIncome();
    this.gameEventsService.disconnectFromWeather();
  }


  startPopularityScheduler() {
    setTimeout(() => {
      this.gameEventsService.startGoldPopularityLossScheduler()
        .subscribe(), this.initialDelaySchedulers * 1000}
    );
  }

  subscribeToServerEvents(): void {
    this.gameEventsService.connectToIncome();
    this.gameEventsService.connectToWeather();

    this.subscriptions.push(
      this.gameEventsService.getIncomeConnectionStatus().subscribe(status => {
        this.isIncomeConnected = status;
        this.isIncomeConnecting = false;
        console.log('subscribed to income update events')
      })
    );

    this.subscriptions.push(
      this.gameEventsService.getWeatherConnectionStatus().subscribe(status => {
        this.isWeatherConnected = status;
        this.isWeatherConnecting = false;
        console.log('subscribed to weather update events')
      })
    );

    this.subscriptions.push(
      this.gameEventsService.getIncomeUpdates().subscribe(incomeDTO => {
        this.gameDTO = this.updateDTOService.processIncomeAddDTO(incomeDTO, this.gameDTO);
      })
    );

    this.subscriptions.push(
      this.gameEventsService.getWeatherUpdates().subscribe(weatherDTO => {
        this.gameDTO = this.updateDTOService.processDayWeatherUpdateDTO(weatherDTO, this.gameDTO);
      })
    );

    this.subscriptions.push(
      this.gameEventsService.getIncomeErrors().subscribe(error => {
        this.incomeErrorMessage = error;
        setTimeout(() => this.incomeErrorMessage = null, 5000); // Clear error after 5 seconds
      })
    );

    this.subscriptions.push(
      this.gameEventsService.getWeatherErrors().subscribe(error => {
        this.weatherErrorMessage = error;
        setTimeout(() => this.weatherErrorMessage = null, 5000); // Clear error after 5 seconds
      })
    );
  }

  startEventScheduler() {
    this.isManualKickOffEvents = true;
    this.selectedDelay = null;
  }
}
