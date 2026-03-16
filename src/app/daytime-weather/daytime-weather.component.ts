import {Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {CommonModule} from "@angular/common";
import {GameDTO} from "../dtos/gameDTO";
import {GameDTOService} from "../services/game-dto.service";
import {
  TIME_OF_DAY_AFTERNOON,
  TIME_OF_DAY_EVENING,
  TIME_OF_DAY_MORNING,
  TIME_OF_DAY_NIGHT,
  WEATHER_TYPE_MODERATE,
  WEATHER_TYPE_OVERCAST,
  WEATHER_TYPE_RAINY,
  WEATHER_TYPE_SUNNY
} from "../constants/constants";

@Component({
  selector: 'app-daytime-weather',
  templateUrl: './daytime-weather.component.html',
  styleUrls: ['./daytime-weather.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DaytimeWeatherComponent implements OnInit {

  gameDTO!: GameDTO;
  private subscription = new Subscription()

  constructor(private gameDTOService: GameDTOService) {}


  ngOnInit() {
    this.subscription.add(
      this.gameDTOService.gameDTO$
        .subscribe(gameDTO => this.gameDTO = gameDTO!)
    )
  }

  getDayWeatherColor(timeOfDay: string, weatherType: string): string {
    return 'afternoon sun'
    //   switch (timeOfDay + ' ' + weatherType) {
    //     case TIME_OF_DAY_MORNING + ' ' + WEATHER_TYPE_SUNNY:
    //       return 'morning transition'
    //     case TIME_OF_DAY_MORNING + ' ' + WEATHER_TYPE_MODERATE:
    //       return 'morning moderate'
    //     case TIME_OF_DAY_MORNING + ' ' + WEATHER_TYPE_OVERCAST:
    //       return 'daytime-overcast'
    //     case TIME_OF_DAY_MORNING + ' ' + WEATHER_TYPE_RAINY:
    //       return 'daytime-rainy'
    //     case TIME_OF_DAY_AFTERNOON + ' ' + WEATHER_TYPE_SUNNY:
    //       return 'afternoon transition'
    //     case TIME_OF_DAY_AFTERNOON + ' ' + WEATHER_TYPE_MODERATE:
    //       return 'afternoon moderate transition'
    //     case TIME_OF_DAY_AFTERNOON + ' ' + WEATHER_TYPE_OVERCAST:
    //       return 'daytime-overcast'
    //     case TIME_OF_DAY_AFTERNOON + ' ' + WEATHER_TYPE_RAINY:
    //       return 'daytime-rainy transition'
    //     case TIME_OF_DAY_EVENING + ' ' + WEATHER_TYPE_SUNNY:
    //       return 'evening transition'
    //     case TIME_OF_DAY_EVENING + ' ' + WEATHER_TYPE_MODERATE:
    //       return 'evening cloudy transition'
    //     case TIME_OF_DAY_EVENING + ' ' + WEATHER_TYPE_OVERCAST:
    //       return 'daytime-overcast'
    //     case TIME_OF_DAY_EVENING + ' ' + WEATHER_TYPE_RAINY:
    //       return 'daytime-rainy'
    //     case TIME_OF_DAY_NIGHT + ' ' + WEATHER_TYPE_SUNNY:
    //       return 'night'
    //     case TIME_OF_DAY_NIGHT + ' ' + WEATHER_TYPE_MODERATE:
    //       return 'night cloudy-grey'
    //     case TIME_OF_DAY_NIGHT + ' ' + WEATHER_TYPE_OVERCAST:
    //       return 'nighttime-overcast'
    //     case TIME_OF_DAY_NIGHT + ' ' + WEATHER_TYPE_RAINY:
    //       return 'night rainy'
    //     default: return ''
    //   }
    }
}


