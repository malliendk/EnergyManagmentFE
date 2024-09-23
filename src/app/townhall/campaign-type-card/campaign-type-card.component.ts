import {Component, Input} from '@angular/core';
import {mockGameDto} from "../../mocks/mock-game-dto";
import {CampaignObject} from "../../CampaignObject";
import {GameDto} from "../../dtos/gameDto";

@Component({
  selector: 'app-campaign-type-card',
  templateUrl: './campaign-type-card.component.html',
  styleUrls: ['./campaign-type-card.component.css']
})
export class CampaignTypeCardComponent {

  mockGameDto: GameDto = mockGameDto;
  @Input() campaignObject!: CampaignObject;

  @Input() campaignType!: string;
  @Input() campaignTypeString!: string;

  @Input() imageName!: string;

  launchCampaign(campaign: CampaignObject, gameDto: GameDto) {
    gameDto.funds -= campaign.fundsCost;
    gameDto.popularity += campaign.popGain;
  }
}
