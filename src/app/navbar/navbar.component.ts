import {Component, Input, OnInit} from '@angular/core';
import {GameDtoService} from "../services/game-dto.service";
import {GameDto} from "../dtos/gameDto";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Input() funds?: number;
  @Input() popularity?: number;


}
