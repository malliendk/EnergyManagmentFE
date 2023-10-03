import {Component, Input, OnInit} from '@angular/core';
import {Requirement} from "../requirement";
import {RequirementService} from "../requirement.service";
import {ActivatedRoute} from "@angular/router";
import {StoryService} from "../story.service";
import {Story} from "../story";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.css']
})
export class RequirementComponent implements OnInit{

  @Input() requirement!: Requirement
  story! : Story

  isEditing = false;

  constructor(private requirementService: RequirementService,
              private storyService: StoryService,
              private route : ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.find(id);
  }

  find(id: number){
    return this.requirementService.find(id)
      .subscribe(requirement => {
          this.requirement = requirement;
          this.findStoryByName(this.requirement.storyName)
        });
  }

  findStoryByName(name: string){
    return this.storyService.findByName(name)
      .subscribe(story => this.story = story)
  }

  saveChanges(requirement: Requirement, id: number){
    this.requirementService.update(this.requirement, id)
      .subscribe(requirement => this.requirement = requirement)
    window.location.reload()
  }

  toggleEditMode(){
    this.isEditing = !this.isEditing;
  }

  delete() {
    this.requirementService.delete(this.requirement.id)
      .subscribe(() => {
        this.requirementService.findAll();
        window.location.reload();
      })
  }
}
