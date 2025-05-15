import {Component, Input, OnInit} from '@angular/core';
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";
import {District} from "../dtos/district";

@Component({
  selector: 'app-district-info',
  imports: [],
  templateUrl: './district-info.component.html',
  standalone: true,
  styleUrl: './district-info.component.css'
})
export class DistrictInfoComponent implements OnInit{

  @Input() gameDTO!: ExtendedGameDTO;

  districts!: District[]

  ngOnInit() {
    this.districts = this.gameDTO.districts;
  }
}
