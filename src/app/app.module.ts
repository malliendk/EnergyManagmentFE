import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {importProvidersFrom} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {AppComponent} from "./app.component";
import {GameDTOService} from "./services/game-dto.service";
import {BuildingService} from "./services/building.service";


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(BrowserAnimationsModule),
    GameDTOService,
    BuildingService,
    provideRouter([
    ])
  ]
}).catch(err => console.error('Error bootstrapping application:', err));
