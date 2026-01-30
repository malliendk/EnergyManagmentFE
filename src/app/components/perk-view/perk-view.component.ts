import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModalComponent} from "../modal/modal.component";

@Component({
  selector: 'app-perk-view',
  imports: [
    ModalComponent
  ],
  templateUrl: './perk-view.component.html',
  standalone: true,
  styleUrl: './perk-view.component.css'
})
export class PerkViewComponent {

  @Input() categoryText!: string;
  @Input() specialismTopText!: string;
  @Input() specialismBottomText!: string;
  @Input() topLevel!: number;
  @Input() bottomLevel!: number;
  @Input() researchTotal!: number;

  @Output() passUpgrade =
    new EventEmitter<{ cost: number, level: number, variableName: string }>();

  maxLevel: number = 5;
  upgradecost: number = 500;

  displayMaxLevelReachedModal: boolean = false;
  isNotEnoughResearch: boolean = false;


  getFilledStarsArray(level: number): number[] {
    return Array.from({length: level}, (_, i) => i);
  }

  getEmptyStarsArray(level: number): number[] {
    return Array.from({length: this.maxLevel - level}, (_, i) => i);
  }

  addTopLevel() {
    if (this.topLevel === this.maxLevel) {
      this.toggleMaxLevelReachedModal();
      return;
    }
    if (this.researchTotal < this.upgradecost) {
      this.toggleNotEnoughResearch();
      return;
    }
    ++this.topLevel;
    this.passUpgrade.emit({
      cost: this.upgradecost,
      level: this.topLevel,
      variableName: this.specialismTopText
    });
  }

  addBottomLevel() {
    if (this.bottomLevel === this.maxLevel) {
      this.toggleMaxLevelReachedModal();
      return;
    }
    if (this.researchTotal < this.upgradecost) {
      this.toggleNotEnoughResearch();
      return;
    }
    ++this.bottomLevel;
    this.passUpgrade.emit({
      cost: this.upgradecost,
      level: this.bottomLevel,
      variableName: this.specialismBottomText
    });
  }

  toggleMaxLevelReachedModal() {
    this.displayMaxLevelReachedModal = !this.displayMaxLevelReachedModal;
  }

  toggleNotEnoughResearch() {
    this.isNotEnoughResearch = !this.isNotEnoughResearch;
  }
}
