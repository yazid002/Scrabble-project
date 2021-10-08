import { TestBed } from '@angular/core/testing';

import { RackSelectionService } from './rack-selection.service';

describe('RackSelectionService', () => {
  let service: RackSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RackSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
