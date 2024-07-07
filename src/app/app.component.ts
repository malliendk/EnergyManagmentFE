import {Component, OnInit} from '@angular/core';
import {GameDtoService} from "./services/game-dto.service";
import {GameDto} from "./dtos/gameDto";
import {mockGameDto} from "./mocks/mock-game-dto";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Energy Management';

  mockGameDto = mockGameDto;

  constructor(private gameDtoService: GameDtoService) {
  }

  ngOnInit(): void {
    mockGameDto.totalGridLoad = this.gameDtoService.calculateTotalGridLoad()
  }
}
