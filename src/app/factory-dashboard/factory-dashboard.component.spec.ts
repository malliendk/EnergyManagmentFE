import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryDashboardComponent } from './factory-dashboard.component';

describe('FactoryDashboardComponent', () => {
  let component: FactoryDashboardComponent;
  let fixture: ComponentFixture<FactoryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactoryDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
