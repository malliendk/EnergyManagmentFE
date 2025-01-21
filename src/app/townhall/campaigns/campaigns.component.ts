import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GameDTO} from "../../dtos/gameDTO";
import {mockGameDto} from "../../mocks/mock-game-dto";
import {active} from "d3";

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent {

  @Output() campaignTypeSelect = new EventEmitter<string>();

  mockGameDto: GameDTO = mockGameDto;

  isSideBarGradient: boolean = true;
  sideBarColorCode: string = '#dfc700, #b902d3';

  activeItem: string = '';
  flyerenString: string = 'Flyeren';
  socialMediaString: string = 'Social media';
  langDeDeurenString: string = 'Langs de deuren';
  vlogsEnPodCastsString: string = 'vlogPodcast';


  setActiveAndEmit(item: string) {
    this.setActive(item);
    this.emitCampaignType();
  }

  setActive(item: string) {
    this.activeItem = item;
  }

  emitCampaignType() {
    this.campaignTypeSelect.emit(this.activeItem);
  }
}
