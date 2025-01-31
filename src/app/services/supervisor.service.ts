import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Supervisor} from "../dtos/supervisor";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  basePrefix = 'http://localhost:8080/api/v1/supervisor';
  constructor(private http: HttpClient) { }

  findByLastName(lastName: string) {
    return this.http.get<Supervisor>(`${this.basePrefix}/${lastName}`)
  }

  findAll() {
    return this.http.get<Supervisor[]>(this.basePrefix);
  }

  findAllByDistributorName(distributorName: string) {
    return this.http.get<Supervisor[]>(`${this.basePrefix}/distributor/${distributorName}`);
  }

  findById(id: number) {
    return this.http.get<Supervisor>(`${this.basePrefix}/${id}`)
  }

  getImage(imageName: string): Observable<Blob>{
    return this.http.get(`${this.basePrefix}/image/${imageName}`, { responseType: 'blob'});
  }
}
