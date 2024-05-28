import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {AccountComponent} from './entity-components/account/account.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MainDashboardComponent} from './dashboards/supervisor-dashboard/main-dashboard.component';
import {UpdateButtonComponent} from './buttons/update-button/update-button.component';
import {CreateButtonComponent} from './buttons/create-button/create-button.component';
import {SupervisorListComponent} from './list-views/supervisor-list/supervisor-list.component';
import {DistributorListComponent} from './list-views/distributor-list/distributor-list.component';
import {NavbarComponent} from './navbar/navbar.component';
import {LocalityComponent} from './entity-components/locality/locality.component';
import {LocalityListComponent} from './list-views/localty-list/locality-list.component';
import {AccountListComponent} from './list-views/account-list/account-list.component';
import {ToastrModule} from "ngx-toastr";
import {NavigateButtonComponent} from './buttons/navigate-button/navigate-button.component';
import {SupervisorComponent} from './entity-components/supervisor/supervisor.component';
import {DistributorComponent} from './entity-components/distributor/distributor.component';
import {DistributorDetailComponent} from './detail-views/distributor-detail/distributor-detail.component';
import {ChoiceCreateSupervisorComponent} from './choice-create-supervisor/choice-create-supervisor.component';
import {SupervisorDetailComponent} from './detail-views/supervisor-detail/supervisor-detail.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {LocalityDetailComponent} from './detail-views/locality-detail/locality-detail.component';
import {ChooseGameModeComponent} from './choose-game-mode/choose-game-mode.component';
import { GameModeSelectComponent } from './game-mode-select/game-mode-select.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    MainDashboardComponent,
    UpdateButtonComponent,
    CreateButtonComponent,
    SupervisorListComponent,
    DistributorListComponent,
    NavbarComponent,
    LocalityComponent,
    LocalityListComponent,
    AccountListComponent,
    NavigateButtonComponent,
    SupervisorComponent,
    DistributorComponent,
    DistributorDetailComponent,
    ChoiceCreateSupervisorComponent,
    SupervisorDetailComponent,
    SidebarComponent,
    LocalityDetailComponent,
    ChooseGameModeComponent,
    GameModeSelectComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
