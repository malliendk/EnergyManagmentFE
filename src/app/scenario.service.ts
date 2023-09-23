import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Scenario } from "./scenario";

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  baseUrl = "http://localhost:8080/"

  constructor(private http: HttpClient) { }

  create(scenario: Scenario){
    return this.http.post<Scenario>(this.baseUrl + "api/scenarios", scenario);
  }

  find(id: number){
    return this.http.get<Scenario>(this.baseUrl + `api/scenarios/${id}`);
  }

  findAll(){
    return this.http.get<Scenario[]>(this.baseUrl + "api/scenarios/all");
  }

  findAllByStory(id: number) {
    return this.http.get<Scenario[]>(this.baseUrl + `api/scenarios/story/${id}`)
  }

  update(scenario: Scenario, id: number) {
    return this.http.put<Scenario>(this.baseUrl + `api/scenarios/${id}`, scenario)
  }
}

