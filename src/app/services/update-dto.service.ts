import {Injectable} from '@angular/core';
import {IncomeDTO} from "../dtos/incomeDTO";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {DayWeatherUpdateDTO} from "../dtos/dayWeatherUpdateDTO";

@Injectable({
  providedIn: 'root'
})
export class UpdateDTOService {

  constructor() { }

  processDayWeatherUpdateDTO(dayWeatherUpdateDTO: DayWeatherUpdateDTO, extendedGameDTO: ExtendedGameDTO): ExtendedGameDTO {
    const updatedGameDTO: ExtendedGameDTO = {
      ...extendedGameDTO,
      timeOfDay: dayWeatherUpdateDTO.timeOfDay ?? extendedGameDTO.timeOfDay,
      weatherType: dayWeatherUpdateDTO.weatherType,
    };

    Object.entries(dayWeatherUpdateDTO.newProductions).forEach(([keyStr, production]) => {
      const districtId = parseInt(keyStr, 10);
      const district = updatedGameDTO.districts.find(d => d.id === districtId);
      if (district) {
        district.energyProduction = production;
      }
    });

    Object.entries(dayWeatherUpdateDTO.newConsumptions).forEach(([keyStr, consumption]) => {
      const districtId = parseInt(keyStr, 10);
      const district = updatedGameDTO.districts.find(d => d.id === districtId);
      if (district) {
        district.energyConsumption = consumption;
      }
    });
    return updatedGameDTO;
  }


  processIncomeAddDTO(incomeDTO: IncomeDTO, gameDTO: ExtendedGameDTO): ExtendedGameDTO {
    return {
      ...gameDTO,
      funds: gameDTO.funds + incomeDTO.newFunds,
      popularity: gameDTO.popularity + incomeDTO.newPopularity,
      research: gameDTO.research + incomeDTO.newResearch
    };
  }
}
