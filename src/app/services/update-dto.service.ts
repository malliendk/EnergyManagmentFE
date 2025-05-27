import { Injectable } from '@angular/core';
import {IncomeAddDTO} from "../IncomeAddDTO";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {DayWeatherUpdateDTO} from "../dtos/dayWeatherUpdateDTO";

@Injectable({
  providedIn: 'root'
})
export class UpdateDTOService {

  constructor() { }

  processDayWeatherUpdateDTO(dayWeatherUpdateDTO: DayWeatherUpdateDTO, extendedGameDTO: ExtendedGameDTO): ExtendedGameDTO {
    return {
      ...extendedGameDTO,
      timeOfDay: dayWeatherUpdateDTO.timeOfDay ?? extendedGameDTO.timeOfDay,
      weatherType: dayWeatherUpdateDTO.weatherType,
      districts: dayWeatherUpdateDTO.districts
    };
  }

  processIncomeAddDTO(incomeDTO: IncomeAddDTO, gameDTO: ExtendedGameDTO): ExtendedGameDTO {
    console.log('executing incomeDTO: {}', incomeDTO);
    console.log('original gameDTO: {}', gameDTO);
    return {
      ...gameDTO,
      funds: incomeDTO.newFunds,
      popularity: incomeDTO.newPopularity,
      research: incomeDTO.newResearch
    };
  }
}
