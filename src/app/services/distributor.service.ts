import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Distributor} from "../distributor";

@Injectable({
  providedIn: 'root'
})
export class DistributorService {

  baseUrl = "http://localhost:8080/distributor";

  constructor(private http: HttpClient) { }

  findAll() {
    return this.http.get<Distributor[]>(this.baseUrl);
  }
}
