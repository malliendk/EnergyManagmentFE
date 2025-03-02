import {Component, OnInit} from '@angular/core';
import {mockGameObject} from "../../mocks/mock-game-object";
import {ExtendedGameDTO} from "../../extendedGameDTO";
import {StatsCalculationService} from "../../services/stats-calculation.service";
import {AccountService} from "../../services/account.service";
import {Account} from "../../dtos/account";
import {SupplyTypes} from "../../supplyType";

@Component({
    selector: 'app-taxes',
    templateUrl: './taxes.component.html',
    styleUrls: ['./taxes.component.css'],
    standalone: false
})
export class TaxesComponent implements OnInit {

  mockGameDto: ExtendedGameDTO = mockGameObject;
  deviationAccounts: Account[] = [];
  deviationTotal: number = 0;
  taxAmount: number = 0;
  popularityLoss: number = 0;

  isSideBarGradient: boolean = true;
  sideBarColorCode: string = `#cc0303, #663399FF`;

  constructor(private calculationService: StatsCalculationService,
              private accountService: AccountService) {
  }

  ngOnInit() {
    // this.deviationAccounts = this.filterDeviateAccounts();
    this.deviationTotal = this.calculateDeviationTotal();
    this.taxAmount = this.calculateTaxAmount();
    this.popularityLoss = this.calculatePopularityLoss();
  }

  // filterDeviateAccounts(): Account[] {
  //   const shortageAccounts: Account[] = this.accountService.filterAccountByType(this.mockGameObject, SupplyTypes.SHORTAGE.name);
  //   const surplusAccounts: Account[] = this.accountService.filterAccountByType(this.mockGameObject, SupplyTypes.SURPLUS.name);
  //   return shortageAccounts.concat(surplusAccounts);
  // }

  calculateDeviationTotal(): number {
    return this.calculationService.calculateTaxableSupplyTotal(this.deviationAccounts);
  }

  calculateTaxAmount(): number {
    return this.calculationService.calculateTaxAmount(this.deviationAccounts, this.mockGameDto);
  }

  calculatePopularityLoss(): number {
    return this.calculationService.calculatePopularityLoss(this.taxAmount, this.mockGameDto)
  }

  raiseTaxes() {
    this.calculationService.raiseTaxes(this.taxAmount, this.mockGameDto, this.deviationAccounts)
  }
}
