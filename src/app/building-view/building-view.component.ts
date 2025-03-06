import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Building} from '../dtos/building';

@Component({
    selector: 'app-building-view',
    templateUrl: './building-view.component.html',
    styleUrls: ['./building-view.component.css'],
    standalone: false
})
export class BuildingViewComponent implements OnInit{

  @Input() viewType: string = '';
  @Input() buildings!: Building[];
  @Output() purchasedBuildingEmitter = new EventEmitter<Building>();
  @Output() passViewType = new EventEmitter<string>();

  building!: Building | null;
  isDetailView: boolean = false;
  categoryPowerPlant = "Energiecentrale";

  ngOnInit(): void {}

  toggleCardDetailView(id: number) {
    this.isDetailView = true;
    this.building = this.buildings.find(building => building.id === id) || null;
    console.log('this.building:', this.building);
  }

  purchaseBuilding(building: Building) {
    this.purchasedBuildingEmitter.emit(building);
  }

  cancelDetailView() {
    this.building = null;
    this.isDetailView = false;
  }

  getBorderColor(propertyValue: number) {
    return propertyValue > 0 ? '#e6b904' : 'black';
  }
}
