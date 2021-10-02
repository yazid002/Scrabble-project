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
    describe('execute', () => {
        it(' should return the initial result if no error was threw', () => {
            const result = service.execute();

            expect(result.body).toEqual('Vous avez passé votre tour !');
        });
    });
});
