import {Component, OnInit} from '@angular/core';
import {DistributorService} from "../../services/distributor.service";
import {Distributor} from "../../dtos/distributor";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-distributor-detail',
  templateUrl: './distributor-detail.component.html',
  styleUrls: ['./distributor-detail.component.css']
})
export class DistributorDetailComponent implements OnInit {

  distributor!: Distributor;

  constructor(private distributorService: DistributorService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const distributorId = Number(this.route.snapshot.paramMap.get('id'));
    if (distributorId !== null) {
      this.findById(distributorId);
    }
  }

  findById(distributorId: number) {
    this.distributorService.findById(distributorId)
      .subscribe(distributor => {
        this.distributor = distributor;
        this.getImage(distributor);
      });
  }

  findByName(distributorName: string) {
    this.distributorService.findByName(distributorName)
      .subscribe(distributor => {
        this.distributor = distributor;
      });
  }

  getImage(distributor: Distributor) {
    this.distributorService.getImage(distributor.name)
      .subscribe(blob => {
        distributor.image = URL.createObjectURL(blob);
      });
  }
}
