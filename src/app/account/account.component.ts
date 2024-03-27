import {Component, OnDestroy, OnInit} from '@angular/core';
import {Account} from "../account";
import {AccountService} from "../services/account.service";
import {interval, Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {

  accounts: Account[] = [];
  shortageAccounts: Account[] = [];
  optimalAccounts: Account[] = [];
  surplusAccounts: Account[] = [];

  numberOfAccountToGenerate!: number | null

  private subscription!: Subscription | null;

  //start chart variables
  chartResults: any = []
  chartResultsHistory: any[] = [];
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
  gradient = true;
  yAxisMaxValue = 0;

  //end chart variables


  constructor(private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.getAll();
  }

  ngOnDestroy(): void {
    this.stopOptimizeSupply();
  }

    getAll() {
    return this.accountService.findAll()
      .subscribe(accounts => {
        this.accounts = accounts;
        this.getShortageAccounts();
        this.getOptimalAccounts();
        this.getSurplusAccounts();
      });
  }

  getShortageAccounts() {
    this.accountService.getShortageAccounts()
      .subscribe(shortageAccounts => {
        this.shortageAccounts = shortageAccounts;
        this.updateChartData();
      })
  }

  getOptimalAccounts() {
    this.accountService.getOptimalAccounts()
      .subscribe(optimalAccounts => {
        this.optimalAccounts = optimalAccounts;
        this.updateChartData();
      })
  }

  getSurplusAccounts() {
    this.accountService.getSurplusAccounts()
      .subscribe(surplusAccounts => {
        this.surplusAccounts = surplusAccounts;
        this.updateChartData();
        this.addChartToHistory();
        this.calculateYAxisMax();
      })
  }

  generateAccounts(numberOfAccounts: number | null) {
    numberOfAccounts = this.numberOfAccountToGenerate;
    return this.accountService.generateAccounts(numberOfAccounts)
      .subscribe(accounts => {
        this.accounts.push(...accounts);
        this.numberOfAccountToGenerate = null
        this.getAll();
      });
  }

  resetAccounts() {
    this.accountService.resetAccounts()
      .subscribe(accounts => {
        this.accounts = accounts;
        this.chartResultsHistory = [];
        this.getAll();
      })
  }

  updateChartData() {
    this.chartResults = [
      {
        "name": "shortage",
        "value": this.shortageAccounts.length
      },
      {
        "name": "optimal",
        "value": this.optimalAccounts.length
      },
      {
        "name": "surplus",
        "value": this.surplusAccounts.length
      }
    ];
    if (this.chartResultsHistory.length === 12) {
      this.chartResultsHistory = [];
    }
  }

  addChartToHistory() {
    const chart = this.chartResults.map((x: any) => ({...x}))
    this.chartResultsHistory.push(chart);
  }

  calculateYAxisMax() {
    const highestValue = Math.max(...this.chartResultsHistory.flatMap(results => results.map((r: any) => r.value)));
    const padding = highestValue * 0.2
    this.yAxisMaxValue = highestValue + padding;
  }

  startOptimizeSupply() {
    this.accountService.startOptimizeSupply()
      .subscribe(response => {
        console.log("subscribed, process started")
      })

    this.subscription = interval(1000).pipe(
      switchMap(() => this.accountService.findAll())
    ).subscribe(accounts => {
      this.accounts = accounts;
      this.getShortageAccounts();
      this.getOptimalAccounts();
      this.getSurplusAccounts();
    })
  }

  stopOptimizeSupply() {
    this.accountService.stopOptimizeSupply()
      .subscribe(() => {
        console.log("process shutdown")
        if (this.subscription) {
          this.subscription.unsubscribe()
        }
      });
  }
}
