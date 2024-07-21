import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadsourceDashboardComponent } from './loadsource-dashboard.component';

describe('LoadsourceListComponent', () => {
  let component: LoadsourceDashboardComponent;
  let fixture: ComponentFixture<LoadsourceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadsourceDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadsourceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
