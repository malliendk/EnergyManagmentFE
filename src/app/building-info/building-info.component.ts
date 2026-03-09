import {Component, Input, OnInit} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {BuildingDTO} from "../dtos/buildingDTO";
import {BuildingInGame} from "../dtos/buildingInGame";
import {GameDTO} from "../dtos/gameDTO";
import {GameDTOService} from "../services/game-dto.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-building-info',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './building-info.component.html',
  standalone: true,
  styleUrl: './building-info.component.css'
})
export class BuildingInfoComponent implements OnInit {

  @Input() building!: BuildingDTO | BuildingInGame;

  private subscription = new Subscription()
  gameDTO!: GameDTO

  constructor(private gameDTOService: GameDTOService) {
  }

  ngOnInit(): void {
    this.addGameDTOSubscription()
  }

  addGameDTOSubscription() {
    this.subscription.add(
      this.gameDTOService.gameDTO$.subscribe(
        gameDTO => {
          this.gameDTO = gameDTO!
        }
      )
    )
  }
}
