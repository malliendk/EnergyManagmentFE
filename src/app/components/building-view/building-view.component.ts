import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {ExtendedGameDTO} from "../../dtos/extendedGameDTO";
import {Building} from "../../dtos/building";
import {Tile} from "../../dtos/tile";

@Component({
  selector: 'app-building-view',
  templateUrl: './building-view.component.html',
  styleUrls: ['./building-view.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class BuildingViewComponent implements OnInit {

  @Input() gameDTO!: ExtendedGameDTO;
  @Input() building!: Building
  @Output() cancelDetailView = new EventEmitter<void>();
  @Output() passPurchase = new EventEmitter<{building: Building, tile: Tile}>();

  isPurchasing = false;
  categoryPowerPlant: string = "Energiecentrale";
  categoryHousing: string = 'Woning';
  categoryPublicBuilding: string = "Openbare voorziening";

  constructor() {
  }

  ngOnInit(): void {

  }

  toggleDetailView() {
    this.cancelDetailView.emit();
  }


  selectBuilding(building: Building) {
    // this.passBuilding.emit(building);
    this.isPurchasing = true;
  }

  confirmBuildingPurchase(tile: Tile) {
    this.passPurchase.emit({ building: this.building!, tile: tile });
    this.isPurchasing = false;
  }

  getBorderColor(propertyValue: number) {
    return propertyValue > 0 ? '#e6b904' : 'black';
  }
}
