import {Component, Input, OnInit} from '@angular/core';
import {LocalityService} from "../../services/locality.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Locality} from "../../locality";

@Component({
  selector: 'app-localty-list',
  templateUrl: './locality-list.component.html',
  styleUrls: ['./locality-list.component.css']
})
export class LocalityListComponent implements OnInit{

  localities : Locality[] = [];
  @Input() supervisorName = '';

  constructor(private localityService: LocalityService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.supervisorName) {
      this.findAllBySupervisor(this.supervisorName);
    } else {
      this.findAll();
    }
  }

  findAll() {
    this.localityService.findAll()
      .subscribe(localities => {
        localities.forEach(locality => this.getImage(locality));
        this.localities = localities;
      })
  }

  findAllBySupervisor(lastName: string) {
    return this.localityService.findAllBySupervisor(lastName)
      .subscribe(localities => {
        localities.forEach(locality => this.getImage(locality));
        this.localities = localities;
      });
  }

  getImage(localty: Locality) {
    this.localityService.getImage(localty.name)
      .subscribe(blob => {
        localty.image = URL.createObjectURL(blob);
      })
  }

  navigateTo(localityId: number) {
    this.router.navigate([localityId], { relativeTo: this.route});
  }
}
