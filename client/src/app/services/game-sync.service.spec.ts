import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { tiles } from '@app/classes/board';
import { Goal } from '@app/classes/goal';
import { ICharacter } from '@app/classes/letter';
import { Player, PLAYER } from '@app/classes/player';
import { GoalType } from '@app/enums/goals-enum';
import { GameState, GameSyncService } from './game-sync.service';
import { GameService } from './game.service';
import { GoalService } from './goal.service';
import { GridService } from './grid.service';
import { PlaceSelectionService } from './place-selection.service';

interface GridServiceMock {
    drawGrid(): void;
}

describe('GameSyncService', () => {
    let service: GameSyncService;
    let placeSelectionServiceSpy: jasmine.SpyObj<PlaceSelectionService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let goalServiceSpy: jasmine.SpyObj<GoalService>;
    beforeEach(() => {
        const gridServiceMock: GridServiceMock = {
            drawGrid: (): void => {
                return;
            },
        };
        goalServiceSpy = jasmine.createSpyObj('GoalService', ['initialize']);
        const dummyGoal: Goal = {
            description: 'a description',
            bonus: 3,
            complete: false,
            goalType: GoalType.WritePalindromeWord,
            usesWord: true,
        };
        goalServiceSpy.publicGoals = [dummyGoal, dummyGoal];
        goalServiceSpy.privateGoals = [dummyGoal, dummyGoal];
        placeSelectionServiceSpy = jasmine.createSpyObj('PlaceSelectionService', ['cancelPlacement']);
        placeSelectionServiceSpy.cancelPlacement.and.returnValue(undefined);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['initPlayers']);
        gameServiceSpy.currentTurn = 0;
        const aCharacter: ICharacter = {
            name: 'A',
            quantity: 3,
            points: 1,
            display: 'A',
        };
        const playerDummy: Player = {
            name: 'a name',
            turnWithoutSkipAndExchangeCounter: 2,
            id: 1,
            rack: [aCharacter, aCharacter, aCharacter, aCharacter, aCharacter, aCharacter, aCharacter],
            points: 4,
            placeInTenSecondsGoalCounter: 3,
            words: ['allo', 'aa', 'bonjour'],
            wordsMapping: new Map([['allo', 3]]),
        };
        gameServiceSpy.players = [playerDummy, playerDummy];
        gameServiceSpy.skipCounter = 2;

        TestBed.configureTestingModule({
            providers: [
                { provide: GridService, useValue: gridServiceMock },
                { provide: PlaceSelectionService, useValue: placeSelectionServiceSpy },
                { provide: GoalService, useValue: goalServiceSpy },
            ],
            imports: [HttpClientModule, BrowserAnimationsModule],
        }).compileComponents();
        service = TestBed.inject(GameSyncService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should send gameData to server if the game is in multiplayer mode', () => {
        const spy = spyOn(service, 'sendToServer');
        // eslint-disable-next-line dot-notation
        service['gameService'].otherPlayerSignal.next('multiplayer');
        expect(spy).toHaveBeenCalled();
    });
    it("should send its data back to the server when 'receiveFormServer' is called and game has never been synced before", () => {
        // eslint-disable-next-line dot-notation
        service['alreadySynced'] = false;
        const spy = spyOn(service, 'sendToServer');

        // eslint-disable-next-line dot-notation
        service.receiveFromServer(service['getGameState']());
        expect(spy).toHaveBeenCalled();
    });

    it("should sync only goals with the master's goals when receiving from server if it is the first time", () => {
        const gameState: GameState = {
            dictionaryName: 'a name',
            players: [],
            alphabetReserve: [],
            currentTurn: 0,
            skipCounter: 0,
            timer: 0,
            grid: tiles,
            publicGoals: [],
            privateGoals: [],
        };

        // eslint-disable-next-line dot-notation
        service['alreadySynced'] = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setGoalsFromGameStateSpy = spyOn<any>(service, 'setGoalsFromGameState').and.returnValue(void '');

        service.receiveFromServer(gameState);
        expect(setGoalsFromGameStateSpy).toHaveBeenCalledTimes(1);
    });

    it("should not sync the master's goals when receiving from server if it is the first time", () => {
        const gameState: GameState = {
            dictionaryName: 'a name',
            players: [],
            alphabetReserve: [],
            currentTurn: 1,
            skipCounter: 0,
            timer: 0,
            grid: tiles,
            publicGoals: [],
            privateGoals: [],
        };

        // eslint-disable-next-line dot-notation
        service['alreadySynced'] = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setGoalsFromGameStateSpy = spyOn<any>(service, 'setGoalsFromGameState').and.returnValue(void '');

        service.receiveFromServer(gameState);
        expect(setGoalsFromGameStateSpy).not.toHaveBeenCalled();
    });

    it("should also sync goals master's goals when receiving from server if it is not the first time", () => {
        const gameState: GameState = {
            dictionaryName: 'a name',
            players: [],
            alphabetReserve: [],
            currentTurn: 0,
            skipCounter: 0,
            timer: 0,
            grid: tiles,
            publicGoals: [],
            privateGoals: [],
        };

        // eslint-disable-next-line dot-notation
        service['alreadySynced'] = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setGoalsFromGameStateSpy = spyOn<any>(service, 'setGoalsFromGameState').and.returnValue(void '');

        service.receiveFromServer(gameState);
        expect(setGoalsFromGameStateSpy).toHaveBeenCalledTimes(2);
    });

    it('setGoalsFromGameState should set well goals from game state', () => {
        const gameState: GameState = {
            dictionaryName: 'a name',
            players: [],
            alphabetReserve: [],
            currentTurn: 0,
            skipCounter: 0,
            timer: 0,
            grid: tiles,
            publicGoals: [{ description: 'first goal game state', goalType: 0, bonus: 10, usesWord: true, complete: true }],
            privateGoals: [
                { description: 'first goal game state', goalType: 0, bonus: 10, usesWord: true, complete: true },
                { description: 'second goal game state', goalType: 1, bonus: 15, usesWord: true, complete: true },
            ],
        };

        // eslint-disable-next-line dot-notation
        service['goalService'].privateGoals = [
            { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: true },
            { description: 'second goal', goalType: 1, bonus: 15, usesWord: true, complete: true },
        ];

        // eslint-disable-next-line dot-notation
        service['goalService'].publicGoals = [{ description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: true }];

        // eslint-disable-next-line dot-notation
        service['setGoalsFromGameState'](gameState);

        // eslint-disable-next-line dot-notation
        expect(service['goalService'].publicGoals).toEqual(gameState.publicGoals);
        // eslint-disable-next-line dot-notation
        expect(service['goalService'].privateGoals[PLAYER.realPlayer]).toEqual(gameState.privateGoals[PLAYER.otherPlayer]);
        // eslint-disable-next-line dot-notation
        expect(service['goalService'].privateGoals[PLAYER.otherPlayer]).toEqual(gameState.privateGoals[PLAYER.realPlayer]);
    });

    it("should emit 'sendGameStateSignal' when method 'sendToSerever' is called", () => {
        const spy = spyOn(service.sendGameStateSignal, 'next');
        service.sendToServer();
        expect(spy).toHaveBeenCalled();
    });

    it("should get out of method 'initialize()' id service has already been initialized", () => {
        // eslint-disable-next-line dot-notation
        service['alreadyInitialized'] = true;
        // eslint-disable-next-line dot-notation
        service['alreadySynced'] = true; // if method executes, 'alreadySynced' is set to false.
        service.initialize();
        // eslint-disable-next-line dot-notation
        expect(service['alreadySynced']).toBe(true);
    });

    it('should not send gameData back to server when receiving data from server if the game has already been synced once', () => {
        // eslint-disable-next-line dot-notation
        service['alreadySynced'] = true;
        const spy = spyOn(service, 'sendToServer');
        // eslint-disable-next-line dot-notation
        service.receiveFromServer(service['getGameState']());
        expect(spy).not.toHaveBeenCalled();
    });

    it('reset should return the right reset values', () => {
        const initialReserve = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
        ];

        // eslint-disable-next-line dot-notation
        const getInitialReserveSpy = spyOn(service['reserveService'], 'getInitialReserve').and.returnValue(initialReserve);

        const result = service.reset();

        expect(getInitialReserveSpy).toHaveBeenCalled();

        expect(result.timer).toEqual(0);
        expect(result.skipCounter).toEqual(0);
        expect(result.currentTurn).toEqual(0);
        expect(result.players).toEqual([]);
        expect(result.privateGoals).toEqual([]);
        expect(result.publicGoals).toEqual([]);
        expect(result.alphabetReserve).toEqual(initialReserve);
    });

    it('receiveResetConfig set game parameters with the reset values', () => {
        const resetGame: GameState = {
            dictionaryName: 'a name',
            players: [],
            alphabetReserve: [],
            currentTurn: 0,
            skipCounter: 0,
            timer: 0,
            grid: tiles,
            publicGoals: [],
            privateGoals: [],
        };

        // eslint-disable-next-line dot-notation
        service['goalService'].privateGoals = [
            { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: true },
            { description: 'second goal', goalType: 1, bonus: 15, usesWord: true, complete: true },
        ];

        // eslint-disable-next-line dot-notation
        service['goalService'].publicGoals = [{ description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: true }];

        const resetSpy = spyOn(service, 'reset').and.returnValue(resetGame);

        service.receiveResetConfig();
        expect(resetSpy).toHaveBeenCalled();
        // eslint-disable-next-line dot-notation
        expect(service['goalService'].publicGoals).toEqual([]);
        // eslint-disable-next-line dot-notation
        expect(service['goalService'].privateGoals).toEqual([]);
        // eslint-disable-next-line dot-notation
        expect(service['goalService'].privateGoals).toEqual([]);
    });
});
