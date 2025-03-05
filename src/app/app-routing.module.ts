import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./app.component";
import {TownhallDashboardComponent} from "./townhall-dashboard/townhall-dashboard.component";
import {FactoryDashboardComponent} from "./factory-dashboard/factory-dashboard.component";
import {BuildingDashboardComponent} from "./building-dashboard/building-dashboard.component";


const routes: Routes = [
  {path: '', component: AppComponent},
  {path: 'game/townhall', component: TownhallDashboardComponent},
  {path: 'game/factories', component: FactoryDashboardComponent},
  {path: 'game/sources', component: BuildingDashboardComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
