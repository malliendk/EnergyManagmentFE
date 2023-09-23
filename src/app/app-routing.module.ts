import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RequirementsComponent} from "./requirements/requirements.component";
import {CreateRequirementComponent} from "./create-requirement/create-requirement.component";
import {RequirementComponent} from "./requirement/requirement.component";
import {ScenariosComponent} from "./scenarios/scenarios.component";
import {StoryComponent} from "./story/story.component";
import {StoriesComponent} from "./stories/stories.component";
import {ScenarioComponent} from "./scenario/scenario.component";
import {CreateScenarioComponent} from "./create-scenario/create-scenario.component";
import {CreateStoryComponent} from "./create-story/create-story.component";

const routes: Routes = [
  {path: '', component: RequirementsComponent},
  {path: 'requirements', component: RequirementsComponent},
  {path: 'scenarioRequirements/create', component: CreateRequirementComponent},
  {path: 'scenarioRequirements/:id', component: RequirementComponent},
  {path: 'scenarios', component: ScenariosComponent},
  {path: 'scenarios/create', component: CreateScenarioComponent},
  {path: 'scenarios/:id', component: ScenarioComponent},
  {path: 'stories', component: StoriesComponent},
  {path: 'stories/create', component: CreateStoryComponent},
  {path: 'stories/name/:storyName', component: StoryComponent},
  {path: 'stories/:id', component: StoryComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
