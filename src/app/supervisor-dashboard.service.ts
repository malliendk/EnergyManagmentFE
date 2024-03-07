import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SupervisorDashboard} from "./supervisorDashboard";

@Injectable({
  providedIn: 'root'
})
export class SupervisorDashboardService {

  baseUrl = 'http://localhost:8080/api/v1/dashboard/';
  constructor(private http: HttpClient) {
  }

  getSupervisorDashboard(supervisorName: string) {
    return this.http.get<SupervisorDashboard[]>(`${this.baseUrl + 'supervisor/' + supervisorName}` )
  }
}
