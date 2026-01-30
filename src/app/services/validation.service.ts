import {Injectable} from '@angular/core';
import {District} from "../dtos/district";
import {Building} from "../dtos/building";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  validateGridCapacity(district: District, buildingToPurchase: Building): boolean {
    console.log(buildingToPurchase)
    if (!district || district.gridCapacity == null) return true;
    let buildingEnergyChange = 0;
    if (buildingToPurchase.energyProduction != null) {
      buildingEnergyChange = buildingToPurchase.energyProduction;
    } else if (buildingToPurchase.energyConsumption != null) {
      buildingEnergyChange = -buildingToPurchase.energyConsumption;
    }
    const newGridLoad = district.energyProduction - district.energyConsumption + buildingEnergyChange;
    return Math.abs(newGridLoad) <= district.gridCapacity;
  }

  validateFunds(gameDTO: ExtendedGameDTO, building: Building): boolean {
    if (building.price > gameDTO.funds) {
      return false;
    }
    return true;
  }
}
