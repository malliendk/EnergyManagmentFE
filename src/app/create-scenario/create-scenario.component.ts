import {Component, OnInit} from '@angular/core';
import {Scenario} from "../scenario";

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css']
})
export class CreateScenarioComponent implements OnInit{

  scenario! : Scenario

  ngOnInit(): void {
    this.scenario = {id: 0, name: '', description: '', isSuccessfullyTested: false,
      storyName: '', storyId : 0, requirementNames: null}
  }
}
