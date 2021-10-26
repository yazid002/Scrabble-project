import { TestBed } from '@angular/core/testing';

import { SelectionManagerService } from './selection-manager.service';

describe('SelectionManagerService', () => {
  let service: SelectionManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectionManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
