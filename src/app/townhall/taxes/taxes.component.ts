import {Component, OnInit} from '@angular/core';
import {mockGameDto} from "../../mocks/mock-game-dto";
import {GameDto} from "../../dtos/gameDto";
import {StatsCalculationService} from "../../services/stats-calculation.service";
import {AccountService} from "../../services/account.service";
import {Account} from "../../dtos/account";
import {SupplyTypes} from "../../supplyType";

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.component.html',
  styleUrls: ['./taxes.component.css']
})
export class TaxesComponent implements OnInit{

  mockGameDto: GameDto = mockGameDto;
  shortageAccounts: Account[] = [];
  surplusAccounts: Account[] = [];

  isSideBarGradient: boolean = true;
  sideBarColorCode: string = `#cc0303 50%, #663399FF 50%`;
  viewType: string = 'taxes';

  constructor(private calctulationService: StatsCalculationService,
              private accountService: AccountService) {
  }

  ngOnInit() {
    this.shortageAccounts = this.accountService.filterAccountType(this.mockGameDto, SupplyTypes.SHORTAGE.name);
    this.surplusAccounts = this.accountService.filterAccountType(this.mockGameDto, SupplyTypes.SURPLUS.name);
  }
}
