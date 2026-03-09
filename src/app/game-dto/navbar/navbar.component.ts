import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule, CurrencyPipe} from "@angular/common";
import {GameDTO} from "../../dtos/gameDTO";
import {Subscription} from "rxjs";
import {GameDTOService} from "../../services/game-dto.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports : [CommonModule, CurrencyPipe]
})
export class NavbarComponent implements OnInit {

  private gameDTOSubscription = new Subscription()
  gameDTO!: GameDTO;

  @Output() passViewType = new EventEmitter<{
    viewType: string,
    showGridLoadDashboard: boolean
  }>();
  @Output() passBuildingVieWType = new EventEmitter<string>();

  townHallDashboard: string = 'town hall';
  factoryDashboard: string = 'factory';
  buildingDashboard: string = 'buildings'
  universityDashboard: string | undefined = 'university';

  isUniversityPresent: boolean = false;

  constructor(private gameDTOService: GameDTOService) {}

  ngOnInit() {
    this.gameDTOSubscription.add(
      this.gameDTOService.gameDTO$
        .subscribe(gameDTO => this.gameDTO = gameDTO!)
    )
  }

  emitViewType(viewType: string, showGridLoadDashboard: boolean) {
    this.passViewType.emit({viewType, showGridLoadDashboard});
  }
}
