import { TestBed } from '@angular/core/testing';

import { ExchangeExecutionService } from './exchange-execution.service';

describe('ExchangeExecutionService', () => {
  let service: ExchangeExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExchangeExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
