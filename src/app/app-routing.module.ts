import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {AccountComponent} from "./account/account.component";
import {SupervisorDashboardComponent} from "./dashboards/supervisor-dashboard/supervisor-dashboard.component";


const routes: Routes = [
  {path: '', component: AccountComponent},
  {path: 'dashboard', component: SupervisorDashboardComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
