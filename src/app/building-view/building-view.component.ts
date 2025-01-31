import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Building} from '../dtos/building';
import {mockBuildings} from "../mocks/mock-buildings";
import {timeout} from "rxjs";

@Component({
  selector: 'app-building-view',
  templateUrl: './building-view.component.html',
  styleUrls: ['./building-view.component.css']
})
export class BuildingViewComponent {

  protected readonly mockBuildings = mockBuildings;

  @Input() viewType: string = '';
  @Input() buildings!: Building[];
  @Output() purchasedBuildingEmitter = new EventEmitter<Building>();
  @Output() passViewType = new EventEmitter<string>();

  building!: Building | null;

  isDetailView: boolean = false;
  purchaseView : string = 'purchase';

  toggleCardDetailView(id: number) {
    this.isDetailView = true;
    this.building = this.buildings.find((building => building.id === id)) as Building | null;
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

  emitViewType(viewType: string) {
    this.passViewType.emit(viewType);
  }
}
