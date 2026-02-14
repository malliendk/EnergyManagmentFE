import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GamePreparationComponent} from './game-preparation.component';

describe('GamePreparationComponent', () => {
  let component: GamePreparationComponent;
  let fixture: ComponentFixture<GamePreparationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePreparationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePreparationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
