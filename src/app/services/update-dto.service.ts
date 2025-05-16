import { Injectable } from '@angular/core';
import {IncomeAddDTO} from "../IncomeAddDTO";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {DayWeatherUpdateDTO} from "../dayWeatherUpdateDTO";

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
    return {
      ...gameDTO,
      funds: incomeDTO.newFunds,
      popularity: incomeDTO.newPopularity,
      research: incomeDTO.newResearch
    };
  }
}
