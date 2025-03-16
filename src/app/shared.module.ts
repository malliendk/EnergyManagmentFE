import {BorderBlockComponent} from "./border-block/border-block.component";
import {SliderComponent} from "./slider/slider.component";
import {SideBarComponent} from "./side-bar/side-bar.component";
import {ClockComponent} from "./clock/clock.component";
import {ModalComponent} from "./modal/modal.component";
import {ChoiceCreateSupervisorComponent} from "./choice-create-supervisor/choice-create-supervisor.component";
import {NavigateButtonComponent} from "./buttons/navigate-button/navigate-button.component";
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
    NavigateButtonComponent,
    ChoiceCreateSupervisorComponent,
    ClockComponent,
    SideBarComponent,
    SliderComponent,
    BorderBlockComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    UpdateButtonComponent,
    CreateButtonComponent,
    NavigateButtonComponent,
    ChoiceCreateSupervisorComponent,
    ClockComponent,
    SideBarComponent,
    SliderComponent,
    BorderBlockComponent,
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
