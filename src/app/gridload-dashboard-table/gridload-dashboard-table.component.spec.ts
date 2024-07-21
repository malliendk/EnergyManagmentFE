import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridloadDashboardTableComponent } from './gridload-dashboard-table.component';

describe('GridloadDahsboardTableComponent', () => {
  let component: GridloadDashboardTableComponent;
  let fixture: ComponentFixture<GridloadDashboardTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridloadDashboardTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridloadDashboardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
