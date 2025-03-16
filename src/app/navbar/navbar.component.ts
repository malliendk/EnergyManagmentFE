import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {BuildingService} from "../services/building.service";
import {CommonModule, CurrencyPipe} from "@angular/common";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports : [CommonModule, CurrencyPipe]
})
export class NavbarComponent implements OnInit {

  transitionClass = 'nav-demo navbar-expand-lg night'
  toMorning = 'morning';
  toAfternoon = 'afternoon';

  @Input() gameDTO!: ExtendedGameDTO;
  @Output() passViewType = new EventEmitter<string>();
  @Output() passBuildingVieWType = new EventEmitter<string>();

  showButtons: boolean = false;
  viewTypeTownHall: string = 'town hall';
  viewTypeFactory: string = 'factory';
  viewTypeBuildings: string = 'buildings'
  viewTypeBuildingAll: string = 'purchase';
  viewTypeBuildingOverview: string = 'overview';

  constructor(private buildingService: BuildingService) {}

  ngOnInit() {
    this.showButtons = true;
  }

  activateButtons() {
    this.showButtons = !this.showButtons;
  }

  emitBuildingViewType(viewType: string, viewTypeBuilding: string) {
    this.passViewType.emit(viewType);
    this.passBuildingVieWType.emit(viewTypeBuilding)
  }

  emitBuildingViewTypeAll() {
    this.passBuildingVieWType.emit(this.viewTypeBuildingAll);
  }

  emitViewType(viewType: string) {
    this.passViewType.emit(viewType)
  }
}
