import { TestBed } from '@angular/core/testing';

import { AideExecutionService } from './aide-execution.service';

describe('AideExecutionService', () => {
    let service: AideExecutionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AideExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
