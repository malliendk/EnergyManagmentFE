import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Account} from "../dtos/account";
import {AccountService} from "../services/account.service";
import {interval, Subscription, switchMap} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css'],
    standalone: false
})
export class AccountComponent implements OnInit, OnDestroy {

  accounts: Account[] = [];
  @Input() supplyType!: string;
  localityName?: string;
  distributorName? :string;

  shortageAccounts: Account[] = [];
  optimalAccounts: Account[] = [];
  surplusAccounts: Account[] = [];

  numberOfAccountToGenerate!: number | null

  private subscription!: Subscription | null;


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


  constructor(private accountService: AccountService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    if (this.localityName) {
      this.findAllByLocality(this.localityName);
    } else if (this.distributorName) {
      this.findAllByDistributor(this.distributorName);
    } else {
      this.findAll();
    }
  }

  ngOnDestroy(): void {
    this.stopOptimizeSupply();
  }

  findAll() {
    this.accountService.findAll()
      .subscribe(accounts => {
        this.accounts = accounts;
        this.updateChartData(accounts);
      });
  }

  findAllByLocality(localityName: string) {
    this.accountService.findAllByLocality(localityName)
      .subscribe(accounts => this.accounts = accounts);
  }

  findAllByDistributor(distributorName: string) {
    this.accountService.findAllByDistributor(distributorName)
      .subscribe(accounts => this.accounts = accounts);
  }

  generateAccounts(numberOfAccounts: number | null) {
    numberOfAccounts = this.numberOfAccountToGenerate;
    return this.accountService.generateAccounts(numberOfAccounts)
      .subscribe(accounts => {
        this.accounts.push(...accounts);
        this.numberOfAccountToGenerate = null
        this.findAll();
      });
  }

  resetAccounts() {
    this.accountService.resetAccounts()
      .subscribe(accounts => {
        this.accounts = accounts;
        this.chartResultsHistory = [];
        this.findAll();
      })
  }

  updateChartData(accounts: Account[]) {
    const shortageAccounts = accounts.filter(account => account.supplyType === 'shortage');
    this.shortageAccounts = shortageAccounts;
    const optimalAccounts = accounts.filter(account => account.supplyType === 'optimal');
    this.optimalAccounts = accounts;
    const surplusAccounts = accounts.filter(account => account.supplyType === 'surplus');
    this.surplusAccounts = surplusAccounts;
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
    this.addChartToHistory();
    this.calculateYAxisMax();
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
      this.updateChartData(accounts);
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
