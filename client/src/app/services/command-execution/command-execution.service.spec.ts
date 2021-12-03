import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { IChat } from '@app/classes/chat';
import { GameService } from '@app/services/game.service';
import { AideExecutionService } from './aide-execution.service';
import { CommandExecutionService } from './command-execution.service';
import { DebugExecutionService } from './debug-execution.service';
import { ExchangeExecutionService } from './exchange-execution.service';
import { PassExecutionService } from './pass-execution.service';
import { PlaceExecutionService } from './place-execution.service';
import { ReserveExecutionService } from './reserve-execution.service';
const message: IChat = { from: 'ME', body: 'a message' };
describe('CommandExecutionService', () => {
    let service: CommandExecutionService;
    let debugServiceSpy: jasmine.SpyObj<DebugExecutionService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let reserveExecutionServiceSpy: jasmine.SpyObj<ReserveExecutionService>;
    let passExecutionServiceSpy: jasmine.SpyObj<PassExecutionService>;
    let exchangeExecutionServiceSpy: jasmine.SpyObj<ExchangeExecutionService>;
    let aideExecutionServiceSpy: jasmine.SpyObj<AideExecutionService>;
    let debugExecutionServiceSpy: jasmine.SpyObj<DebugExecutionService>;
    let placeExecutionServiceSpy: jasmine.SpyObj<PlaceExecutionService>;
    beforeEach(() => {
        passExecutionServiceSpy = jasmine.createSpyObj('PassExecutionService', ['execute']);
        passExecutionServiceSpy.execute.and.callFake(() => message);

        exchangeExecutionServiceSpy = jasmine.createSpyObj('ExchangeExecutionService', ['execute']);
        exchangeExecutionServiceSpy.execute.and.callFake(() => message);

        aideExecutionServiceSpy = jasmine.createSpyObj('AideExecutionService', ['execute']);
        aideExecutionServiceSpy.execute.and.callFake(() => message);
        debugExecutionServiceSpy = jasmine.createSpyObj('DebugExecutionService', ['execute']);
        debugExecutionServiceSpy.execute.and.callFake(() => message);
        reserveExecutionServiceSpy = jasmine.createSpyObj('ReserveExecutionService', ['execute']);
        reserveExecutionServiceSpy.execute.and.callFake(() => message);
        placeExecutionServiceSpy = jasmine.createSpyObj('PlaceExecutionService', ['execute']);
        placeExecutionServiceSpy.execute.and.resolveTo(message);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['initPlayers']);
        gameServiceSpy.currentTurn = 1;
        debugServiceSpy = jasmine.createSpyObj('DebugExecutionService', ['execute']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DebugExecutionService, useValue: debugServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: PassExecutionService, useValue: passExecutionServiceSpy },
                { provide: ExchangeExecutionService, useValue: exchangeExecutionServiceSpy },
                { provide: AideExecutionService, useValue: aideExecutionServiceSpy },
                { provide: DebugExecutionService, useValue: debugExecutionServiceSpy },
                { provide: ReserveExecutionService, useValue: reserveExecutionServiceSpy },
                { provide: PlaceExecutionService, useValue: placeExecutionServiceSpy },
            ],
            imports: [HttpClientModule],
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
        const response: { error: boolean; message: IChat } = await service.executeCommand(command, true);
        expect(response).toBeDefined();
    });
    it('should return error = true with a description is not allowed to make this command', async () => {
        debugServiceSpy.state = false;
        const result = await service.interpretCommand('!reserve');

        expect(result.error).toBeTrue();
        expect((await result.function()).body).toEqual('<strong>debug</strong> doit être activé');
    });

    it('should return an IChat object when executeCommand() is called with a valid command', async () => {
        interface IChat {
            from: string;
            body: string;
        }
        const command = '!aide';
        const response: { error: boolean; message: IChat } = await service.executeCommand(command, true);
        expect(response).toBeDefined();
    });
});
