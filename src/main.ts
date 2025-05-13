import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideHttpClient} from '@angular/common/http';
import {importProvidersFrom} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GameDTOService} from './app/services/game-dto.service';
import {BuildingService} from './app/services/building.service';
import {GameEventsService} from './app/game-events.service';
import {DayWeatherService} from './app/services/day-weather.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
    GameDTOService,
    BuildingService,
    GameEventsService,
    DayWeatherService
  ]
}).catch(err => console.error('Error bootstrapping application:', err));
