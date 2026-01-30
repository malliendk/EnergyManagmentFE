// import {Component, Input, OnInit} from '@angular/core';
//
// @Component({
//     selector: 'app-chart-pie',
//     templateUrl: './chart-pie.component.html',
//     styleUrls: ['./chart-pie.component.css'],
//     standalone: false
// })
// export class ChartPieComponent implements OnInit {
//
//   @Input() view!: number[]
//   @Input() legendPosition: string = '';
//   @Input() gradient: boolean = false;
//   @Input() showLegend: boolean = false;
//   @Input() showLabels: boolean = false;
//   @Input() isDoughnut: boolean = false;
//   @Input() trimLabels = false;
//   @Input() arcWidth: number = 0;
//
//   @Input() chartVariableNames: string[] = [];
//   @Input() chartColorValues: string[] = [];
//   @Input() chartResultValues: number[] = [];
//   @Input() labelFormatting!: (c: any) => string;
//
//   chartResults: any[] = [];
//   customColors: any[] = [];
//
//   ngOnInit() {
//     this.setChartColors();
//     this.setChartResults();
//   }
//
//   setChartColors(): void {
//     this.customColors = this.chartVariableNames.map((name: string, index: number) => ({
//       name: name,
//       value: this.chartColorValues[index]
//     }));
//   }
//
//   setChartResults(): void {
//     this.chartResults = this.chartVariableNames.map((name: string, index: number) => ({
//       name: name,
//       value: this.chartResultValues[index]
//     }));
//   }
// }
