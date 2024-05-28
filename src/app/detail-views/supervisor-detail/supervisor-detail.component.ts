import {Component, OnInit} from '@angular/core';
import {Supervisor} from "../../dtos/supervisor";
import {SupervisorService} from "../../services/supervisor.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-supervisor-detail',
  templateUrl: './supervisor-detail.component.html',
  styleUrls: ['./supervisor-detail.component.css']
})
export class SupervisorDetailComponent implements OnInit{

  supervisor!: Supervisor;

  constructor(private supervisorService: SupervisorService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.findById(id);
  }

  private findById(id: number) {
    this.supervisorService.findById(id)
      .subscribe(supervisor => {
        this.getImage(supervisor.firstName + supervisor.lastName);
        this.supervisor = supervisor;
      })
  }

  private getImage(imageName: string) {
    this.supervisorService.getImage(imageName)
      .subscribe(blob => this.supervisor.image = URL.createObjectURL(blob));
  }
}
