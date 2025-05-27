import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {CommonModule, CurrencyPipe} from "@angular/common";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports : [CommonModule, CurrencyPipe]
})
export class NavbarComponent implements OnInit, OnChanges {

  transitionClass = 'nav-demo navbar-expand-lg night'

  @Input() gameDTO!: ExtendedGameDTO;
  @Output() passViewType = new EventEmitter<{
    viewType: string,
    showGridLoadDashboard: boolean
  }>();
  @Output() passBuildingVieWType = new EventEmitter<string>();

  townHallDashboard: string = 'town hall';
  factoryDashboard: string = 'factory';
  buildingDashboard: string = 'buildings'
  universityDashboard: string = 'university';

  isUniversityPresent: boolean = false;

  constructor() {}

  ngOnInit() {
    this.checkUniversityPresent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gameDTO'] && changes['gameDTO'].currentValue) {
      this.gameDTO = changes['gameDTO'].currentValue;
    }
  }

  emitViewType(viewType: string, showGridLoadDashboard: boolean) {
    this.passViewType.emit({viewType, showGridLoadDashboard});
  }

  checkUniversityPresent() {
    if (this.gameDTO.buildings.some(building => building.name === "universiteit")) {
      this.isUniversityPresent = true;
    }
  }
}
