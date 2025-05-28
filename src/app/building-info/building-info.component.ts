import {Component, Input} from '@angular/core';
import {CurrencyPipe, NgClass, NgStyle} from "@angular/common";
import {Building} from "../dtos/building";

@Component({
  selector: 'app-building-info',
  imports: [
    NgStyle,
    NgClass,
    CurrencyPipe
  ],
  templateUrl: './building-info.component.html',
  standalone: true,
  styleUrl: './building-info.component.css'
})
export class BuildingInfoComponent {

  @Input() building!: Building;

  @Input() customHeight: string = '';
  @Input() customWidth: string = '';

  getCustomWidth(): string {
    return this.customWidth;
  }
}
