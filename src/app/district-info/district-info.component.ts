import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {District} from "../dtos/district";
import {DecimalPipe, NgClass} from "@angular/common";

@Component({
  selector: 'app-district-info',
  imports: [
    DecimalPipe,
    NgClass
  ],
  templateUrl: './district-info.component.html',
  standalone: true,
  styleUrl: './district-info.component.css'
})
export class DistrictInfoComponent implements OnInit, OnChanges {

  @Input() gameDTO!: ExtendedGameDTO;
  districts!: District[];

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
    if (stressLevel <= 0) return 'Normal';
    if (stressLevel <= 0.1) return 'Minor Stress';
    if (stressLevel <= 0.3) return 'Moderate Stress';
    if (stressLevel <= 0.5) return 'Severe Stress';
    return 'BLACKOUT';
  }

}
