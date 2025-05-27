import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {Building} from "../dtos/building";
import {CommonModule, CurrencyPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BuildingService} from "../services/building.service";
import {COAL_PLANT_NAME, GAS_PLANT_NAME, HYDROGEN_PLANT_NAME, NUCLEAR_PLANT_NAME} from "../constants";
import {GameDTOService} from "../services/game-dto.service";
import {map, switchMap} from "rxjs";
import {ModalComponent} from "../modal/modal.component";

@Component({
  selector: 'app-factory-dashboard',
  templateUrl: './factory-dashboard.component.html',
  styleUrls: ['./factory-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    CurrencyPipe, ModalComponent]
})
export class FactoryDashboardComponent implements OnInit {

  @Input() gameDTO!: ExtendedGameDTO
  @Output() passUpdatedDTO = new EventEmitter<ExtendedGameDTO>();

  powerPlants: Building[] = [];
  minimumProduction: number = 0.0;
  maximumProduction: number = 5000;
  sliderStepValue: number = 1;
  totalScalingCost: number = 0;
  goldPerProductionUnit: number = 5;
  scorePerProductionUnit: number = 0.5;

  isDisabled: boolean = false;
  isModalOpen: boolean = false;

  // Map to store secondary images for display purposes only
  secondaryImagesMap = new Map<number, string>();
  initialProductionMap = new Map<string, number>();

  //chart values start
  showGridLines = false;
  showYAxis: boolean = true;
  fundsScaleMax: number = 15000;
  gridLoadScaleMax = 15;
  fundsChartResults: number[] = []
  //chart values end

  constructor(private buildingService: BuildingService) {
  }

  ngOnInit(): void {
    this.buildingService.getPowerPlants()
      .subscribe(powerPlants => {
        this.powerPlants = powerPlants;
        this.overwriteClassPlant();
        this.initializeSecondaryImages();
        this.initializeProductionMap();
      });
  }

  private initializeSecondaryImages() {
    // Store the secondary images in a separate map, keyed by plant ID
    const coalPlant = this.selectPowerPlant(COAL_PLANT_NAME);
    const gasPlant = this.selectPowerPlant(GAS_PLANT_NAME);
    const hydrogenPlant = this.selectPowerPlant(HYDROGEN_PLANT_NAME);
    const nuclearPlant = this.selectPowerPlant(NUCLEAR_PLANT_NAME);

    if (coalPlant) this.secondaryImagesMap.set(coalPlant.id, 'assets/photos/coal-plant-inside-cut.jpg');
    if (gasPlant) this.secondaryImagesMap.set(gasPlant.id, 'assets/photos/gas-plant-inside-cut.jpg');
    if (hydrogenPlant) this.secondaryImagesMap.set(hydrogenPlant.id, 'assets/photos/hydrogen-plant-cut.jpg');
    if (nuclearPlant) this.secondaryImagesMap.set(nuclearPlant.id, 'assets/photos/nuclear-plant-inside-cut.jpg');
  }

  // Method to get the appropriate image URI for a power plant in this component
  getImageForPlant(powerPlant: Building): string {
    // Return the secondary image if available, otherwise fall back to the original
    return this.secondaryImagesMap.get(powerPlant.id) || powerPlant.imageUri;
  }

  private initializeProductionMap() {
    this.powerPlants.forEach(powerPlant => {
      this.initialProductionMap.set(powerPlant.name, powerPlant.energyProduction);
    });
  }

  private overwriteClassPlant() {
    this.powerPlants = this.powerPlants.map(plant => {
      const ownedPowerPlant = this.gameDTO.buildings.find(building =>
        building.id === plant.id);
      return ownedPowerPlant ?? plant;
    });
  }

  private selectPowerPlant(name: string) {
    return this.powerPlants.find(source => source.name === name);
  }

  processPlantScaling() {
    if (this.totalScalingCost > this.gameDTO.funds) {
      this.toggleModalOpen();
    } else {
      this.gameDTO.funds -= this.totalScalingCost;
      this.totalScalingCost = 0;
      this.passUpdatedDTO.emit(this.gameDTO);
      console.log('emitted DTO: {}', this.gameDTO)
    }
  }

  recalculateValues(powerPlant: Building, energyProduction: HTMLInputElement): void {
    this.calculateScalingCost(powerPlant, energyProduction);
    this.calculateScore(powerPlant, energyProduction);
  }

  calculateScalingCost(powerPlant: Building, energyProductionInput: HTMLInputElement): void {
    const newProduction = energyProductionInput.valueAsNumber;
    const initialProduction = this.initialProductionMap.get(powerPlant.name)!;
    const productionDifference = initialProduction - newProduction;
    const costChange = productionDifference * this.goldPerProductionUnit;
    this.totalScalingCost += costChange;
    this.initialProductionMap.set(powerPlant.name, newProduction);
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

  toggleModalOpen() {
    this.isModalOpen = !this.isModalOpen;
  }

  private checkIfPowerPlantIsOwned(powerPlant: Building) {
    return this.gameDTO.buildings.find(building => powerPlant.id === building.id);
  }
}

