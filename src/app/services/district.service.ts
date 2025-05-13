import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {InitiateGameDTO} from "../dtos/initiateGameDTO";
import {GameDTOService} from "./game-dto.service";
import {ExtendedGameDTO} from "../dtos/extendedGameDTO";

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  baseURL: string = 'http://localhost:8080/district';

  constructor(private http: HttpClient,
              private gameDTOService: GameDTOService) { }

  createDistrict(extendedGameDTO: ExtendedGameDTO) {
    const initiateDTO = this.gameDTOService.minimizeToInitiateDTO(extendedGameDTO);
    return this.http.post<InitiateGameDTO>(this.baseURL, initiateDTO);
  }
}
