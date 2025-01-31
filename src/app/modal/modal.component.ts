import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css'],
    standalone: false
})
export class ModalComponent {
  @Input() isModalOpen: boolean = false;
}
