import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Story } from "./story";

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  baseUrl = "http://localhost:8080/"

  constructor(private http: HttpClient) { }

  create(story: Story){
    return this.http.post<Story>(this.baseUrl + "api/stories", story);
  }

  find(id: number){
    return this.http.get<Story>(this.baseUrl +`api/stories/${id}`);
  }

  findByName(name: string){
    return this.http.get<Story>(this.baseUrl + `api/stories/name/${name}`)
  }

  findAll(){
    return this.http.get<Story[]>(this.baseUrl + "api/stories/all");
  }

  update(story: Story, id: number) {
    return this.http.put<Story>(this.baseUrl + `api/stories/${id}`, story)
  }

  compareLists(storyId: number){
    return this.http.get(this.baseUrl + `api/stories/compare/${storyId}`)
  }
}
