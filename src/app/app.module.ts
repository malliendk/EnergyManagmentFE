import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {AccountComponent} from './account/account.component';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MainDashboardComponent} from './dashboards/supervisor-dashboard/main-dashboard.component';
import {UpdateButtonComponent} from './buttons/update-button/update-button.component';
import {CreateButtonComponent} from './buttons/create-button/create-button.component';
import {SupervisorListComponent} from './list-views/supervisor-list/supervisor-list.component';
import {DistributorListComponent} from './list-views/distributor-list/distributor-list.component';
import {NavbarComponent} from './navbar/navbar.component';
import {LocalityComponent} from './locality/locality.component';
import {LocalityListComponent} from './list-views/localty-list/locality-list.component';
import {AccountListComponent} from './list-views/account-list/account-list.component';
import {ToastrModule} from "ngx-toastr";
import {NavigateButtonComponent} from './buttons/navigate-button/navigate-button.component';
import {SupervisorComponent} from './supervisor/supervisor.component';
import {DistributorComponent} from './distributor/distributor.component';
import {DistributorDetailComponent} from './detail-views/distributor-detail/distributor-detail.component';
import {ChoiceCreateSupervisorComponent} from './choice-create-supervisor/choice-create-supervisor.component';
import {SupervisorDetailComponent} from './detail-views/supervisor-detail/supervisor-detail.component';
import {LocalityDetailComponent} from './detail-views/locality-detail/locality-detail.component';
import { GameModeSelectComponent } from './game-mode-select/game-mode-select.component';
import { GridloadDashboardComponent } from './gridload-dashboard/gridload-dashboard.component';
import { ModalComponent } from './modal/modal.component';
import { GameInterfaceComponent } from './game-interface/game-interface.component';
import { GridloadDashboardTableComponent } from './gridload-dashboard-table/gridload-dashboard-table.component';
import { GridloadDashboardChartComponent } from './gridload-dashboard-chart/gridload-dashboard-chart.component';
import { ClockComponent } from './clock/clock.component';
import { TownhallDashboardComponent } from './townhall-dashboard/townhall-dashboard.component';
import { LoadsourceDashboardComponent } from './loadsource-dashboard/loadsource-dashboard.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { FactoryDashboardComponent } from './factory-dashboard/factory-dashboard.component';
import { SliderComponent } from './slider/slider.component';
import { BorderBlockComponent } from './border-block/border-block.component';
import { ChartBarHorizontalComponent } from './chart-bar-horizontal/chart-bar-horizontal.component';
import { ChartPieComponent } from './chart-pie/chart-pie.component';
import { ChartBarVerticalComponent } from './chart-bar-vertical/chart-bar-vertical.component';
import { TownhallInfoComponent } from './townhall-info/townhall-info.component';
import { TownhallChartBoxComponent } from './townhall-chart-box/townhall-chart-box.component';



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
    LocalityDetailComponent,
    GameModeSelectComponent,
    GridloadDashboardComponent,
    ModalComponent,
    GameInterfaceComponent,
    GridloadDashboardTableComponent,
    GridloadDashboardChartComponent,
    ClockComponent,
    TownhallDashboardComponent,
    LoadsourceDashboardComponent,
    SideBarComponent,
    FactoryDashboardComponent,
    LoadsourceDashboardComponent,
    SliderComponent,
    BorderBlockComponent,
    ChartBarHorizontalComponent,
    ChartPieComponent,
    ChartBarVerticalComponent,
    TownhallInfoComponent,
    TownhallChartBoxComponent,

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
