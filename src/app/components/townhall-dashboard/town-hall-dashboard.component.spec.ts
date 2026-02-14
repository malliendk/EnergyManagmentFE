import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TownHallDashboardComponent} from './town-hall-dashboard.component';

describe('TownhallDashboardComponent', () => {
  let component: TownHallDashboardComponent;
  let fixture: ComponentFixture<TownHallDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TownHallDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TownHallDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
