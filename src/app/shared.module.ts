import {BuildingViewComponent} from "./building-view/building-view.component";
import {DaytimeWeatherComponent} from "./daytime-weather/daytime-weather.component";
import {BorderBlockComponent} from "./border-block/border-block.component";
import {SliderComponent} from "./slider/slider.component";
import {FactoryDashboardComponent} from "./factory-dashboard/factory-dashboard.component";
import {SideBarComponent} from "./side-bar/side-bar.component";
import {BuildingDashboardComponent} from "./building-dashboard/building-dashboard.component";
import {TownhallDashboardComponent} from "./townhall-dashboard/townhall-dashboard.component";
import {ClockComponent} from "./clock/clock.component";
import {ModalComponent} from "./modal/modal.component";
import {GridloadDashboardComponent} from "./gridload-dashboard/gridload-dashboard.component";
import {ChoiceCreateSupervisorComponent} from "./choice-create-supervisor/choice-create-supervisor.component";
import {NavigateButtonComponent} from "./buttons/navigate-button/navigate-button.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {CreateButtonComponent} from "./buttons/create-button/create-button.component";
import {UpdateButtonComponent} from "./buttons/update-button/update-button.component";
import {NgModule} from "@angular/core";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule, NgOptimizedImage} from "@angular/common";

@NgModule({
  declarations: [
    UpdateButtonComponent,
    CreateButtonComponent,
    NavbarComponent,
    NavigateButtonComponent,
    ChoiceCreateSupervisorComponent,
    GridloadDashboardComponent,
    ModalComponent,
    ClockComponent,
    TownhallDashboardComponent,
    BuildingDashboardComponent,
    SideBarComponent,
    FactoryDashboardComponent,
    SliderComponent,
    BorderBlockComponent,
    BuildingViewComponent,
    DaytimeWeatherComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    UpdateButtonComponent,
    CreateButtonComponent,
    NavbarComponent,
    NavigateButtonComponent,
    ChoiceCreateSupervisorComponent,
    GridloadDashboardComponent,
    ModalComponent,
    ClockComponent,
    TownhallDashboardComponent,
    BuildingDashboardComponent,
    SideBarComponent,
    FactoryDashboardComponent,
    SliderComponent,
    BorderBlockComponent,
    BuildingViewComponent,
    DaytimeWeatherComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    NgOptimizedImage,
  ]
})
export class SharedModule { }
