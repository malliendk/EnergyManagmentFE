import {Component, OnInit} from '@angular/core';
import {Story} from "../story";
import {StoryService} from "../story.service";

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit{

  stories : Story[] = []

  constructor(private storyService: StoryService) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  private findAll() {
    this.storyService.findAll()
      .subscribe(stories => this.stories = stories)
  }
}
