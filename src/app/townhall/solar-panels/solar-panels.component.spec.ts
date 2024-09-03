import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarPanelsComponent } from './solar-panels.component';

describe('BuySolarPanelsComponent', () => {
  let component: SolarPanelsComponent;
  let fixture: ComponentFixture<SolarPanelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolarPanelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
