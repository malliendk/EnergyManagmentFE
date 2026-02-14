import {Component} from '@angular/core';
import {BuildingDTO} from "../dtos/buildingDTO";
import {ModalComponent} from "../components/modal/modal.component";

@Component({
  selector: 'app-powerline-purchase',
  imports: [
    ModalComponent
  ],
  templateUrl: './powerline-purchase.component.html',
  standalone: true,
  styleUrl: './powerline-purchase.component.css'
})
export class PowerlinePurchaseComponent {

  powerLine!: BuildingDTO;
  isPowerLineModalOpen: any;
  showPurchasePowerLine: any;
  building: any;

  togglePowerLineBiModal() {

  }

  purchasePowerLine() {

  }

  setBuilding(param: any) {

  }

  togglePurchasePowerLine() {


  }
}
