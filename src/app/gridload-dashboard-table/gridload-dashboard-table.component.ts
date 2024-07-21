import {Component, Input, OnInit} from '@angular/core';
import {LoadSource} from "../dtos/loadSource";
import {GameDto} from "../dtos/gameDto";

@Component({
  selector: 'app-gridload-dahsboard-table',
  templateUrl: './gridload-dashboard-table.component.html',
  styleUrls: ['./gridload-dashboard-table.component.css']
})
export class GridloadDashboardTableComponent implements OnInit {


  @Input() mockGameDto!: GameDto
  tableTitle = 'Grid capacity'
  maxLoad = 15;

  ngOnInit(): void {
    this.calculateTotalGridload();
  }

  private calculateTotalGridload() {
    return this.mockGameDto.sources.reduce(
      (accumulator, currentValue) => accumulator + currentValue.gridLoad, 0);
  }
}
