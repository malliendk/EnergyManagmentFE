import {Component, Input, OnInit} from '@angular/core';
import {GameDTO} from "../dtos/gameDTO";
import {mockGameDto} from "../mocks/mock-game-dto";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  transitionClass = 'nav-demo navbar-expand-lg night'
  toMorning = 'morning';
  toAfternoon = 'afternoon';


  @Input() mockGameDto!: GameDTO

  ngOnInit() {
    this.mockGameDto = mockGameDto
  }

  transition() {
    console.log(this.transitionClass);
    if (this.transitionClass.includes('morning')) {
      this.transitionClass = this.transitionClass.replace('morning', 'afternoon');
    } else if (this.transitionClass.includes('afternoon')) {
      this.transitionClass = this.transitionClass.replace('afternoon', 'evening');
    } else if (this.transitionClass.includes('evening')) {
      this.transitionClass = this.transitionClass.replace('evening', 'night');
    } else if (this.transitionClass.includes('night')) {
      this.transitionClass = this.transitionClass.replace('night', 'morning');
    }
      console.log(this.transitionClass);
  }
}
