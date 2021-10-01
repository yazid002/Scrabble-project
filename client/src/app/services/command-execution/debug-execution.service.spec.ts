import { TestBed } from '@angular/core/testing';
import { DebugExecutionService } from './debug-execution.service';
import { IChat } from '@app/classes/chat';

describe('DebugExecutionService', () => {
    let service: DebugExecutionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DebugExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('execute', () => {
        it(' should return an IChat interface', () => {
            const result: IChat = service.execute();

            expect(result.body).toBeDefined();
        });
    });
});
