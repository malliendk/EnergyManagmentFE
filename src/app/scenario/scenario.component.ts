import {Component, Input, OnInit} from '@angular/core';
import {ScenarioService} from "../scenario.service";
import {ActivatedRoute} from "@angular/router";
import {Scenario} from "../scenario";
import {Requirement} from "../requirement";
import {RequirementService} from "../requirement.service";
import {StoryService} from "../story.service";
import {Story} from "../story";

@Component({
  selector: 'app-scenario',
  templateUrl: './scenario.component.html',
  styleUrls: ['./scenario.component.css']
})
export class ScenarioComponent implements OnInit{

  scenario!: Scenario
  story!: Story
  scenarioRequirements: Requirement[] = []
  scenarioRequirementNames : string[] = []
  storyRequirementNames : string[] = []

  editMode = false
  selectedStoryRequirements : string[] = [];
  selectedScenarioRequirements : string[] = [];

  constructor(private scenarioService: ScenarioService,
              private requirementService: RequirementService,
              private storyService: StoryService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.findScenario(id)

  }

  findScenario(id: number) {
    this.scenarioService.find(id)
      .subscribe(scenario => {
        this.scenario = scenario;
        this.findStoryByName(this.scenario.storyName);
        this.findAllRequirementsByScenario(id)
        this.findRequirementNamesByScenario(id)
      });
  }

  findStoryByName(name: string) {
    this.storyService.findByName(name)
      .subscribe(story => {
        this.story = story;
        this.findRequirementNamesByStory(this.story.id);
      });
  }


  findRequirementNamesByStory(id: number){
    return this.requirementService.findNamesByStory(id)
      .subscribe(names => this.storyRequirementNames = names.filter(
        name => !this.scenarioRequirementNames.includes(name)
      ))
  }

  findAllRequirementsByScenario(id: number) {
    this.requirementService.findAllByScenario(id)
      .subscribe(requirements => this.scenarioRequirements = requirements)
  }

  findRequirementNamesByScenario(id: number){
    return this.requirementService.findNamesByScenario(id)
      .subscribe(names => this.scenarioRequirementNames = names)
  }

  moveToScenarios() {
    this.scenarioRequirementNames.push(...this.selectedStoryRequirements)
    this.storyRequirementNames = this.storyRequirementNames.filter(name => !this.selectedStoryRequirements.includes(name));
    this.scenario.requirementNames = this.scenarioRequirementNames
    this.selectedStoryRequirements = []
  }

  moveToRequirements() {
    this.storyRequirementNames.push(...this.selectedScenarioRequirements);
    this.scenarioRequirementNames = this.scenarioRequirementNames.filter(name => !this.selectedScenarioRequirements.includes(name));
    this.scenario.requirementNames = this.scenarioRequirementNames
    this.selectedScenarioRequirements = [];
  }

  saveChanges(scenario: Scenario, id : number){
    this.scenarioService.update(this.scenario, id)
      .subscribe(scenario => {this.scenario = scenario, window.location.reload()})
  }

  toggleEditMode() {
    this.editMode = !this.editMode
    window.scroll(0, 0);
  }

  markScenarioTested(scenario : Scenario, id: number) {
    this.scenarioService.markScenarioTested(scenario, id)
      .subscribe(scenario => {
        this.scenario = scenario
        window.location.reload()
      })
  }
}
