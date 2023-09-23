import {Component, Input, OnInit} from '@angular/core';
import {Requirement} from "../requirement";
import {RequirementService} from "../requirement.service";

@Component({
  selector: 'app-scenarioRequirements',
  templateUrl: './requirements.component.html',
  styleUrls: ['./requirements.component.css']
})
export class RequirementsComponent implements OnInit{

  @Input() requirement!: Requirement
  requirements : Requirement[] = []

  constructor(private requirementService: RequirementService) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll(){
    return this.requirementService.findAll()
      .subscribe(requirements => this.requirements = requirements);
  }
}
