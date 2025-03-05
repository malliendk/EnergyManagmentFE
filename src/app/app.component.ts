import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {GameDTOService} from "./services/game-dto.service";
import {ExtendedGameDTO} from "./dtos/extendedGameDTO";
import {Observable, Subscription} from "rxjs";
import {TimeOfDay, TimesOfDay} from "./timeOfDay";
import {BuildingService} from "./services/building.service";
import {MinimizedGameDTO} from "./dtos/minimizedGameDTO";
import {Building} from "./dtos/building";
import {BuildingRequest} from "./buildingRequest";
import {GameEventsService} from "./game-events.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnDestroy {
  title = 'Energy Management';

  minimizedGameDTO: MinimizedGameDTO | null = null;
  gameDTO!: ExtendedGameDTO;

  connectionError: boolean = false;
  private eventsSubscription: Subscription | null = null;

  buildingViewComponentType: string = '';
  passingViewType!: string;
  viewTypeTownHall: string = 'town hall';
  viewTypeFactory: string = 'factory';
  viewTypeBuildings: string = 'buildings'

  constructor(private gameDTOService: GameDTOService,
              private gameEventsService: GameEventsService,
              private buildingService: BuildingService) {
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
    this.gameDTOService.getGameDto().subscribe(minimizedGameDTO => {
      this.buildingService.getBuildingsById(minimizedGameDTO)
        .subscribe(buildings => {
          this.gameDTO = this.gameDTOService.extendGameDTO(minimizedGameDTO, buildings);
          console.log(this.gameDTO)
        })
    })
  }

  subscribeToGameEvents(): void {
    this.connectionError = false;
    this.eventsSubscription = this.gameEventsService.subscribeToGameEvents()
      .subscribe({
        next: (minimizedDTO: MinimizedGameDTO) => {
          console.log('Received event:', minimizedDTO); // Add detailed logging
          this.minimizedGameDTO = minimizedDTO;
          this.buildingService.getBuildingsById(minimizedDTO)
            .subscribe({
              next: (gameBuildings: Building[]) => {
                this.gameDTO = this.gameDTOService.extendGameDTO(minimizedDTO, gameBuildings);
                console.log('Updated gameDTO:', this.gameDTO);
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

  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  getViewType(value: string) {
    this.passingViewType = value;
    console.log(`passing view types from navbar: ${this.passingViewType}`, ` ${this.buildingViewComponentType}`)
  }

  getBuildingViewType(value: string) {
    this.buildingViewComponentType = value;
  }
}
