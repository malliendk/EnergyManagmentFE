import {Component, OnInit} from '@angular/core';
import {SupervisorDashboardService} from "../supervisor-dashboard.service";
import {SupervisorDashboard} from "../supervisorDashboard";
import {Supervisor} from "../supervisor";
import {SupervisorService} from "../supervisor.service";
import {LegendPosition} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.css']
})
export class SupervisorDashboardComponent implements OnInit{

  supervisor!: Supervisor
  dashboard!: SupervisorDashboard;
  dashboards: SupervisorDashboard[] = []

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
              private supervisorService: SupervisorService) {
  }

  ngOnInit(): void {
    this.getSupervisorDashboard(this.dashboard.supervisorName);
  }

  private getSupervisorDashboard(supervisorName: string) {
    this.dashboardService.getSupervisorDashboard(supervisorName)
      .subscribe(dashboards => this.dashboards = dashboards)
  }

  private getSuperVisorByName(supervisorName: string) {
    this.supervisorService.findByName(supervisorName)
      .subscribe(supervisor => this.supervisor = supervisor)
  }
}
