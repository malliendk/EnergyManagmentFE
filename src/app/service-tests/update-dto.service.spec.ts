import { TestBed } from '@angular/core/testing';

import { UpdateDTOService } from '../services/update-dto.service';

describe('UpdateDTOService', () => {
  let service: UpdateDTOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateDTOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
