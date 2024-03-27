import {Component, OnInit} from '@angular/core';
import {DistributorService} from "../../services/distributor.service";
import {Distributor} from "../../distributor";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-distributor-view',
  templateUrl: './distributor-list.component.html',
  styleUrls: ['./distributor-list.component.css']
})
export class DistributorViewComponent implements OnInit{

  distributors: Distributor[] = [];


  constructor(private distributorService: DistributorService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.findAll()
  }

  findAll() {
    this.distributorService.findAll()
      .subscribe(distributors => this.distributors = distributors);
  }

  navigateToDistributor(distributorName: string) {
    this.router.navigate([distributorName], { relativeTo: this.route})
  }
}
