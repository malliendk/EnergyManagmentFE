import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Building} from '../dtos/building';
import {CommonModule} from "@angular/common";
import {
  PurchaseSolarpanelsHousingComponent
} from "../purchase-solarpanels-housing/purchase-solarpanels-housing.component";
import {GridComponent} from "../grid/grid.component";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {GameDTOService} from "../services/game-dto.service";
import {Tile} from "../dtos/tile";
import {DistrictInfoComponent} from "../district-info/district-info.component";

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

  constructor(private gameDTOService: GameDTOService) {
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
