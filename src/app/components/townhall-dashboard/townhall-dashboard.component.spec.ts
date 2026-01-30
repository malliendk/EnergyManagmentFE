import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TownhallDashboardComponent} from './townhall-dashboard.component';

describe('TownhallDashboardComponent', () => {
  let component: TownhallDashboardComponent;
  let fixture: ComponentFixture<TownhallDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TownhallDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TownhallDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
