import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-townhall-info',
  templateUrl: './townhall-info.component.html',
  styleUrls: ['./townhall-info.component.css']
})
export class TownhallInfoComponent {

  @Input() componentView!: string;

  goalInfo: string = "Invest in your city's sustainable plan by investing in solar panels on public and private rooftops";
  solarPanelInfo: string = 'Solar panels come in batches of 100 accounts. Every batch costs 500 gold';
  shortageInfo: string = 'Generate too little electricity for their own needs';
  shortageGoldInfo: string = 'Grant 3 times their shortage in gold by raising taxes';
  optimalInfo: string = 'Generate exactly their own energy consumption.';
  optimalGoldInfo: string = 'Grant 5 a basic income of 5 gold per time unit'
  surplusInfo: string = 'Generate too much electricity for their own needs';
  surplusGoldInfo: string = 'Grant 3 times their shortage in gold by raising taxes';
  campaignInfo: string = 'Launch campaigns to increase public awareness of your visionary efforts';
  popularityInfo: string = 'You popularity increases by 100 for every 250 gold spent';



}
