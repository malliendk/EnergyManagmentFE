import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GameObject} from "../dtos/gameObject";
import {mockGameObject} from "../mocks/mock-game-object";
import {GameDtoService} from "../services/game-dto.service";
import {BuildingService} from "../services/building.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: false
})
export class NavbarComponent implements OnInit{

  transitionClass = 'nav-demo navbar-expand-lg night'
  toMorning = 'morning';
  toAfternoon = 'afternoon';

  @Input() mockGameDto!: GameObject
  @Output() passViewType = new EventEmitter<string>();
  @Output() passBuildingVieWType = new EventEmitter<string>();

  showButtons: boolean = false;
  viewType!: string;
  viewTypeTownHall: string = 'town hall';
  viewTypeFactory: string = 'factory';
  viewTypeBuildings: string = 'buildings'
  viewTypeBuildingPurchase: string = 'purchase';
  viewTypeBuildingOverview: string = 'overview';

  constructor(private buildingService: BuildingService) {}

  ngOnInit() {
    this.mockGameDto = mockGameObject
  }

  transition() {
    console.log(this.transitionClass);
    if (this.transitionClass.includes('morning')) {
      this.transitionClass = this.transitionClass.replace('morning', 'afternoon');
    } else if (this.transitionClass.includes('afternoon')) {
      this.transitionClass = this.transitionClass.replace('afternoon', 'evening');
    } else if (this.transitionClass.includes('evening')) {
      this.transitionClass = this.transitionClass.replace('evening', 'night');
    } else if (this.transitionClass.includes('night')) {
      this.transitionClass = this.transitionClass.replace('night', 'morning');
    }
      console.log(this.transitionClass);
  }

  activateButtons() {
    this.showButtons = !this.showButtons;
  }

  emitBuildingViewType(viewType: string, viewTypeBuilding: string) {
    this.passViewType.emit(viewType);
    this.passBuildingVieWType.emit(viewTypeBuilding)
  }

  emitViewType(viewType: string) {
    this.passViewType.emit(viewType)
  }
}
