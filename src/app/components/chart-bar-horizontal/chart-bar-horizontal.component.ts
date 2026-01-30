// import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
// import {ChartService} from "../services/chart.service";
//
// @Component({
//     selector: 'app-chart-bar-horizontal',
//     templateUrl: './chart-bar-horizontal.component.html',
//     styleUrls: ['./chart-bar-horizontal.component.css'],
//     standalone: false
// })
// export class ChartBarHorizontalComponent implements OnInit, OnChanges{
//
//   @Input() gradient: boolean = false;
//   @Input() animations: boolean = false;
//   @Input() showXAxis: boolean = false;
//   @Input() showYAxis: boolean = false;
//   @Input() showXAxisLabel: boolean = false;
//   @Input() showYAxisLabel: boolean = false;
//   @Input() showGridLines: boolean = false;
//   @Input() xAxisLabel: string = '';
//   @Input() yAxisLabel: string = '';
//   @Input() xScaleMax: number = 0;
//
//   @Input() chartVariableNames: string[] = [];
//   @Input() chartColorValues: string[] = [];
//   @Input() chartResultValues: number[] = [];
//
//   chartResults: any[] = [];
//   customColors: any[] = [];
//
//   constructor(private chartService: ChartService,) {
//   }
//
//   ngOnInit() {
//     this.updateChartData();
//   }
//
//   ngOnChanges() {
//     this.updateChartData();
//   }
//
//   private updateChartData(): void {
//     const { customColors, chartResults } = this.chartService.updateChartData(this.chartVariableNames, this.chartColorValues, this.chartResultValues);
//     this.customColors = customColors;
//     this.chartResults = chartResults;
//   }
//     // }
//     // ngOnChanges(changes: SimpleChanges) {
//     //   if (changes['chartResultValues'] && changes['chartResultValues'].currentValue) {
//     //     this.setChartResults();
//     //   }
//     // }
//
// }
