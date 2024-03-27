import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Local} from "d3";
import {Locality} from "../locality";

@Injectable({
  providedIn: 'root'
})
export class LocalityService {

  baseUrl = "http://localhost:8080/locality";

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<Locality[]>(this.baseUrl);
  }

  findAllBySupervisorName(supervisorName: string) {
    return this.http.get<Locality[]>(`${this.baseUrl} + '/' + ${supervisorName}`)
  }
}
