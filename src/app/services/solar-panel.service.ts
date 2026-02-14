import {Injectable} from '@angular/core';
import {BuildingDTO} from "../dtos/buildingDTO";
import {SOLAR_GOLD_INCOME, SOLAR_PRODUCTION, SOLAR_SCIENCE_INCOME, SOLAR_SCORE} from "../solar-panel-values";

@Injectable({
  providedIn: 'root'
})
export class SolarPanelService {

  constructor() { }

  mapValuesToBuilding(building: BuildingDTO, numberOfSolarPanels: number) {
    building.energyProduction += numberOfSolarPanels * SOLAR_PRODUCTION
    building.goldIncome += numberOfSolarPanels * SOLAR_GOLD_INCOME
    building.researchIncome += numberOfSolarPanels * SOLAR_SCIENCE_INCOME
    building.environmentalScore += numberOfSolarPanels * SOLAR_SCORE
    building.solarPanelAmount += numberOfSolarPanels
  }
}
