import { TestBed } from '@angular/core/testing';

import { RackLettersManipulationService } from './rack-letters-manipulation.service';

describe('RackLettersManipulationService', () => {
  let service: RackLettersManipulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RackLettersManipulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
