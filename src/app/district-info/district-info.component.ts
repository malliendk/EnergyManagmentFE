import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {District} from "../dtos/district";
import {DecimalPipe, NgClass} from "@angular/common";
import {BuildingInfoComponent} from "../building-info/building-info.component";

@Component({
  selector: 'app-district-info',
  imports: [
    // DecimalPipe,
    NgClass,
    BuildingInfoComponent
  ],
  templateUrl: './district-info.component.html',
  standalone: true,
  styleUrl: './district-info.component.css'
})
export class DistrictInfoComponent implements OnInit, OnChanges {

  @Input() gameDTO!: ExtendedGameDTO;
  @Input() showIncomeStats?: boolean;
  districts!: District[];
  customWidth: string = '100';
  customPadding: string = '0';
  customMargin: string = '0';

  ngOnInit() {
    console.log('Initial gameDTO in district info:', this.gameDTO);
    this.districts = this.gameDTO.districts;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gameDTO'] && changes['gameDTO'].currentValue) {
      this.districts = this.gameDTO.districts;
    }
  }

  getStressText(stressLevel: number): string {
    if (stressLevel <= 0) return 'Normaal';
    if (stressLevel <= 0.1) return 'Waarschuwing';
    if (stressLevel <= 0.3) return 'Gevaar';
    if (stressLevel <= 0.5) return 'Kritiek';
    return 'UITVAL';
  }
}
