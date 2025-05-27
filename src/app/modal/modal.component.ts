import {Component, Input} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
  imports: [
    NgClass
  ]
})
export class ModalComponent {

  @Input() isModalOpen: boolean = false;
  @Input() customWidthClass?: string;
  @Input() showHeader!: boolean;
  @Input() headerClass: string = '';
}
