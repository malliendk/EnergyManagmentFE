import {Component, Input, OnInit} from '@angular/core';
import {Supervisor} from "../../supervisor";
import {SupervisorService} from "../../services/supervisor.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-supervisor-list',
  templateUrl: './supervisor-list.component.html',
  styleUrls: ['./supervisor-list.component.css']
})
export class SupervisorListComponent implements OnInit {

  supervisors: Supervisor[] = [];
  @Input() distributorName!: string;

  constructor(private supervisorService: SupervisorService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.distributorName) {
      this.findAllByDistributorName(this.distributorName);
    } else {
      this.findAll();
    }
  }

  findAll() {
    this.supervisorService.findAll()
      .subscribe({
        next: supervisors => {
          supervisors.forEach(supervisor => this.getImage(supervisor));
          this.supervisors = supervisors;
        }
        , error: error => {
          //TODO: handle error
        }
      });
  }

  findAllByDistributorName(distributorName: string) {
    this.supervisorService.findAllByDistributorName(distributorName)
      .subscribe(
        supervisors => {
          supervisors.forEach(supervisor => this.getImage(supervisor));
          this.supervisors = supervisors;
        })
  }

  getImage(supervisor: Supervisor) {
    this.supervisorService.getImage(supervisor.firstName + supervisor.lastName)
      .subscribe(blob => {
          supervisor.image = URL.createObjectURL(blob)
        }
      )
  }

  navigateTo(supervisorId: number) {
    this.router.navigate([supervisorId], {relativeTo: this.route});
  }
}
