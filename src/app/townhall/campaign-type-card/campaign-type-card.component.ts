import {Component, Input} from '@angular/core';
import {mockGameDto} from "../../mocks/mock-game-dto";
import {CampaignObject} from "../../CampaignObject";
import {GameDTO} from "../../dtos/gameDTO";

@Component({
  selector: 'app-campaign-type-card',
  templateUrl: './campaign-type-card.component.html',
  styleUrls: ['./campaign-type-card.component.css']
})
export class CampaignTypeCardComponent {

  mockGameDto: GameDTO = mockGameDto;
  @Input() campaignObject!: CampaignObject;

  @Input() campaignType!: string;
  @Input() campaignTypeString!: string;

  @Input() imageName!: string;

  launchCampaign(campaign: CampaignObject, gameDto: GameDTO) {
    gameDto.funds -= campaign.fundsCost;
    gameDto.popularity += campaign.popGain;
  }
}
