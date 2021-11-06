import { TestBed } from '@angular/core/testing';
import { CommandExecutionService } from './command-execution.service';
import { DebugExecutionService } from './debug-execution.service';

describe('CommandExecutionService', () => {
    let service: CommandExecutionService;
    let debugServiceSpy: jasmine.SpyObj<DebugExecutionService>;
    beforeEach(() => {
        debugServiceSpy = jasmine.createSpyObj('DebugExecutionService', ['execute']);
        TestBed.configureTestingModule({
            providers: [{ provide: DebugExecutionService, useValue: debugServiceSpy }],
        });
        service = TestBed.inject(CommandExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should throw an error if an invalid command is entered', () => {
        const invalidCommand = '!Hello world';
        expect(service.interpretCommand(invalidCommand).error).toBeTrue();

        const validCommand = '!debug';
        expect(service.interpretCommand(validCommand).error).toBeFalse();
    });
    it('should throw an error if a valid command is entered, but with bad parameters', () => {
        const badParams = 'placer d';
        expect(service.interpretCommand(badParams).error).toBeTrue();
    });

    it('should return an IChat and boolean object when executeCommand() is called with a valid command', async () => {
        interface IChat {
            from: string;
            body: string;
        }
        const command = '!debug';
        const response: { error: boolean; message: IChat } = await service.executeCommand(command);
        expect(response).toBeDefined();
    });
    it('should return error = true with a descriptionis not allowed to make this command', async () => {
        debugServiceSpy.state = false;
        const result = await service.interpretCommand('!reserve');

        expect(result.error).toBeTrue();
        expect((await result.function()).body).toEqual('<strong>debug</strong> doit être activé');
    });
});
