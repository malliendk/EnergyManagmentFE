import {Component, OnInit, ViewChild} from '@angular/core';
import {GameDTOService} from "./services/game-dto.service";
import {GameDTO} from "./dtos/gameDTO";
import {Subscription} from "rxjs";
import {BuildingDashboardComponent} from "./building-dashboard/building-dashboard.component";
import {CommonModule} from "@angular/common";
import {Supervisor} from "./dtos/supervisor";
import {NavbarComponent} from "./game-dto/navbar/navbar.component";
import {DaytimeWeatherComponent} from "./daytime-weather/daytime-weather.component";
import {EventComponent} from "./game-dto/event/event.component";
import {TownHallDashboardComponent} from "./components/townhall-dashboard/town-hall-dashboard.component";
import {FactoryDashboardComponent} from "./factory-dashboard/factory-dashboard.component";
import {UniversityComponent} from "./components/university/university.component";
import {SupervisorComponent} from "./game-dto/supervisor/supervisor.component";
import {MainMenuComponent} from "./game-dto/main-menu/main-menu.component";
import {BuildingService} from "./services/building.service";
import {ModalComponent} from "./components/modal/modal.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    TownHallDashboardComponent,
    FactoryDashboardComponent,
    BuildingDashboardComponent,
    DaytimeWeatherComponent,
    UniversityComponent,
    SupervisorComponent,
    NavbarComponent,
    DaytimeWeatherComponent,
    EventComponent,
    MainMenuComponent,
    ModalComponent,
  ]
})
export class AppComponent implements OnInit {
  @ViewChild(FactoryDashboardComponent) factoryDashboardComponent?: FactoryDashboardComponent;

  private gameDTOSubscription = new Subscription()
  gameDTO!: GameDTO;

  title = 'Energy Management';

  supervisor!: Supervisor;
  buildingViewComponentType: string = '';
  dashboardType!: string;
  townHallDashboardText: string = 'town hall';
  factoryDashboardText: string = 'factory';
  buildingDashboardText: string = 'buildings';
  universityDashboard: string = 'university';
  supervisorDashboardText: string = 'supervisor';
  victoryThreshold: number = 5000;
  isGameInfo = true;
  isChoosePlayer = true;
  selectedDelay: number | null = null;

  isVictory: boolean = false;
  isLoss: boolean = false;
  isGamePreparation: boolean = true;
  isSupervisorDashboard: boolean = false;
  isStartGameWarning: boolean = false;
  startGameWarningText: string = 'Choose your supervisor.'

  initialDelaySchedulers!: number;
  initialDelayNone: number = 0;
  initialDelayMedium: number = 120;
  initialDelayLong: number = 300;
  initialDelayVeryLong: number = 600;
  isManualKickOffEvents: boolean = false;

  isLoading = false;
  isLoadingText = ''

  infoPageNumber: number = 1;
  isMenu: boolean = false;

  constructor(private gameDTOService: GameDTOService,
              private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.dashboardType = this.buildingDashboardText;
    this.gameDTOSubscription.add(
      this.gameDTOService.gameDTO$
        .subscribe(updatedGameDTO => {
          this.gameDTO = updatedGameDTO!
        })
    )
  }

  startGame() {
    if (!this.supervisor) {
      this.isStartGameWarning = true
      return;
    } else {
      this.toggleIsLoading();
      this.initiateGame(this.supervisor)
      this.addGameDTOSubscription()
    }
  }

  initiateGame(supervisor: Supervisor) {
    console.log("initiating game")
    this.isLoadingText = 'Game is loading...'
    this.isStartGameWarning = false;
    this.isGamePreparation = false;
    this.gameDTOService.startGame(supervisor)
      .subscribe({
        next: (gameDTO: GameDTO) => {
          this.gameDTO = gameDTO
          this.isChoosePlayer = false
          this.gameDTOService.startStream()
          this.toggleIsLoading()
          this.buildingService.findAll().subscribe(
            buildings => {
              console.log(buildings)
              this.buildingService.setBuildings(buildings)
            }
          )
        },
        error: err => {
          this.isLoadingText = "An unexpected error occurred during startup"
          throw new Error("Error during startup: {}", err)
        }
      })
  }

  addGameDTOSubscription() {
    this.gameDTOSubscription.add(
      this.gameDTOService.gameDTO$
        .subscribe(gameDTO => {
          this.gameDTO = gameDTO!
          this.decideVictory();
          this.decideLoss();
        })
    )
  }

  toggleSupervisorDashboard() {
    this.isSupervisorDashboard = !this.isSupervisorDashboard;
    this.dashboardType = this.supervisorDashboardText;
  }

  toggleMainMenu() {
    this.isMenu = !this.isMenu;
  }

  updateGameDTO(passedGameDTO: GameDTO) {
    this.gameDTOService.updateGameDTO(passedGameDTO)
      .subscribe(gameDTO => {
          console.log('updated DTO: {}', gameDTO)
        }
      )
  }

  turnPage() {
    this.infoPageNumber++;
  }

  getViewType(viewTypeset: { viewType: string, showGridLoadDashboard: boolean }) {
    this.dashboardType = viewTypeset.viewType;
  }

  getBuildingViewType(value: string) {
    this.buildingViewComponentType = value;
  }

  getSupervisor(supervisorDTO: Supervisor) {
    this.supervisor = supervisorDTO;
  }

  getCityView(value: string) {
    this.dashboardType = value;
  }

  decideVictory() {
    if (this.gameDTO && this.gameDTO.environmentalScore >= this.victoryThreshold) {
      this.toggleVictory();
      console.log('victory!')
    }
  }

  decideLoss() {
    if (this.gameDTO && this.gameDTO.popularity <= 0) {
      this.toggleLoss();
    }
  }

  toggleVictory() {
    this.isVictory = !this.isVictory;
  }

  toggleLoss() {
    this.isLoss = !this.isLoss;
  }

  startEventScheduler() {
    this.isManualKickOffEvents = true;
    this.selectedDelay = null;
  }

  private toggleIsLoading() {
    this.isLoading = !this.isLoading;
  }

  private setInitialDelay(delayChoice: number) {
    this.initialDelaySchedulers = delayChoice;
    this.selectedDelay = delayChoice;
  }
}
