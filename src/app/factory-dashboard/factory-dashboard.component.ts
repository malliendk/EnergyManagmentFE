import {Component, Input, OnInit} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Building} from "../dtos/building";
import {CommonModule, CurrencyPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BuildingService} from "../services/building.service";
import {
  CATEGORY_POWER_PLANT,
  COAL_PLANT_NAME,
  GAS_PLANT_NAME,
  HYDROGEN_PLANT_NAME,
  NUCLEAR_PLANT_NAME
} from "../constants";
import {GameDTOService} from "../services/game-dto.service";


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

  initialProductionMap = new Map<string, number>();

  //chart values start
  showGridLines = false;
  showYAxis: boolean = true;
  fundsScaleMax: number = 15000;
  gridLoadScaleMax = 15;
  fundsChartResults: number[] = []

  //chart values end

  constructor(private gameDTOService: GameDTOService) {
  }

  ngOnInit(): void {
    this.powerPlants = this.filterPowerPlants();
    this.setSecondaryImages();
    this.initializeProductionMap();
  }

  private filterPowerPlants(): Building[] {
    return this.gameDTO.buildings.filter(building => building.category === CATEGORY_POWER_PLANT);
  }

  private setSecondaryImages() {
    this.selectPowerPlant(COAL_PLANT_NAME).imageUri = 'assets/photos/coal-plant-inside-cut.jpg';
    this.selectPowerPlant(GAS_PLANT_NAME).imageUri = 'assets/photos/gas-plant-inside-cut.jpg';
    this.selectPowerPlant(HYDROGEN_PLANT_NAME).imageUri = 'assets/photos/nuclear-plant-inside-cut.jpg';
    this.selectPowerPlant(NUCLEAR_PLANT_NAME).imageUri = 'assets/photos/hydrogen-plant-cut.jpg';
  }

  private initializeProductionMap() {
    this.powerPlants.forEach(powerPlant => {
      this.initialProductionMap.set(powerPlant.name, powerPlant.energyProduction);
    });
  }

  private selectPowerPlant(Name: string) {
    return <Building>this.powerPlants.find(source => source.name === Name);
  }

  update() {
    this.gameDTOService.updateGameDTO(this.gameDTO)
      .subscribe(() => this.gameDTOService.getMinimizedGameDto()
        .subscribe(minimizedGameDTO => {
          this.gameDTO = this.gameDTOService.extendGameDTO(minimizedGameDTO, this.gameDTO.buildings)
        }))
  }

  recalculateValues(powerPlant: Building, energyProduction: HTMLInputElement): void {
    this.calculateScalingCost(powerPlant, energyProduction);
    this.calculateScore(powerPlant, energyProduction);
  }

  calculateScalingCost(powerPlant: Building, energyProduction: HTMLInputElement): void {
    this.powerPlants.forEach((candidate: Building) => {
      if (powerPlant.name === candidate.name) {
        const initialEnergyProduction: number = this.initialProductionMap.get(candidate.name)!.valueOf();
        const productionDifference: number = initialEnergyProduction - energyProduction.valueAsNumber;
        this.totalScalingCost += productionDifference * this.goldPerProductionUnit;
      }
    })
  }

  calculateScore(powerPlant: Building, energyProduction: HTMLInputElement): void {
    const productionDifference: number = this.maximumProduction - energyProduction.valueAsNumber;
    powerPlant.environmentalScore = productionDifference * this.scorePerProductionUnit;
  }

  applyGrayScale(powerPlant: Building): string {
    const candidate = this.gameDTO.buildings.find(building => powerPlant.id === building.id);
    if (candidate) {
      return ''
    } else {
      return 'grayScale'
    }
  }
}
