import {Component, Input, OnInit} from '@angular/core';
import {GameDto} from "../dtos/gameDto";
import {mockGameDto} from "../mocks/mock-game-dto";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  @Input() mockGameDto!: GameDto

  ngOnInit() {
    this.mockGameDto = mockGameDto
  }
}
