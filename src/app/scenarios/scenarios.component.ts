import {Component, Input, OnInit} from '@angular/core';
import {Scenario} from "../scenario";
import {ScenarioService} from "../scenario.service";
import {Story} from "../story";
import {StoryService} from "../story.service";
import {ActivatedRoute} from "@angular/router";
import {RequirementService} from "../requirement.service";
import {Requirement} from "../requirement";

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css']
})
export class ScenariosComponent implements OnInit{

  scenario! : Scenario
  scenarios : Scenario[] = []
  story! : Story


  constructor(private scenarioService: ScenarioService,
              private storyService: StoryService) {
  }

  ngOnInit(): void {
    this.findAll()
  }

  private findAll() {
    this.scenarioService.findAll()
      .subscribe(scenarios => this.scenarios = scenarios)
  }
}
