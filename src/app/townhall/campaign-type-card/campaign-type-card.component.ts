import {Component, Input} from '@angular/core';
import {mockGameObject} from "../../mocks/mock-game-object";
import {CampaignObject} from "../../CampaignObject";
import {ExtendedGameDTO} from "../../extendedGameDTO";

@Component({
    selector: 'app-campaign-type-card',
    templateUrl: './campaign-type-card.component.html',
    styleUrls: ['./campaign-type-card.component.css'],
    standalone: false
})
export class CampaignTypeCardComponent {

  mockGameDto: ExtendedGameDTO = mockGameObject;
  @Input() campaignObject!: CampaignObject;

  @Input() campaignType!: string;
  @Input() campaignTypeString!: string;

  @Input() imageName!: string;

  launchCampaign(campaign: CampaignObject, gameDto: ExtendedGameDTO) {
    gameDto.funds -= campaign.fundsCost;
    gameDto.popularity += campaign.popGain;
  }
}
