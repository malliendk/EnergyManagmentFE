import {Component, Input, OnInit} from '@angular/core';
import {Requirement} from "../requirement";
import {NgForm} from "@angular/forms";
import {RequirementService} from "../requirement.service";
import {Router} from "@angular/router";
import {NgFor} from "@angular/common";

@Component({
  selector: 'app-create-requirement',
  templateUrl: './create-requirement.component.html',
  styleUrls: ['./create-requirement.component.css']
})
export class CreateRequirementComponent implements OnInit{

  requirement!: Requirement
  requirements : Requirement[] = []

  constructor(private requirementService: RequirementService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.requirement = {id: 0, name: '', description: '', isSuccessfullyTested : false, storyName: ''};
  }

  create(){
     this.requirementService.create(this.requirement)
       .subscribe(() => {console.log(this.requirement.name), this.requirements.push(), this.toList()});
  }

 toList() {
    this.router.navigateByUrl("requirements")
  }
}
