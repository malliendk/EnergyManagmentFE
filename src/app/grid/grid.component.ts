import {Component, OnInit} from '@angular/core';
import {BuildingDTO} from "../dtos/buildingDTO";
import {NgClass} from "@angular/common";
import {GameDTO} from "../dtos/gameDTO";
import {Tile} from "../dtos/tile";
import {TileService} from "../services/tile.service";
import {ColorService} from "../services/color.service";
import {Subscription} from "rxjs";
import {GameDTOService} from "../services/game-dto.service";
import {EventDTO} from "../dtos/eventDTO";
import {BuildingService} from "../services/building.service";
import {BuildingInGame} from "../dtos/buildingInGame";
import {POWER_LINE_ID} from "../constants/constants";


@Component({
  selector: 'app-grid',
  imports: [
    NgClass
  ],
  templateUrl: './grid.component.html',
  standalone: true,
  styleUrl: './grid.component.css'
})
export class GridComponent implements OnInit{

  private subscription = new Subscription()

  gameDTO!: GameDTO;
  tile: Tile | undefined = undefined
  event?: EventDTO;
  building: BuildingInGame | undefined = undefined;
  powerLine!: BuildingDTO;

  constructor(private gameDTOService: GameDTOService,
              private colorService: ColorService,
              private tileService: TileService,
              private buildingService: BuildingService) {
  }

  ngOnInit() {
    this.addGameDTOSubscription()
    this.addTileSubscription()
    this.selectPowerLine()
  }

  addGameDTOSubscription() {
    this.subscription.add(
      this.gameDTOService.gameDTO$
        .subscribe((gameDTO: GameDTO | null) => {
          this.gameDTO = gameDTO!
        }))
  }

  addTileSubscription() {
    this.subscription.add(
      this.tileService.tile$
        .subscribe(tile => this.tile = tile)
    )
  }

  onTileSelect(tile: Tile) {
    if (tile.building) {
      this.tileService.setTile(tile)
      this.buildingService.setBuildingInGame(tile.building)
    } else {
      this.tileService.setTile(tile)
      this.buildingService.setBuildingInGame(undefined)
    }
  }

  setTileColor(tile: Tile): string {
    return this.tileService.setTileColor(tile);
  }

  setPowerLinesColor(tile: Tile) {
    return this.colorService.setPowerLinesColor(tile)
  }

  setTileSelected(tile: Tile): string {
    return this.tile ? this.colorService.setSelectedTile(tile, this.tile!.id) : ''
  }

  selectPowerLine() {
    this.buildingService.findAll()
      .subscribe(buildings =>
        this.powerLine = buildings.find(building => building.id === POWER_LINE_ID)!)
  }
}




