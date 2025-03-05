import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Building} from '../dtos/building';

@Component({
    selector: 'app-building-view',
    templateUrl: './building-view.component.html',
    styleUrls: ['./building-view.component.css'],
    standalone: false
})
export class BuildingViewComponent {

  @Input() viewType: string = '';
  @Input() allBuildings!: Building[];
  @Input() purchasedBuildings! : Building[];
  @Output() purchasedBuildingEmitter = new EventEmitter<Building>();
  @Output() passViewType = new EventEmitter<string>();

  building!: Building | null;

  isDetailView: boolean = false;
  purchaseView : string = 'purchase';

  toggleCardDetailView(id: number) {
    this.isDetailView = true;
    this.building = this.allBuildings.find(building => building.id === id) as Building | null;
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

  getCardColumnBackgroundColor(building: Building) {
    return building.canBePurchased ? 'background-color-dark-brown' : 'background-color-grey';
  }
}
