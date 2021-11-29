import { TestBed } from '@angular/core/testing';

import { ValidationDictionaryService } from './validation-dictionary.service';

describe('ValidationDictionaryService', () => {
  let service: ValidationDictionaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationDictionaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
