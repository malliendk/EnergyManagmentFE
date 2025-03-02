import {SolarPanelsComponent} from "./townhall/solar-panels/solar-panels.component";
import {CampaignsComponent} from "./townhall/campaigns/campaigns.component";
import {CampaignsCardComponent} from "./townhall/campaigns-card/campaigns-card.component";
import {CampaignTypeCardComponent} from "./townhall/campaign-type-card/campaign-type-card.component";
import {BuildingViewComponent} from "./building-view/building-view.component";
import {DaytimeWeatherComponent} from "./daytime-weather/daytime-weather.component";
import {TaxesComponent} from "./townhall/taxes/taxes.component";
import {TownhallCardComponent} from "./townhall/townhall-card/townhall-card.component";
import {IncomeComponent} from "./townhall/income/income.component";
import {InfoComponent} from "./townhall/info/info.component";
import {ChartBarVerticalComponent} from "./chart-bar-vertical/chart-bar-vertical.component";
import {ChartPieComponent} from "./chart-pie/chart-pie.component";
import {ChartBarHorizontalComponent} from "./chart-bar-horizontal/chart-bar-horizontal.component";
import {BorderBlockComponent} from "./border-block/border-block.component";
import {SliderComponent} from "./slider/slider.component";
import {FactoryDashboardComponent} from "./factory-dashboard/factory-dashboard.component";
import {SideBarComponent} from "./side-bar/side-bar.component";
import {BuildingDashboardComponent} from "./building-dashboard/building-dashboard.component";
import {TownhallDashboardComponent} from "./townhall-dashboard/townhall-dashboard.component";
import {ClockComponent} from "./clock/clock.component";
import {GridloadDashboardChartComponent} from "./gridload-dashboard-chart/gridload-dashboard-chart.component";
import {GameInterfaceComponent} from "./game-interface/game-interface.component";
import {ModalComponent} from "./modal/modal.component";
import {GridloadDashboardComponent} from "./gridload-dashboard/gridload-dashboard.component";
import {GameModeSelectComponent} from "./game-mode-select/game-mode-select.component";
import {LocalityDetailComponent} from "./detail-views/locality-detail/locality-detail.component";
import {SupervisorDetailComponent} from "./detail-views/supervisor-detail/supervisor-detail.component";
import {ChoiceCreateSupervisorComponent} from "./choice-create-supervisor/choice-create-supervisor.component";
import {DistributorDetailComponent} from "./detail-views/distributor-detail/distributor-detail.component";
import {DistributorComponent} from "./distributor/distributor.component";
import {SupervisorComponent} from "./supervisor/supervisor.component";
import {NavigateButtonComponent} from "./buttons/navigate-button/navigate-button.component";
import {AccountListComponent} from "./list-views/account-list/account-list.component";
import {LocalityListComponent} from "./list-views/localty-list/locality-list.component";
import {LocalityComponent} from "./locality/locality.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {DistributorListComponent} from "./list-views/distributor-list/distributor-list.component";
import {SupervisorListComponent} from "./list-views/supervisor-list/supervisor-list.component";
import {CreateButtonComponent} from "./buttons/create-button/create-button.component";
import {UpdateButtonComponent} from "./buttons/update-button/update-button.component";
import {MainDashboardComponent} from "./dashboards/supervisor-dashboard/main-dashboard.component";
import {AccountComponent} from "./account/account.component";
import {NgModule} from "@angular/core";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
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
    GridloadDashboardChartComponent,
    ClockComponent,
    TownhallDashboardComponent,
    BuildingDashboardComponent,
    SideBarComponent,
    FactoryDashboardComponent,
    SliderComponent,
    BorderBlockComponent,
    ChartBarHorizontalComponent,
    ChartPieComponent,
    ChartBarVerticalComponent,
    InfoComponent,
    IncomeComponent,
    TownhallCardComponent,
    TaxesComponent,
    SolarPanelsComponent,
    CampaignsComponent,
    CampaignsCardComponent,
    CampaignTypeCardComponent,
    BuildingViewComponent,
    DaytimeWeatherComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
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
    GridloadDashboardChartComponent,
    ClockComponent,
    TownhallDashboardComponent,
    BuildingDashboardComponent,
    SideBarComponent,
    FactoryDashboardComponent,
    SliderComponent,
    BorderBlockComponent,
    ChartBarHorizontalComponent,
    ChartPieComponent,
    ChartBarVerticalComponent,
    InfoComponent,
    IncomeComponent,
    TownhallCardComponent,
    TaxesComponent,
    SolarPanelsComponent,
    CampaignsComponent,
    CampaignsCardComponent,
    CampaignTypeCardComponent,
    BuildingViewComponent,
    DaytimeWeatherComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
  ]
})
export class SharedModule { }
