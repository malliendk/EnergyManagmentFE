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

  showButtons: boolean = false;
  townHallDashboard: string = 'town hall';
  factoryDashboard: string = 'factory';
  buildingDashboard: string = 'buildings'

  constructor() {}

  ngOnInit() {
    this.showButtons = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gameDTO'] && changes['gameDTO'].currentValue) {
      this.gameDTO = changes['gameDTO'].currentValue;
      console.log('Updated gameDTO in NavbarComponent:', this.gameDTO);
    }
  }

  emitViewType(viewType: string, showGridLoadDashboard: boolean) {
    this.passViewType.emit({viewType, showGridLoadDashboard});
  }
}
