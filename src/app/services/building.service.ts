import {Injectable} from '@angular/core';
import {Building} from "../dtos/building";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {MinimizedGameDTO} from "../minimizedGameDTO";
import {map} from "d3";

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  viewTypeSubject: Subject<string> = new Subject<string>();

  viewType$: Observable<string> = this.viewTypeSubject.asObservable();

  buildingAPIBaseURL: string = 'http://localhost:8090/';

  constructor(private http: HttpClient) {
  }

  setViewType(viewType: string) {
    this.viewTypeSubject.next(viewType);
  }

  getAll(): Observable<Building[]> {
    return this.http.get<Building[]>(this.buildingAPIBaseURL);
  }

  getBuildingsById(ids: number[]) {
    return this.http.post<Building[]>(this.buildingAPIBaseURL + '/ids', ids);
  }
}
