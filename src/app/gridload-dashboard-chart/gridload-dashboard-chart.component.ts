import {Component, Input, OnInit} from '@angular/core';
import {GameDTO} from "../dtos/gameDTO";
import {Building} from "../dtos/building";
import {Color, LegendPosition, ScaleType} from '@swimlane/ngx-charts';
import {mockGameDto} from "../mocks/mock-game-dto";

@Component({
  selector: 'app-gridload-dashboard-chart',
  templateUrl: './gridload-dashboard-chart.component.html',
  styleUrls: ['./gridload-dashboard-chart.component.css']
})
export class GridloadDashboardChartComponent implements OnInit {


  @Input() mockGameDto!: GameDTO;

  chartResults: any[] = [];
  nameGridLoadArray: any[] = [];
  customColors: any[] = [];
  gradient: boolean = true;
  showLegend: boolean = false;
  xAxis: boolean = true
  yAxis: boolean = true
  legendPosition: LegendPosition = LegendPosition.Right;
  yAxisMaxValue: number = 15;
  isInitialized: boolean = false;

  ngOnInit() {
    this.mockGameDto.buildings.forEach(source => {
      this.setChartSeries(source);
      this.setCustomColors(source)
    });
    this.setChartResults();
    this.isInitialized = true;
  }

  setCustomColors(source: Building): void {
    const nameColorPair: {name: string; value: string} = {
      name: source.name,
      value: source.color
    }
    this.customColors.push(nameColorPair);
  }

  setChartResults() {
    this.chartResults = [
      {
        name: "",
        series: this.nameGridLoadArray
      }
    ]
  }

  setChartSeries(source: Building): void {
    const nameGridloadPair: {name:string, value: number} = {
      name: source.name,
      value: source.gridLoad
    }
    this.nameGridLoadArray.push(nameGridloadPair);
  }

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: this.customColors.map(c => c.value)
  };

}
