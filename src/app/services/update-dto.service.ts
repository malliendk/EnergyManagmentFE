import { Injectable } from '@angular/core';
import {IncomeAddDTO} from "../IncomeAddDTO";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {DayWeatherUpdateDTO} from "../dayWeatherUpdateDTO";

@Injectable({
  providedIn: 'root'
})
export class UpdateDTOService {

  constructor() { }


  processDayWeatherUpdateDTO(dayWeatherUpdateDTO: DayWeatherUpdateDTO, extendedGameDTO: ExtendedGameDTO) {
    if (dayWeatherUpdateDTO.timeOfDay) {
      extendedGameDTO.timeOfDay = dayWeatherUpdateDTO.timeOfDay;
    }
    extendedGameDTO.weatherType = dayWeatherUpdateDTO.weatherType;
    extendedGameDTO.districts = dayWeatherUpdateDTO.districts;
  }

  processIncomeAddDTO(incomeDTO: IncomeAddDTO, gameDTO: ExtendedGameDTO) {
    gameDTO.funds = incomeDTO.newFunds;
    gameDTO.popularity = incomeDTO.newPopularity;
    gameDTO.research = incomeDTO.newResearch;
  }
}
