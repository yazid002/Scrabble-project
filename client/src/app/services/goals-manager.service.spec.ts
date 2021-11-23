import { TestBed } from '@angular/core/testing';
import { PLAYER, Player } from '@app/classes/player';
import { BehaviorSubject } from 'rxjs';
import { GameService } from './game.service';
import { GoalService } from './goal.service';
import { GoalsManagerService } from './goals-manager.service';
import { TimerService } from './timer.service';

describe('GoalsManagerService', () => {
    let service: GoalsManagerService;
    let goalServiceSpy: GoalService;
    let gameServiceSpy: GameService;
    let timerServiceSpy: TimerService;

    beforeEach(() => {
        goalServiceSpy = jasmine.createSpyObj('GoalService', ['completeGoalSound']);
        timerServiceSpy = jasmine.createSpyObj('TimerService', ['decrementTime']);
        timerServiceSpy.resetTurnCounter = new BehaviorSubject<boolean>(true);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['initializePlayers', 'changeTurn']);
        gameServiceSpy.currentTurn = PLAYER.realPlayer;
        gameServiceSpy.players = [
            {
                id: PLAYER.realPlayer,
                name: 'Random name',
                rack: [
                    { name: 'A', quantity: 9, points: 1, display: 'A' },
                    { name: 'B', quantity: 2, points: 3, display: 'B' },
                    { name: 'C', quantity: 2, points: 3, display: 'C' },
                    { name: 'D', quantity: 3, points: 2, display: 'D' },
                    { name: 'E', quantity: 15, points: 1, display: 'E' },
                ],
                points: 0,
                turnWithoutSkipAndExchangeCounter: 0,
                placeInTenSecondsGoalCounter: 0,
                words: [],
            },
        ];

        TestBed.configureTestingModule({
            providers: [
                { provide: GoalService, useValue: goalServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: TimerService, useValue: timerServiceSpy },
            ],
        });
        service = TestBed.inject(GoalsManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('applyAllGoalsBonus should not apply any goal if it is disabled', () => {
        service.isEnabled = false;
        goalServiceSpy.privateGoals = [];
        goalServiceSpy.publicGoals = [];
        goalServiceSpy.goalsFunctions = [];
        const wordsFormed = ['aa'];

        // Car applyPrivateGoalsBonus est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyPrivateGoalsBonusSpy = spyOn<any>(service, 'applyPrivateGoalsBonus').and.callThrough();

        // Car applyPublicGoalsBonus est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyPublicGoalsBonusSpy = spyOn<any>(service, 'applyPublicGoalsBonus').and.callThrough();

        service.applyAllGoalsBonus(wordsFormed);
        expect(applyPrivateGoalsBonusSpy).not.toHaveBeenCalled();
        expect(applyPublicGoalsBonusSpy).not.toHaveBeenCalled();
    });

    it('applyAllGoalsBonus should apply the private and public goals if it is enabled', () => {
        goalServiceSpy.privateGoals = [{ description: 'first private goal', goalType: 0, bonus: 10, usesWord: true, complete: true }];
        goalServiceSpy.publicGoals = [{ description: 'first public goal', goalType: 1, bonus: 10, usesWord: true, complete: true }];
        goalServiceSpy.goalsFunctions = [
            (word: string | Player) => {
                return (word as string).length === 1;
            },
            (word: string | Player) => {
                return (word as string).length === 2;
            },
        ];
        const wordsFormed = ['aa'];
        service.isEnabled = true;
        // Car applyPrivateGoalsBonus est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyPrivateGoalsBonusSpy = spyOn<any>(service, 'applyPrivateGoalsBonus').and.callThrough();

        // Car applyPublicGoalsBonus est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyPublicGoalsBonusSpy = spyOn<any>(service, 'applyPublicGoalsBonus').and.callThrough();

        service.applyAllGoalsBonus(wordsFormed);

        expect(applyPrivateGoalsBonusSpy).toHaveBeenCalled();
        expect(applyPublicGoalsBonusSpy).toHaveBeenCalled();
    });

    it('applyPrivateGoalsBonus should check if the placement respects the goal', () => {
        service.isEnabled = true;
        goalServiceSpy.privateGoals = [{ description: 'first private goal', goalType: 0, bonus: 10, usesWord: true, complete: false }];
        goalServiceSpy.goalsFunctions = [
            (word: string | Player) => {
                return (word as string).length === 1;
            },
            (word: string | Player) => {
                return (word as string).length === 2;
            },
        ];
        const wordsFormed = ['aa'];

        // Car checkFormedWordRespectGoals est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkFormedWordRespectGoalsSpy = spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // Car applyPrivateGoalsBonus est privée
        // eslint-disable-next-line dot-notation
        service['applyPrivateGoalsBonus'](wordsFormed);

        expect(checkFormedWordRespectGoalsSpy).toHaveBeenCalled();
    });

    it('applyPublicGoalsBonus should check if the placement respects all public goals', () => {
        service.isEnabled = true;
        goalServiceSpy.publicGoals = [
            { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: false },
            { description: 'second goal', goalType: 1, bonus: 20, usesWord: true, complete: false },
        ];
        goalServiceSpy.goalsFunctions = [
            (word: string | Player) => {
                return (word as string).length === 1;
            },
            (word: string | Player) => {
                return (word as string).length === 2;
            },
        ];
        const wordsFormed = ['aa'];

        // Car checkFormedWordRespectGoals est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkFormedWordRespectGoalsSpy = spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // Car applyPublicGoalsBonus est privée
        // eslint-disable-next-line dot-notation
        service['applyPublicGoalsBonus'](wordsFormed);

        expect(checkFormedWordRespectGoalsSpy).toHaveBeenCalledTimes(2);
    });

    it("applyPublicGoalsBonus should apply all respected goals to the player's points", () => {
        service.isEnabled = true;
        goalServiceSpy.publicGoals = [
            { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: false },
            { description: 'second goal', goalType: 1, bonus: 20, usesWord: true, complete: false },
            { description: 'third goal', goalType: 2, bonus: 30, usesWord: true, complete: false },
        ];
        goalServiceSpy.goalsFunctions = [
            (word: string | Player) => {
                return (word as string).length === 1;
            },
            (word: string | Player) => {
                return (word as string).length === 2;
            },
            (word: string | Player) => {
                return (word as string).length >= 1;
            },
        ];
        const wordsFormed = ['aa'];
        const initialPoints = 3;
        const expectedPoints = 53;
        gameServiceSpy.players[gameServiceSpy.currentTurn].points = initialPoints;

        // Car checkFormedWordRespectGoals est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // Car applyPublicGoalsBonus est privée
        // eslint-disable-next-line dot-notation
        service['applyPublicGoalsBonus'](wordsFormed);

        expect(gameServiceSpy.players[gameServiceSpy.currentTurn].points).toEqual(expectedPoints);
    });

    it("applyPrivateGoalsBonus should apply the corresponding goal if respected to the player's points", () => {
        service.isEnabled = true;
        goalServiceSpy.privateGoals = [
            { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: false },
            { description: 'second goal', goalType: 1, bonus: 20, usesWord: true, complete: false },
        ];
        goalServiceSpy.goalsFunctions = [
            (word: string | Player) => {
                return (word as string).length === 2;
            },
            (word: string | Player) => {
                return (word as string).length === 1;
            },
        ];
        const wordsFormed = ['aa'];
        const initialPoints = 3;
        const expectedPoints = 13;
        gameServiceSpy.players[gameServiceSpy.currentTurn].points = initialPoints;

        // Car checkFormedWordRespectGoals est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // Car applyPrivateGoalsBonus est privée
        // eslint-disable-next-line dot-notation
        service['applyPrivateGoalsBonus'](wordsFormed);

        expect(gameServiceSpy.players[gameServiceSpy.currentTurn].points).toEqual(expectedPoints);
    });

    it("applyPrivateGoalsBonus should not apply the corresponding goal if not respected to the player's points", () => {
        service.isEnabled = true;
        goalServiceSpy.privateGoals = [
            { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: false },
            { description: 'second goal', goalType: 1, bonus: 20, usesWord: true, complete: false },
        ];
        goalServiceSpy.goalsFunctions = [
            (word: string | Player) => {
                return (word as string).length === 1;
            },
            (word: string | Player) => {
                return (word as string).length === 2;
            },
        ];
        const wordsFormed = ['aa'];
        const initialPoints = 3;
        const expectedPoints = 3;
        gameServiceSpy.players[gameServiceSpy.currentTurn].points = initialPoints;

        // Car checkFormedWordRespectGoals est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // Car applyPrivateGoalsBonus est privée
        // eslint-disable-next-line dot-notation
        service['applyPrivateGoalsBonus'](wordsFormed);

        expect(gameServiceSpy.players[gameServiceSpy.currentTurn].points).toEqual(expectedPoints);
    });

    it('applyPrivateGoalsBonus should not apply a bonus related to the player', () => {
        service.isEnabled = true;
        goalServiceSpy.privateGoals = [{ description: 'first goal', goalType: 0, bonus: 10, usesWord: false, complete: false }];
        goalServiceSpy.goalsFunctions = [
            (player: string | Player) => {
                return (player as Player).placeInTenSecondsGoalCounter === 1;
            },
        ];
        const wordsFormed = ['aa'];
        const initialPoints = 3;
        const expectedPoints = 13;
        gameServiceSpy.players[gameServiceSpy.currentTurn].points = initialPoints;
        gameServiceSpy.players[gameServiceSpy.currentTurn].placeInTenSecondsGoalCounter = 1;

        // Car checkFormedWordRespectGoals est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // Car applyPrivateGoalsBonus est privée
        // eslint-disable-next-line dot-notation
        service['applyPrivateGoalsBonus'](wordsFormed);

        expect(gameServiceSpy.players[gameServiceSpy.currentTurn].points).toEqual(expectedPoints);
    });

    it('applyPrivateGoalsBonus should not apply a bonus related to the player', () => {
        service.isEnabled = true;
        goalServiceSpy.privateGoals = [{ description: 'first goal', goalType: 0, bonus: 10, usesWord: false, complete: false }];
        goalServiceSpy.goalsFunctions = [
            (player: string | Player) => {
                return (player as Player).placeInTenSecondsGoalCounter === 1;
            },
        ];
        const wordsFormed = ['aa'];
        const initialPoints = 3;
        const expectedPoints = 13;
        gameServiceSpy.players[gameServiceSpy.currentTurn].points = initialPoints;
        gameServiceSpy.players[gameServiceSpy.currentTurn].placeInTenSecondsGoalCounter = 1;

        // Car checkFormedWordRespectGoals est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // Car applyPrivateGoalsBonus est privée
        // eslint-disable-next-line dot-notation
        service['applyPrivateGoalsBonus'](wordsFormed);

        expect(gameServiceSpy.players[gameServiceSpy.currentTurn].points).toEqual(expectedPoints);
    });

    it("should reset the player's turnWithoutSkipAndExchangeCounter and placeInTenSecondsGoalCounter if the time is done without placement", () => {
        gameServiceSpy.players[gameServiceSpy.currentTurn].placeInTenSecondsGoalCounter = 1;
        gameServiceSpy.players[gameServiceSpy.currentTurn].turnWithoutSkipAndExchangeCounter = 1;
        timerServiceSpy.resetTurnCounter.next(true);

        expect(gameServiceSpy.players[gameServiceSpy.currentTurn].turnWithoutSkipAndExchangeCounter).toEqual(0);
        expect(gameServiceSpy.players[gameServiceSpy.currentTurn].placeInTenSecondsGoalCounter).toEqual(0);
    });

    it(
        "should not reset the player's turnWithoutSkipAndExchangeCounter and " +
            'placeInTenSecondsGoalCounter if the time is not done without placement',
        () => {
            gameServiceSpy.players[gameServiceSpy.currentTurn].placeInTenSecondsGoalCounter = 1;
            gameServiceSpy.players[gameServiceSpy.currentTurn].turnWithoutSkipAndExchangeCounter = 1;
            timerServiceSpy.resetTurnCounter.next(false);

            expect(gameServiceSpy.players[gameServiceSpy.currentTurn].turnWithoutSkipAndExchangeCounter).toEqual(1);
            expect(gameServiceSpy.players[gameServiceSpy.currentTurn].placeInTenSecondsGoalCounter).toEqual(1);
        },
    );
});
