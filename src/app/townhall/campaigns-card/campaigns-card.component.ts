import {Component, Input, OnInit} from '@angular/core';
import {CampaignObject} from "../../CampaignObject";
import {mockCampagins} from "../../mocks/mock-campagins";
import {mockGameDto} from "../../mocks/mock-game-dto";
import {GameDTO} from "../../dtos/gameDTO";

@Component({
  selector: 'app-campaigns-card',
  templateUrl: './campaigns-card.component.html',
  styleUrls: ['./campaigns-card.component.css']
})
export class CampaignsCardComponent implements OnInit{

  mockGameDto: GameDTO = mockGameDto;

  campaigns: CampaignObject[] = mockCampagins;
  flyeren: CampaignObject = this.campaigns[0];
  socialMediaCampaign: CampaignObject = this.campaigns[1];
  langsDeDeuren: CampaignObject = this.campaigns[2]
  vlogsEnPodcasts: CampaignObject = this.campaigns[3]
  @Input() campaignType: string = '';

  flyerenString: string = 'Flyeren';
  socialMediaString: string = 'Social media';
  langsDeDeurenString: string = 'Langs de deuren';
  vlogsPodcastString: string = 'vlogPodcast';

  ngOnInit() {

  }

  launchCampaign(campaign: CampaignObject, gameDto: GameDTO) {
    gameDto.funds -= campaign.fundsCost;
    gameDto.popularity += campaign.popGain
  }
}
