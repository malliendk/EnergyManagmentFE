import {Component, Input, OnInit} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";
import {Building} from "../dtos/building";

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
}
