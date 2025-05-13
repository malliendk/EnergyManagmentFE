import {Component, Input, OnInit} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Building} from "../dtos/building";
import {CommonModule, CurrencyPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BuildingService} from "../services/building.service";
import {COAL_PLANT_NAME, GAS_PLANT_NAME, HYDROGEN_PLANT_NAME, NUCLEAR_PLANT_NAME} from "../constants";
import {GameDTOService} from "../services/game-dto.service";
import {map, switchMap} from "rxjs";


@Component({
  selector: 'app-factory-dashboard',
  templateUrl: './factory-dashboard.component.html',
  styleUrls: ['./factory-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    CurrencyPipe]
})
export class FactoryDashboardComponent implements OnInit {

  @Input() gameDTO!: ExtendedGameDTO
  powerPlants: Building[] = [];
  minimumProduction: number = 0.0;
  maximumProduction: number = 5000;
  sliderStepValue: number = 1;
  totalScalingCost: number = 0;
  temporaryScalingCost: number = 0;
  goldPerProductionUnit: number = 5;
  scorePerProductionUnit: number = 0.5;

  isDisabled: boolean = false;

  originalImagesMap = new Map<number, string>();
  initialProductionMap = new Map<string, number>();

  //chart values start
  showGridLines = false;
  showYAxis: boolean = true;
  fundsScaleMax: number = 15000;
  gridLoadScaleMax = 15;
  fundsChartResults: number[] = []

  //chart values end

  constructor(private buildingService: BuildingService,
              private gameDTOService: GameDTOService) {
  }

  ngOnInit(): void {
    this.buildingService.getPowerPlants()
      .subscribe(powerPlants => {
        this.powerPlants = powerPlants;
        this.mapToClassPlant();
        this.collectOriginalImages();
        this.setSecondaryImages();
        this.initializeProductionMap();
      });
  }


  private collectOriginalImages() {
    this.powerPlants.forEach(plant => {
      this.originalImagesMap.set(plant.id, plant.imageUri);
    })
  }

  private setSecondaryImages() {
    this.selectPowerPlant(COAL_PLANT_NAME).imageUri = 'assets/photos/coal-plant-inside-cut.jpg';
    this.selectPowerPlant(GAS_PLANT_NAME).imageUri = 'assets/photos/gas-plant-inside-cut.jpg';
    this.selectPowerPlant(HYDROGEN_PLANT_NAME).imageUri = 'assets/photos/hydrogen-plant-cut.jpg';
    this.selectPowerPlant(NUCLEAR_PLANT_NAME).imageUri = 'assets/photos/nuclear-plant-inside-cut.jpg';
  }



  private initializeProductionMap() {
    this.powerPlants.forEach(powerPlant => {
      this.initialProductionMap.set(powerPlant.name, powerPlant.energyProduction);
    });
  }

  private mapToClassPlant() {
     this.powerPlants = this.powerPlants.map(plant => {
        const ownedPowerPlant= this.gameDTO.buildings.find(building => building.id === plant.id);
        return ownedPowerPlant ? {...ownedPowerPlant} : plant;
      });
  }

  private selectPowerPlant(name: string) {
    return <Building>this.powerPlants.find(source => source.name === name);
  }

  update() {
    this.mapFromClassPlant();
    this.gameDTOService.updateGameDTO(this.gameDTO)
      .pipe(
        switchMap(() => {
          return this.gameDTOService.getMinimizedGameDto();
        }),
        map(minimizedGameDTO => {
          return this.gameDTOService.extendGameDTO(minimizedGameDTO, this.gameDTO.buildings);
        })
      )
      .subscribe(extendedGameDTO => {
        console.log('Final Extended GameDTO:', extendedGameDTO);
        this.gameDTO = extendedGameDTO;
        this.initializeProductionMap();
      });
  }

  private mapFromClassPlant() {
    this.gameDTO.buildings = this.gameDTO.buildings.map(building => {
      const classPowerPlant = this.powerPlants.find(plant => building.id === plant.id);
      if (!classPowerPlant) return building;
      const originalImage = this.originalImagesMap.get(classPowerPlant.id);
      return originalImage
        ? {...classPowerPlant, imageUri: originalImage}
        : classPowerPlant;
    });
  }

  recalculateValues(powerPlant: Building, energyProduction: HTMLInputElement): void {
    this.calculateScalingCost(powerPlant, energyProduction);
    this.calculateScore(powerPlant, energyProduction);
  }

  calculateScalingCost(powerPlant: Building, energyProduction: HTMLInputElement): void {
    this.powerPlants.forEach((candidate: Building) => {
      if (powerPlant.name === candidate.name) {
        const initialEnergyProduction = this.initialProductionMap.get(candidate.name)!.valueOf();
        const productionDifference = initialEnergyProduction - energyProduction.valueAsNumber;
        this.totalScalingCost += productionDifference * this.goldPerProductionUnit;
      }
    })
  }

  calculateScore(powerPlant: Building, energyProduction: HTMLInputElement): void {
    const productionDifference = this.maximumProduction - energyProduction.valueAsNumber;
    powerPlant.environmentalScore = productionDifference * this.scorePerProductionUnit;
  }

  applyGrayScale(powerPlant: Building): string {
    const candidate: Building | undefined = this.checkIfPowerPlantIsOwned(powerPlant);
    if (candidate) {
      return '';
    } else {
      this.toggleDisabled();
      return 'disabled';
    }
  }

  toggleDisabled() {
    this.isDisabled = !this.isDisabled;
  }

  private checkIfPowerPlantIsOwned(powerPlant: Building) {
    return this.gameDTO.buildings.find(building => powerPlant.id === building.id);
  }
}
