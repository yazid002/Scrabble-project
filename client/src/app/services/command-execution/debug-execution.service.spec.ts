import { TestBed } from '@angular/core/testing';

import { DebugExecutionService } from './debug-execution.service';

describe('DebugExecutionService', () => {
    let service: DebugExecutionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DebugExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
