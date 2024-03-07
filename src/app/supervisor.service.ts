import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Supervisor} from "./supervisor";

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  baseUrl = 'http://localhost:8080/api/v1/supervisor/dashboard/';
  constructor(private http: HttpClient) { }

  findByLastName(lastName: string) {
    return this.http.get<Supervisor>(`${this.baseUrl + lastName}`)
  }
}
