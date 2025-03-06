import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GridloadDashboardComponent} from './gridload-dashboard.component';

describe('GridloadDashboardComponent', () => {
  let component: GridloadDashboardComponent;
  let fixture: ComponentFixture<GridloadDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridloadDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridloadDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
