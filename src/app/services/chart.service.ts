import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  chartVariableNames: string[] = [];
  chartColorValues: string[] = [];
  chartResultValues: number[] = [];

  constructor() {
  }

  updateChartData(chartVariableNames: string[], chartColorValues: string[], chartResultValues: number[]): { customColors: any[], chartResults: any[] } {
    this.chartVariableNames = chartVariableNames;
    this.chartColorValues = chartColorValues;
    this.chartResultValues = chartResultValues;

    const customColors = this.setChartColors();
    const chartResults = this.setChartResults();

    return { customColors, chartResults };
  }

  private setChartColors(): any[] {
    return this.chartVariableNames.map((name: string, index: number) => ({
      name: name,
      value: this.chartColorValues[index]
    }));
  }

  private setChartResults(): any[] {
    return this.chartVariableNames.map((name: string, index: number) => ({
      name: name,
      value: this.chartResultValues[index]
    }));
  }
}
