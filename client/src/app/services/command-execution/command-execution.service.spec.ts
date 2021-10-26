import { TestBed } from '@angular/core/testing';
import { CommandExecutionService } from './command-execution.service';

describe('CommandExecutionService', () => {
    let service: CommandExecutionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommandExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should throw an error if an invalid command is entered', () => {
        const invalidCommand = '!Hello world';
        expect(() => {
            service.interpretCommand(invalidCommand);
        }).toThrowError();

        const validCommand = '!reserve';
        expect(() => {
            service.interpretCommand(validCommand);
        }).not.toThrowError();
    });
    it('should throw an error if a valid command is entered, but with bad parameters', () => {
        const badParams = 'placer d';
        expect(() => {
            service.interpretCommand(badParams);
        }).toThrowError();
    });

    it('should return an IChat object when executeCommand() is called with a valid command', async () => {
        interface IChat {
            from: string;
            body: string;
        }
        const command = '!debug';
        const response: IChat = await service.executeCommand(command, true);
        expect(response).toBeDefined();
    });
});
