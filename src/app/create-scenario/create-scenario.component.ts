import {Component, Input, OnInit} from '@angular/core';
import {Scenario} from "../scenario";
import {StoryService} from "../story.service";
import {RequirementService} from "../requirement.service";
import {Story} from "../story";
import { ScenarioService } from '../scenario.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-create-scenario',
  templateUrl: './create-scenario.component.html',
  styleUrls: ['./create-scenario.component.css']
})
export class CreateScenarioComponent implements OnInit {

  scenario!: Scenario
  story?: Story
  scenarios : Scenario[] = []
  storyNames: string[] = []

  storyRequirementNames : string[] = []
  scenarioRequirementNames : string[] = []

  selectedStoryRequirements : string[] = []
  selectedScenarioRequirements : string[] = []

  saved = false

  constructor(private scenarioService: ScenarioService,
              private storyService: StoryService,
              private requirementService: RequirementService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (!this.scenario) {
      this.scenario = {
        id: 0, name: '', description: '', isSuccessfullyTested: false,
        storyName: '', storyId: 0, requirementNames: null, isBuilt: false}
        this.findAllStoryNames()
    } else {
      this.storyService.findByName(this.scenario.storyName)
    }
  }

  create(scenario: Scenario){
    this.scenarioService.create(scenario)
      .subscribe(() => {
        this.scenarios.push();
        this.findStoryByName(scenario.storyName)
        this.toggleSave()
      })
  }

  update(scenario: Scenario, id: number){
    this.scenarioService.update(scenario, id)
      .subscribe(scenario => {
        this.scenario = scenario;
        this.navigateToDetailsPage(scenario.id)
      })
  }

  findStoryByName(storyName: string){
    this.storyService.findByName(storyName)
      .subscribe(story => {
        this.story = story;
        this.scenario.storyId = story.id;
        this.findRequirementNamesByStory(story.id)
      })
  }

  findAllStoryNames() {
    this.storyService.findAllNames()
      .subscribe(names => this.storyNames = names)
  }

  private findRequirementNamesByStory(storyId: number) {
    this.requirementService.findNamesByStory(storyId)
      .subscribe(names => this.storyRequirementNames = names)
  }

  toggleSave(){
    this.saved = !this.saved;
  }

  navigateToDetailsPage(id: number){
    console.log(id)
    this.router.navigateByUrl("/scenarios/" + id)
  }

  moveToScenarios() {
    this.scenarioRequirementNames.push(...this.selectedStoryRequirements)
    this.storyRequirementNames = this.storyRequirementNames.filter(name => !this.selectedStoryRequirements.includes(name));
    this.scenario.requirementNames = this.scenarioRequirementNames
    this.selectedStoryRequirements = []
  }

  removeFromScenario(){
    this.storyRequirementNames.push(...this.selectedScenarioRequirements)
    this.scenarioRequirementNames = this.scenarioRequirementNames.filter(name => !this.selectedScenarioRequirements.includes(name));
    this.scenario.requirementNames = this.scenarioRequirementNames
    this.selectedScenarioRequirements = []
  }
}
