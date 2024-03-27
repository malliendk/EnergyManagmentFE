import {Component, Input, OnInit} from '@angular/core';
import {Supervisor} from "../../supervisor";
import {SupervisorService} from "../../services/supervisor.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-supervisor-table',
  templateUrl: './supervisor-list.component.html',
  styleUrls: ['./supervisor-list.component.css']
})
export class SupervisorListComponent implements OnInit{

  @Input() supervisors: Supervisor[] = [];

  constructor(private supervisorService: SupervisorService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const distributorName = this.route.snapshot.paramMap.get('distributorName');
    if (distributorName != null){
        this.findAllByDistributorName(distributorName)
    } else {
      this.findAll();
    }
  }

  findAll() {
    this.supervisorService.findAll()
      .subscribe(supervisors => this.supervisors = supervisors);
  }

  findAllByDistributorName(distributorName: string) {
    this.supervisorService.findAllByDistributorName(distributorName)
      .subscribe(supervisors => this.supervisors = supervisors)
  }
}
