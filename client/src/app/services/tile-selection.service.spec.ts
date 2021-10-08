import { TestBed } from '@angular/core/testing';

import { TileSelectionService } from './tile-selection.service';

describe('TileSelectionService', () => {
  let service: TileSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
