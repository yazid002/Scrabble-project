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
    

});
