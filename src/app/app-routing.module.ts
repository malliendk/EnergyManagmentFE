import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AccountComponent} from "./account/account.component";
import {LocalityComponent} from "./locality/locality.component";
import {SupervisorComponent} from "./supervisor/supervisor.component";
import {DistributorComponent} from "./distributor/distributor.component";
import {DistributorDetailComponent} from "./detail-views/distributor-detail/distributor-detail.component";
import {SupervisorDetailComponent} from "./detail-views/supervisor-detail/supervisor-detail.component";
import {LocalityDetailComponent} from "./detail-views/locality-detail/locality-detail.component";
import {GameModeSelectComponent} from "./game-mode-select/game-mode-select.component";
import {AppComponent} from "./app.component";
import {GameInterfaceComponent} from "./game-interface/game-interface.component";
import {TownhallDashboardComponent} from "./townhall-dashboard/townhall-dashboard.component";
import {FactoryDashboardComponent} from "./factory-dashboard/factory-dashboard.component";


const routes: Routes = [
  {path: 'game', component: GameInterfaceComponent},
  {path: 'game/townhall', component: TownhallDashboardComponent},
  {path: 'game/factories', component: FactoryDashboardComponent},
  {path: 'game-mode-select', component: GameModeSelectComponent},
  {path: 'distributor', component: DistributorComponent},
  {path: 'distributor/:id', component: DistributorDetailComponent},
  {path: 'supervisor', component: SupervisorComponent},
  {path: 'supervisor/:id', component: SupervisorDetailComponent},
  {path: 'locality', component: LocalityComponent},
  {path: 'locality/:id', component: LocalityDetailComponent},
  {path: 'account', component: AccountComponent},

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
