import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AccountComponent} from "./entity-components/account/account.component";
import {LocalityComponent} from "./entity-components/locality/locality.component";
import {SupervisorComponent} from "./entity-components/supervisor/supervisor.component";
import {DistributorComponent} from "./entity-components/distributor/distributor.component";
import {DistributorDetailComponent} from "./detail-views/distributor-detail/distributor-detail.component";
import {SupervisorDetailComponent} from "./detail-views/supervisor-detail/supervisor-detail.component";
import {LocalityDetailComponent} from "./detail-views/locality-detail/locality-detail.component";
import {ChooseGameModeComponent} from "./choose-game-mode/choose-game-mode.component";


const routes: Routes = [
  {path: '', component: ChooseGameModeComponent},
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
