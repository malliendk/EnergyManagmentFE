import {Component, OnInit} from '@angular/core';
import {Story} from "../story";
import {StoryService} from "../story.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Requirement} from "../requirement";
import {Scenario} from "../scenario";
import {RequirementService} from "../requirement.service";
import {ScenarioService} from "../scenario.service";

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css']
})
export class StoryComponent implements OnInit {

  story! : Story
  requirements : Requirement[] = []
  scenarios : Scenario[] = []

  editMode = false

  constructor(private storyService : StoryService,
              private requirementService : RequirementService,
              private scenarioService: ScenarioService,
              private route : ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    this.find(id)
    this.findRequirementsByStory(id)
    this.findScenarioByStory(id)
  }

  private find(id: number) {
    this.storyService.find(id)
      .subscribe(story => this.story = story)
  }

  private findRequirementsByStory(id: number) {
    this.requirementService.findAllByStory(id)
      .subscribe(requirements => this.requirements = requirements)
  }

  private findScenarioByStory(id: number) {
    this.scenarioService.findAllByStory(id)
      .subscribe(scenarios => this.scenarios = scenarios)
  }

  saveChanges(id : number){
    this.storyService.update(this.story, id)
      .subscribe(story => this.story = story)
    this.toggleEditMode()
  }

  toggleEditMode(){
    this.editMode = !this.editMode;
    window.scroll(0, 0);
  }

  verifyAllRequirementsTested(id: number) {
    this.storyService.verifyAllRequirementsTested(id)
      .subscribe(response => {
        if(response===true){
          window.location.reload()
        }
      })
  }
}
