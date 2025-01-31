import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Distributor} from "../dtos/distributor";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DistributorService {

  basePrefix = "http://localhost:8080/api/v1/distributor";

  constructor(private http: HttpClient) { }

  findAll() {
    console.log("found all distributors")
    return this.http.get<Distributor[]>(this.basePrefix);
  }

  findById(id: number) {
    return this.http.get<Distributor>(`${this.basePrefix}/${id}`);
  }

  findByName(name: string) {
    return this.http.get<Distributor>(`${this.basePrefix}'/'${name}`);
  }

  getImage(imageName: string): Observable<Blob>{
    return this.http.get(`${this.basePrefix}/image/${imageName}`, { responseType: 'blob'});
  }
}
