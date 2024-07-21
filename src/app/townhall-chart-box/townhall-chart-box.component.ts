import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-townhall-chart-box',
  templateUrl: './townhall-chart-box.component.html',
  styleUrls: ['./townhall-chart-box.component.css']
})
export class TownhallChartBoxComponent {

  @Input() showLabels!: boolean;
  @Input() pieChartVariableNames!: any[];
  @Input() pieChartColorValues!: any[];
  @Input() pieChartResultValues!: any[];

  shortageAccountsText: string = 'shortage accounts';
  optimalAccountsText: string = 'optimal accounts';
  surplusAccountsText: string = 'surplus accounts';

  chartTitle: string = 'Rooftop solar panel accounts';
}
