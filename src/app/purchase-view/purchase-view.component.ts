import {Component, OnInit} from '@angular/core';
import {Tile} from "../dtos/tile";
import {BuildingDTO} from "../dtos/buildingDTO";
import {GameDTO} from "../dtos/gameDTO";
import {GridComponent} from "../grid/grid.component";
import {Subscription} from "rxjs";
import {TileService} from "../services/tile.service";
import {GameDTOService} from "../services/game-dto.service";
import {BuildingListComponent} from "../building-list/building-list.component";

@Component({
  selector: 'app-purchase',
  imports: [
    GridComponent,
    BuildingListComponent,
  ],
  templateUrl: './purchase-view.component.html',
  standalone: true,
  styleUrl: './purchase-view.component.css'
})
export class PurchaseViewComponent implements OnInit {

  private gameDtoSubscription = new Subscription()
  private tileSubscription = new Subscription()

  tile?: Tile
  gameDTO!: GameDTO
  building?: BuildingDTO

  constructor(private tileService: TileService,
              private gameDTOService: GameDTOService) {
  }

  ngOnInit() {
    this.addTileSubscription()
    this.addGameDTOSubscription()
  }

  private addTileSubscription() {
    this.tileSubscription.add(
      this.tileService.tile$
        .subscribe(selectedTile => this.tile = selectedTile)
    )
  }

  private addGameDTOSubscription() {
    this.gameDtoSubscription.add(
      this.gameDTOService.gameDTO$
        .subscribe(updatedDTO => this.gameDTO = updatedDTO!)
    )
  }
}
