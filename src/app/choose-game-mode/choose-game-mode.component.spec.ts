import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChooseGameModeComponent} from './choose-game-mode.component';

describe('ChooseGameModeComponent', () => {
  let component: ChooseGameModeComponent;
  let fixture: ComponentFixture<ChooseGameModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseGameModeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseGameModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
