import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Requirement} from "./requirement";
import {Observable} from "rxjs";
import {Scenario} from "./scenario";

@Injectable({
  providedIn: 'root'
})
export class RequirementService {

  baseUrl = "http://localhost:8080/";

  constructor(private http: HttpClient) { }

  create(requirement: Requirement){
    return this.http.post<Requirement>(this.baseUrl + "api/requirements", requirement);
  }

  find(id: number){
    return this.http.get<Requirement>(this.baseUrl + `api/requirements/${id}`)
  }

  findAll(){
    return this.http.get<Requirement[]>(this.baseUrl + "api/requirements/all")
  }

  findAllByScenario(id: number) {
    return this.http.get<Requirement[]>(this.baseUrl + `api/requirements/scenario/${id}`)
  }

  findNamesByScenario(id: number){
    return this.http.get<string[]>(this.baseUrl + `api/requirements/scenario/names/${id}`)
  }

  findAllByStory(id: number) {
    return this.http.get<Requirement[]>(this.baseUrl + `api/requirements/story/${id}`)
  }

  findNamesByStory(id: number) {
    return this.http.get<string[]>(this.baseUrl + `api/requirements/story/names/${id}`)
  }

  update(requirement: Requirement, id: number) {
    return this.http.put<Requirement>(this.baseUrl + `api/requirements/${id}`, requirement)
  }

  delete(id: number){
    return this.http.delete(this.baseUrl + `api/requirements/${id}`)
  }

  findAllByStoryName(storyName: string) {
    this.http.get<Requirement[]>(this.baseUrl)
  }
}
