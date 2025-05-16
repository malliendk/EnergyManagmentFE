import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {District} from "../dtos/district";

@Component({
  selector: 'app-district-info',
  imports: [],
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
}
