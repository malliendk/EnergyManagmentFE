import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Building} from '../dtos/building';
import {mockBuildings} from "../mocks/mock-buildings";
import {timeout} from "rxjs";

@Component({
    selector: 'app-building-view',
    templateUrl: './building-view.component.html',
    styleUrls: ['./building-view.component.css'],
    standalone: false
})
export class BuildingViewComponent {

  protected readonly mockBuildings = mockBuildings;

  @Input() viewType: string = '';
  @Input() allBuildings!: Building[];
  @Input() purchasedBuildings! : Building[];
  @Output() purchasedBuildingEmitter = new EventEmitter<Building>();
  @Output() passViewType = new EventEmitter<string>();

  building!: Building | null;

  isDetailView: boolean = false;
  purchaseView : string = 'purchase';
  isPurchased: boolean = false;

  toggleCardDetailView(id: number) {
    this.isDetailView = true;
    this.building = this.allBuildings.find(building => building.id === id) as Building | null;
    const isPurchased = this.purchasedBuildings.find(building => building.id === id);
    if (isPurchased) {
      this.isPurchased = true;
    }
  }

  purchaseBuilding(building: Building) {
    this.purchasedBuildingEmitter.emit(building);
    setTimeout(() => {
      this.cancelDetailView()
    }, 500);
  }

  cancelDetailView() {
    this.building = null;
    this.isDetailView = false;
  }

  getBorderColor(propertyValue: number) {
    return propertyValue > 0 ? '#e6b904' : 'black';
  }

  findIfBuildingIsPurchased() {

  }
}
