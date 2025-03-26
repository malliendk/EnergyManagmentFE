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

  @Input() gameDTO!: ExtendedGameDTO;
  @Output() passViewType = new EventEmitter<{
    viewType: string,
    showGridLoadDashboard: boolean
  }>();
  @Output() passBuildingVieWType = new EventEmitter<string>();

  showButtons: boolean = false;
  townHallDashboard: string = 'town hall';
  factoryDashboard: string = 'factory';
  buildingDashboard: string = 'buildings'
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
    this.passViewType.emit({viewType: viewType, showGridLoadDashboard: true});
    this.passBuildingVieWType.emit(viewTypeBuilding)
  }

  emitBuildingViewTypeAll() {
    this.passBuildingVieWType.emit(this.viewTypeBuildingAll);
  }

  emitViewType(viewType: string, showGridLoadDashboard: boolean) {
    this.passViewType.emit({viewType, showGridLoadDashboard});
  }
}
