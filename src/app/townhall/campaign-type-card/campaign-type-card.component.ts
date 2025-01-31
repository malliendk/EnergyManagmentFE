import {Component, Input} from '@angular/core';
import {mockGameObject} from "../../mocks/mock-game-object";
import {CampaignObject} from "../../CampaignObject";
import {GameObject} from "../../dtos/gameObject";

@Component({
  selector: 'app-campaign-type-card',
  templateUrl: './campaign-type-card.component.html',
  styleUrls: ['./campaign-type-card.component.css']
})
export class CampaignTypeCardComponent {

  mockGameDto: GameObject = mockGameObject;
  @Input() campaignObject!: CampaignObject;

  @Input() campaignType!: string;
  @Input() campaignTypeString!: string;

  @Input() imageName!: string;

  launchCampaign(campaign: CampaignObject, gameDto: GameObject) {
    gameDto.funds -= campaign.fundsCost;
    gameDto.popularity += campaign.popGain;
  }
}
