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

  constructor(private accountService: AccountService) {
  }

  ngOnInit() {
  }

  //income

  addIncome(mockGameDto: GameDto): number {
    return mockGameDto.income + mockGameDto.funds;
  }

  calculateIncome(mockGameDto: GameDto): number {
    const optimalAccountAmount: number = this.accountService.filterAccountByType(mockGameDto, SupplyTypes.OPTIMAL.name).length;
    return optimalAccountAmount * mockGameDto.incomeRate;
  }

  //taxes
  raiseTaxes(taxAmount: number, mockGameDto: GameDto, accounts: Account[]) {
    mockGameDto.funds += this.calculateTaxes(accounts!);
    mockGameDto.popularity -= this.calculatePopularityLoss(taxAmount, mockGameDto);
  }

  calculateTaxes(accounts: Account[]): number {
    return this.calculateTaxableSupplyTotal(accounts) * mockGameDto.taxRate;
  }


  calculateTaxAmount(accounts: Account[], mockGameDto: GameDto): number {
    return this.calculateTaxableSupplyTotal(accounts) * mockGameDto.taxRate;
  }

  calculateTaxableSupplyTotal(accounts: Account[]): number {
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

  calculatePopularityLoss(taxAmount: number, mockGameDto: GameDto): number {
    return taxAmount * mockGameDto.popRate;
  }

  //solar panels
  calculateSolarPanelCost(accountAmount: number, accountCost: number): number {
    return accountAmount * accountCost;
  }

  estimateIncomeIncrease(accountAmount: number, mockGameDto: GameDto): number {
    return accountAmount * mockGameDto.incomeRate * ( 1 / 7 );
  }

  estimateGridLoadIncrease(accountAmount: number): number {
    return accountAmount * 0.3 * ( 6 / 7 ) / 10;
  }
}