import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DaytimeWeatherComponent} from './daytime-weather.component';

describe('DaytimeWeatherComponent', () => {
  let component: DaytimeWeatherComponent;
  let fixture: ComponentFixture<DaytimeWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaytimeWeatherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DaytimeWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
