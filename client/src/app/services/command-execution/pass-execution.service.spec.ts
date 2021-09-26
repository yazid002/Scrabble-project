import { TestBed } from '@angular/core/testing';
import { PassExecutionService } from './pass-execution.service';

describe('PassExecutionService', () => {
    let service: PassExecutionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PassExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
