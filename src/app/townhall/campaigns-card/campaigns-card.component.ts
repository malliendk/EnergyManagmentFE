import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-campaigns-card',
  templateUrl: './campaigns-card.component.html',
  styleUrls: ['./campaigns-card.component.css']
})
export class CampaignsCardComponent {

  @Input() campaignType: string = '';

  flyerenString: string = 'Flyeren';


}
