import {Injectable, OnInit} from '@angular/core';
import {Account} from "../dtos/account";
import {SupplyTypes} from "../supplyType";
import {mockGameDto} from "../mocks/mock-game-dto";
import {GameDto} from "../dtos/gameDto";
import {AccountService} from "./account.service";

@Injectable({
  providedIn: 'root'
})
export class StatsCalculationService implements OnInit{

  incomeView: string = 'income';
  taxView: string = 'taxes';
  solarPanelView: string = 'solar panels';
  campaignView: string = 'campaign';

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
  }

  calculateStats(mockGameDto: GameDto, componentView: string, accounts?: Account[]): void {
    switch(componentView) {
      case this.incomeView: mockGameDto.funds += this.calculateIncome(mockGameDto);
      break;
      case this.taxView: {
        mockGameDto.funds += this.calculateTaxes(accounts!);
        mockGameDto.popularity -= this.calculatePopularityLoss(accounts!);
      }
      break;
    }
  }

  calculateIncome(mockGameDto: GameDto): number {
    const optimalAccountAmount: number = this.accountService.filterAccountType(mockGameDto, SupplyTypes.OPTIMAL.name).length;
    return optimalAccountAmount * mockGameDto.incomeRate;
  }

  calculateTaxes(accounts: Account[]): number {
    return this.calculateTaxableSupplyAmount(accounts) * mockGameDto.taxRate;
  }

  calculatePopularityLoss(accounts: Account[]): number {
    return accounts.filter(account => {
      account.supplyType == SupplyTypes.SHORTAGE.name;
      account.supplyType == SupplyTypes.SURPLUS.name;
    }).length;
  }

  calculateTaxableSupplyAmount(accounts: Account[]): number {
    const totalShortageSupplyAmount: number = accounts
      .filter(account => account.supplyType === SupplyTypes.SHORTAGE.name)
      .map(account => 1 - account.supplyAmount)
      .reduce((total: number, amount: number) => total + amount, 0);
    const totalSurplusSupplyAmount: number = accounts
      .filter(account => account.supplyType === SupplyTypes.SURPLUS.name)
      .map(account => account.supplyAmount - 1)
      .reduce((total, amount) => total + amount, 0);
    return totalShortageSupplyAmount + totalSurplusSupplyAmount;
  }
}
