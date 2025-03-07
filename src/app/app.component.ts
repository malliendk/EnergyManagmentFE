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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Energy Management';

  minimizedGameDTO: MinimizedGameDTO | null = null;
  gameDTO!: ExtendedGameDTO;
  allBuildings?: Building[];

  connectionError: boolean = false;
  private eventsSubscription: Subscription | null = null;

  buildingViewComponentType: string = '';
  passingViewType!: string;
  viewTypeTownHall: string = 'town hall';
  viewTypeFactory: string = 'factory';
  viewTypeBuildings: string = 'buildings';

  timeOfDayColor: string = '#FFFFF';
  weatherTypeColor: string = '#FFFFF'

  constructor(private gameDTOService: GameDTOService,
              private gameEventsService: GameEventsService,
              private buildingService: BuildingService,
              private dayWeatherService: DayWeatherService) {
  }

  ngOnInit() {
    this.passingViewType = this.viewTypeBuildings;
    this.buildingViewComponentType = this.viewTypeBuildings;
  }

  initiateGame() {
    console.log("initiating game")
    this.gameDTOService.startGame()
      .subscribe(() => {
        this.getGameDTO();
        this.subscribeToGameEvents();
      });
  }

  getGameDTO() {
    this.gameDTOService.getMinimizedGameDto().subscribe(minimizedGameDTO => {
      this.buildingService.getBuildingsById(minimizedGameDTO)
        .subscribe((buildings: Building[]) => {
          this.gameDTO = this.gameDTOService.extendGameDTO(minimizedGameDTO, buildings);
          console.log('got gameDTO: {}', this.gameDTO)
          this.updateDayWeather(this.gameDTO.timeOfDay, this.gameDTO.weatherType)
        })
    })
  }

  subscribeToGameEvents(): void {
    this.connectionError = false;
    this.eventsSubscription = this.gameEventsService.subscribeToGameEvents()
      .subscribe({
        next: (minimizedDTO: MinimizedGameDTO) => {
          this.minimizedGameDTO = minimizedDTO;
          this.buildingService.getBuildingsById(minimizedDTO)
            .subscribe({
              next: (gameBuildings: Building[]) => {
                let ownedBuildings: Building[] = cloneDeep(gameBuildings);
                ownedBuildings.forEach(b => b.instanceId = this.buildingService.generateUniqueId());
                this.gameDTO = this.gameDTOService.extendGameDTO(minimizedDTO, ownedBuildings);
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
          setTimeout(() => this.subscribeToGameEvents(), 5000);
        }
      });
  }

  updateGameDTO(passedGameDTO: ExtendedGameDTO) {
    this.gameDTOService.updateGameDTO(passedGameDTO)
      .subscribe(() => this.gameDTOService.getMinimizedGameDto()
        .subscribe((minimizedDTO: MinimizedGameDTO) => {
          this.gameDTO = this.gameDTOService.extendGameDTO(minimizedDTO, passedGameDTO.buildings);
          this.getAllBuildings();
          this.updateDayWeather(this.gameDTO.timeOfDay, this.gameDTO.weatherType)
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

  updateDayWeather(timeOfDay: string, weatherType: string) {
    this.timeOfDayColor = this.dayWeatherService.getTimeOfDayColor(timeOfDay);
    this.weatherTypeColor = (weatherType === 'sunny')
      ? this.timeOfDayColor
      : this.dayWeatherService.getWeatherTypeColor(weatherType);
  }

  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }
}
