import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RequirementComponent } from './requirement/requirement.component';
import { StoryComponent } from './story/story.component';
import { ScenarioComponent } from './scenario/scenario.component';
import { RequirementsComponent } from './requirements/requirements.component';
import { CreateRequirementComponent } from './create-requirement/create-requirement.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import { ScenariosComponent } from './scenarios/scenarios.component';
import { CreateScenarioComponent } from './create-scenario/create-scenario.component';
import { StoriesComponent } from './stories/stories.component';
import { CreateStoryComponent } from './create-story/create-story.component';

@NgModule({
  declarations: [
    AppComponent,
    RequirementComponent,
    StoryComponent,
    ScenarioComponent,
    RequirementsComponent,
    CreateRequirementComponent,
    ScenariosComponent,
    CreateScenarioComponent,
    StoriesComponent,
    CreateStoryComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
