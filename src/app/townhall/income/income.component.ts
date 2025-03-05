// import {Component, OnInit} from '@angular/core';
// import {ExtendedGameDTO} from "../../extendedGameDTO";
// import {Account} from "../../dtos/account";
// import {AccountService} from "../../services/account.service";
// import {SupplyTypes} from "../../supplyType";
//
// @Component({
//     selector: 'app-income',
//     templateUrl: './income.component.html',
//     styleUrls: ['./income.component.css'],
//     standalone: false
// })
// export class IncomeComponent implements OnInit {
//
//   optimalAccounts: Account[] = [];
//
//   isSideBarGradient: boolean = false;
//   sideBarColorCode: string = '#209f01';
//
//   constructor(private calculationService: StatsCalculationService,
//               private accountService: AccountService) {
//   }
//
//   ngOnInit(): void {
//     // this.optimalAccounts = this.setOptimalAccounts()
//     // this.mockGameObject.goldIncome = this.calculateIncome();
//   }
//
//   // setOptimalAccounts(): Account[] {
//   //   return this.accountService.filterAccountByType(mockGameObject, SupplyTypes.OPTIMAL.name);
//   // }
//   //
//   // calculateIncome(): number {
//   //   return this.calculationService.calculateIncome(this.mockGameObject);
//   // }
//
// }
