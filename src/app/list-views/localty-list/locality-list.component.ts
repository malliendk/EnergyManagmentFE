import {Component, OnInit} from '@angular/core';
import {LocalityService} from "../../services/locality.service";
import {ActivatedRoute} from "@angular/router";
import {Locality} from "../../locality";

@Component({
  selector: 'app-localty-list',
  templateUrl: './locality-list.component.html',
  styleUrls: ['./locality-list.component.css']
})
export class LocalityListComponent implements OnInit{

  localities : Locality[] = [];

  constructor(private localityService: LocalityService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const supervisorName = this.route.snapshot.paramMap.get('supervisorName');
    if (supervisorName != null) {
      this.findAllBySupervisorName(supervisorName);
    } else {
      this.findAll();
    }
  }

  findAll() {
    this.localityService.findAll()
      .subscribe(response => this.localities = response)
  }

  findAllBySupervisorName(supervisorName: string) {
    return this.localityService.findAllBySupervisorName(supervisorName)
      .subscribe(response => this.localities = response)
  }
}
