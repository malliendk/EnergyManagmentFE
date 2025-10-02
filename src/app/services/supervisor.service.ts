import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Supervisor} from "../dtos/supervisor";

@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  basePrefix = 'http://localhost:8090/supervisor';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Supervisor[]>(this.basePrefix);
  }

  findById(id: number) {
    return this.http.get<Supervisor>(`${this.basePrefix}/${id}`)
  }

  update(supervisor: Supervisor) {
    return this.http.put<Supervisor>(`${this.basePrefix}/${supervisor.id}`, supervisor)
  }
}
