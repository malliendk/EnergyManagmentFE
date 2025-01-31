import {Component, OnInit} from '@angular/core';
import {Supervisor} from "../../dtos/supervisor";
import {SupervisorService} from "../../services/supervisor.service";
import {LegendPosition} from "@swimlane/ngx-charts";
import {ActivatedRoute} from "@angular/router";
import {Locality} from "../../dtos/locality";
import {Account} from "../../dtos/account";
import {LocalityService} from "../../services/locality.service";
import {AccountService} from "../../services/account.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-supervisor-dashboard',
    templateUrl: './main-dashboard.component.html',
    styleUrls: ['./main-dashboard.component.css'],
    standalone: false
})
export class MainDashboardComponent implements OnInit {

  supervisor!: Supervisor;
  localities: Locality[] = [];
  accounts: Account[] = [];

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
              private route: ActivatedRoute,
              private toastr: ToastrService) {
  }

  ngOnInit(): void {
    const supervisorName = this.route.snapshot.paramMap.get('supervisorName');
    if (supervisorName != null) {
      this.findSupervisor(supervisorName);
    } else {
      this.toastr.warning("Your dashboards couldn't be loaded", "Supervisor not present in URL");
    }
  }

  findSupervisor(lastName: string) {
    this.supervisorService.findByLastName(lastName)
      .subscribe({
        next: supervisor => {
          this.supervisor = supervisor;
          this.findLocalitiesBySupervisor(lastName);
        },
        error: error => {
          this.toastr.error("Supervisor with this name does not exist", error.title().toString())
        }
      })
  }

  findLocalitiesBySupervisor(supervisorLastName: string) {
    this.localityService.findAllBySupervisor(supervisorLastName)
      .subscribe({
        next: (localities) => {
          this.localities = localities;
          localities.forEach(locality => {
            this.findAccountsByLocality(locality.name);
          });
        },
        error: (error) => {
          this.toastr.error("Localities couldn't be found", error.title.toString());
        }
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
