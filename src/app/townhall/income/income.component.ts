import {Component, OnInit} from '@angular/core';
import {GameDto} from "../../dtos/gameDto";
import {mockGameDto} from "../../mocks/mock-game-dto";
import {StatsCalculationService} from "../../services/stats-calculation.service";
import {Account} from "../../dtos/account";
import {AccountService} from "../../services/account.service";
import {SupplyTypes} from "../../supplyType";

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css']
})
export class IncomeComponent implements OnInit {

  mockGameDto: GameDto = mockGameDto;
  optimalAccounts: Account[] = [];

  isSideBarGradient: boolean = false;
  sideBarColorCode: string = '#209f01';

  constructor(private calculationService: StatsCalculationService,
              private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.optimalAccounts = this.setOptimalAccounts()
    this.mockGameDto.income = this.calculateIncome();
  }

  setOptimalAccounts(): Account[] {
    return this.accountService.filterAccountByType(mockGameDto, SupplyTypes.OPTIMAL.name);
  }

  calculateIncome(): number {
    return this.calculationService.calculateIncome(this.mockGameDto);
  }

  addIncome(): number {
    return this.calculationService.addIncome(this.mockGameDto);
  }

  startAddingIncome(): void {
    setInterval(() => {
      console.log("income started, income: {}, new funds: {}",
        this.mockGameDto.income, this.mockGameDto.funds);
      this.calculationService.addIncome(this.mockGameDto);
    }, 1000)
  }
}
