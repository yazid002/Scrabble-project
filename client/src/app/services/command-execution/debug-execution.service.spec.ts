import { TestBed } from '@angular/core/testing';
import { IChat } from '@app/classes/chat';
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

    describe('execute', () => {
        it(' should return an IChat interface', () => {
            service.state = false;
            let result: IChat = service.execute();

            expect(result.body).toEqual('affichages de débogage activés');

            service.state = true;
            result = service.execute();
            expect(result.body).toEqual('affichages de débogage désactivés');
        });
    });
});
