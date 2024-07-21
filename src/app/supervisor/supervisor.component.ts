import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Supervisor} from "../dtos/supervisor";

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.css']
})
export class SupervisorComponent implements OnInit {

  isDistributorInUrl!: boolean;
  distributorName?: string;
  choosePlayer?: string;

  supervisors: Supervisor[] = [];


  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const distributorName = this.route.snapshot.paramMap.get('name');
    if (distributorName !== null){
      this.distributorName = distributorName;
      this.isDistributorInUrl = true;
    } else {
      this.isDistributorInUrl = false;
    }
    const choosePLayer = this.route.snapshot.paramMap.get('choosePlayer');
    if (choosePLayer !== null) {
      this.choosePlayer = choosePLayer;
    }
  }

  handleFindAll(event: { status: string, data?: any, error?: any}) {
    if (event.status === 'success') {
      this.supervisors = event.data;
    }
  }
}
