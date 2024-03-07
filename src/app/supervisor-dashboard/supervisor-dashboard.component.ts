import {Component, OnInit} from '@angular/core';
import {SupervisorDashboardService} from "../supervisor-dashboard.service";
import {SupervisorDashboard} from "../supervisorDashboard";
import {Supervisor} from "../supervisor";
import {SupervisorService} from "../supervisor.service";
import {LegendPosition} from "@swimlane/ngx-charts";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.css']
})
export class SupervisorDashboardComponent implements OnInit{

  supervisor!: Supervisor
  dashboard!: SupervisorDashboard;
  dashboards: SupervisorDashboard[] = []

  // form = new FormGroup({
  //   supervisorName = new FormControl('supervisor name')
  // });

  chartResults!: any[];
  chartColors = [
    {
      name: 'shortage',
      value: '#FF0000FF'
    },
    {
      name: 'optimal',
      value: '#008000FF'
    },
    {
      name: 'surplus',
      value: '#663399FF'
    },
  ]
  chartGradient = true;
  showChartLegend = true;
  legendPosition: LegendPosition = LegendPosition.Right

  constructor(private dashboardService: SupervisorDashboardService,
              private supervisorService: SupervisorService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  getSupervisorDashboard(lastName: string) {
    this.dashboardService.getSupervisorDashboard(lastName)
      .subscribe(dashboards => {
        this.dashboards = dashboards;
        }
      )
  }

  getSupervisorByName(supervisorName: string) {
    this.supervisorService.findByLastName(supervisorName)
      .subscribe(supervisor => this.supervisor = supervisor)
  }

  // formatSupervisorName(supervisorName: string) {
  //   const firstName = supervisorName.substring(0, supervisorName.indexOf(' '));
  //   const lastName = supervisorName.substring(supervisorName.indexOf(' ') +1);
  //   return `${firstName}' '${lastName}`;
  // }
}
