import { Injectable } from '@angular/core';
import {mockBuildings} from "../mocks/mock-buildings";
import {Building} from "../dtos/building";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  viewTypeSubject: Subject<string> = new Subject<string>();

  viewType$: Observable<string> = this.viewTypeSubject.asObservable();

  buildingAPIBaseURL: string = 'http://localhost:8090/';

  constructor(private http: HttpClient) { }

  setViewType(viewType: string) {
    this.viewTypeSubject.next(viewType);
  }

  getAll(): Building[] {
    // this this.http.get<Building[]>(this.buildingAPIBaseURL)
    return mockBuildings;
  }
}
