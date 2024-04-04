import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Locality} from "../locality";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LocalityService {

  basePrefix = "http://localhost:8080/api/v1/locality";

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<Locality[]>(this.basePrefix);
  }

  findAllBySupervisor(lastName: string) {
    return this.http.get<Locality[]>(`${this.basePrefix}/supervisor/${lastName}`)
  }

  findById(id: number) {
    return this.http.get<Locality>(`${this.basePrefix}/${id}`)
  }

  getImage(imageName: string): Observable<Blob> {
    return this.http.get(`${this.basePrefix}/image/${imageName}`, { responseType: 'blob'});
  }
}
