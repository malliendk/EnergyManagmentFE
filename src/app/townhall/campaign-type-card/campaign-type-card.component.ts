// import {Component, Input} from '@angular/core';
// import {CampaignObject} from "../../campaignObject";
// import {ExtendedGameDTO} from "../../extendedGameDTO";
//
// @Component({
//     selector: 'app-campaign-type-card',
//     templateUrl: './campaign-type-card.component.html',
//     styleUrls: ['./campaign-type-card.component.css'],
//     standalone: false
// })
// export class CampaignTypeCardComponent {
//
//   @Input() campaignObject!: CampaignObject;
//
//   @Input() campaignType!: string;
//   @Input() campaignTypeString!: string;
//
//   @Input() imageName!: string;
//
//   launchCampaign(campaign: CampaignObject, gameDto: ExtendedGameDTO) {
//     gameDto.funds -= campaign.fundsCost;
//     gameDto.popularity += campaign.popGain;
//   }
// }
