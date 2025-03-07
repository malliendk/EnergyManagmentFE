import { TestBed } from '@angular/core/testing';

import { DayWeatherService } from '../services/day-weather.service';

describe('DayWeatherService', () => {
  let service: DayWeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DayWeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
