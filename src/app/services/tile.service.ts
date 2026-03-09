import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AdjacencySet} from "../dtos/adjacencySet";
import {Tile} from "../dtos/tile";
import {BehaviorSubject, Observable} from "rxjs";
import {ColorService} from "./color.service";

@Injectable({
  providedIn: 'root'
})
export class TileService {

  private tileSubject = new BehaviorSubject<Tile | undefined>(undefined)
  public tile$ = this.tileSubject.asObservable()

  adjacencyURL: string = "http://localhost:8090/adjacency-sets"

  constructor(private http: HttpClient,
              private colorService: ColorService) {
  }

  setTile(tile: Tile | undefined): void {
    this.tileSubject.next(tile);
  }

  findAllAdjacencySets(): Observable<AdjacencySet[]> {
    return this.http.get<AdjacencySet[]>(this.adjacencyURL);
  }

  setTileColor(tile: Tile): string {
    const baseColor: string = this.colorService.setTileColor(tile)
    const hasBuildingColor: string = this.colorService.setColorHasBuilding(tile);
    const hasPowerLineColor: string = this.colorService.setPowerLinesColor(tile)
    return [baseColor, hasBuildingColor, hasPowerLineColor]
      .filter(className => className.trim() !== '')
      .join(' ');
  }
}

