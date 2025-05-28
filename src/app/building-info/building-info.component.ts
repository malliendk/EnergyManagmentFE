import {Component, Input} from '@angular/core';
import {CurrencyPipe, DecimalPipe, NgClass, NgStyle} from "@angular/common";
import {Building} from "../dtos/building";
import {District} from "../dtos/district";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-building-info',
  imports: [
    NgStyle,
    NgClass,
    CurrencyPipe,
    DecimalPipe,
    FormsModule
  ],
  templateUrl: './building-info.component.html',
  standalone: true,
  styleUrl: './building-info.component.css'
})
export class BuildingInfoComponent {

  @Input() building?: Building;
  @Input() district?: District;

  @Input() customHeight?: string;
  @Input() customWidth?: string;
  @Input() customPadding?: string;
  @Input() customMargin?: string;
  @Input() showSolarPanel: boolean = false;

  solarPanelAmount: number = 0;

  getCustomWidth(): string {
    return this.customWidth ? 'width-' + this.customWidth : '';
  }

  getCustomPadding(): string {
    return this.customPadding ? 'padding-' + this.customPadding : '';
  }

  getCustomMargin(): string {
    return this.customPadding ? 'margin-' + this.customPadding : '';
  }
}
