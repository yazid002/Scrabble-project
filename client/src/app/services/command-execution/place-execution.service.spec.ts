import { TestBed } from '@angular/core/testing';
import { PlaceExecutionService } from './place-execution.service';

describe('PlaceExecuteService', () => {
    let service: PlaceExecutionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlaceExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
