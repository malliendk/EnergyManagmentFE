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
  storyRequirements? : Requirement[] = []

  editMode = false

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
        this.findAllByScenario(id)
      });
  }

  findStoryByName(name: string) {
    this.storyService.findByName(name)
      .subscribe(story => {
        this.story = story;
        this.findAllByStory(this.story.id);
      });
  }

  findAllByStory(id: number){
    return this.requirementService.findAllByStory(id)
      .subscribe(requirements => {
        this.storyRequirements = requirements;
      });
  }


  findAllByScenario(id: number) {
    this.requirementService.findAllByScenario(id)
      .subscribe(requirements => this.scenarioRequirements = requirements)
  }


  saveChanges(id : number){
    this.scenarioService.update(this.scenario, id)
      .subscribe(scenario => this.scenario = scenario)
    this.toggleEditMode()
  }

  toggleEditMode() {
    this.editMode = !this.editMode
    window.scroll(0, 0);
  }



}
