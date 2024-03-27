import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {AccountComponent} from './account/account.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { SupervisorDashboardComponent } from './dashboards/supervisor-dashboard/supervisor-dashboard.component';
import { UpdateButtonComponent } from './buttons/update-button/update-button.component';
import { CreateButtonComponent } from './buttons/create-button/create-button.component';
import { SupervisorListComponent } from './list-views/supervisor-list/supervisor-list.component';
import { DistributorViewComponent } from './list-views/distributor-list/distributor-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LocalityComponent } from './locality/locality.component';
import { LocalityListComponent } from './list-views/localty-list/locality-list.component';
import { AccountListComponent } from './list-views/account-list/account-list.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    SupervisorDashboardComponent,
    UpdateButtonComponent,
    CreateButtonComponent,
    SupervisorListComponent,
    DistributorViewComponent,
    NavbarComponent,
    LocalityComponent,
    LocalityListComponent,
    AccountListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
