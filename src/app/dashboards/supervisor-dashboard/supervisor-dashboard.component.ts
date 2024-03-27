import {Component, OnInit} from '@angular/core';
import {Supervisor} from "../../supervisor";
import {SupervisorService} from "../../services/supervisor.service";
import {LegendPosition} from "@swimlane/ngx-charts";
import {ActivatedRoute} from "@angular/router";
import {Locality} from "../../locality";
import {Account} from "../../account";
import {LocalityService} from "../../services/locality.service";
import {AccountService} from "../../services/account.service";

@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.css']
})
export class SupervisorDashboardComponent implements OnInit {

  supervisor!: Supervisor;
  localities: Locality[] = [];
  accounts: Account[] = [];

  shortageAccounts: Account[] = [];
  optimalAccounts: Account[] = [];
  surplusAccounts: Account[] = [];

  charts!: Map<string, Account[]>[];

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

  constructor(private supervisorService: SupervisorService,
              private localityService: LocalityService,
              private accountService: AccountService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const supervisorName = this.route.snapshot.paramMap.get('supervisorName');
    if (supervisorName != null) {
      this.findSupervisor(supervisorName);
    } else {
      console.log('supervisor name not found');
    }
  }

  findSupervisor(lastName: string) {
    this.supervisorService.findByLastName(lastName)
      .subscribe(supervisor => {
        this.supervisor = supervisor;
        this.findLocalitiesBySupervisor(lastName);
      })
  }

  findLocalitiesBySupervisor(supervisorLastName: string) {
    this.localityService.findAllBySupervisorName(supervisorLastName)
      .subscribe(localities => {
        this.localities = localities;
        localities.forEach(locality => {
          this.findAccountsByLocality(locality.name);
        });
      });
  }

  findAccountsByLocality(localityName: string) {
    this.accountService.findAllByLocality(localityName)
      .subscribe(accounts => {
         this.updateChart(accounts);
      })
  }


  updateChart(accounts: Account[]) {
    const shortageAccounts = accounts.filter(account => account.supplyType === "shortage");
    const optimalAccounts = accounts.filter(account => account.supplyType === "optimal");
    const surplusAccounts = accounts.filter(account => account.supplyType === "surplus");

    this.chartResults = [
      {
        "name": "shortage",
        "value": shortageAccounts.length
      },
      {
        "name": "optimal",
        "value": optimalAccounts.length
      },
      {
        "name": "surplus",
        "value": surplusAccounts.length
      }
    ];
  }
}
