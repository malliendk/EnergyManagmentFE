import {Component, Input} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {BuildingDTO} from "../dtos/buildingDTO";

@Component({
  selector: 'app-building-info',
  imports: [
    CurrencyPipe,
    FormsModule,
  ],
  templateUrl: './building-info.component.html',
  standalone: true,
  styleUrl: './building-info.component.css'
})
export class BuildingInfoComponent{

  @Input() building!: BuildingDTO;
}
