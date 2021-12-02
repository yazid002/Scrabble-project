/* eslint-disable max-lines */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Goal } from '@app/classes/goal';
import { PLAYER, Player } from '@app/classes/player';
import { BehaviorSubject } from 'rxjs';
import { GameService } from './game.service';
import { GoalService } from './goal.service';
import { GoalsManagerService } from './goals-manager.service';
import { TimerService } from './timer.service';
import { UserSettingsService } from './user-settings.service';

describe('GoalsManagerService', () => {
    let service: GoalsManagerService;
    let goalServiceSpy: jasmine.SpyObj<GoalService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let timerServiceSpy: jasmine.SpyObj<TimerService>;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
    beforeEach(() => {
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries']);
        userSettingsServiceSpy.getDictionaries.and.callFake(() => undefined);
        goalServiceSpy = jasmine.createSpyObj('GoalService', [
            'getProgress',
            'completeGoalSound',
            'incrementPlayerCounters',
            'processWordsArrayInMap',
        ]);
        timerServiceSpy = jasmine.createSpyObj('TimerService', ['decrementTime']);
        timerServiceSpy.resetTurnCounter = new BehaviorSubject<boolean | Player>(true);
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
                wordsMapping: new Map<string, number>(),
                words: [],
            },
        ];

        TestBed.configureTestingModule({
            providers: [
                { provide: GoalService, useValue: goalServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: TimerService, useValue: timerServiceSpy },
            ],
            imports: [HttpClientTestingModule, NoopAnimationsModule],
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

        // applyPrivateGoalsBonus is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyPrivateGoalsBonusSpy = spyOn<any>(service, 'applyPrivateGoalsBonus').and.callThrough();

        // applyPublicGoalsBonus is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyPublicGoalsBonusSpy = spyOn<any>(service, 'applyPublicGoalsBonus').and.callThrough();

        service.applyAllGoalsBonus(wordsFormed, gameServiceSpy.players[gameServiceSpy.currentTurn]);
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
        // applyPrivateGoalsBonus is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyPrivateGoalsBonusSpy = spyOn<any>(service, 'applyPrivateGoalsBonus').and.callThrough();

        // applyPublicGoalsBonus is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyPublicGoalsBonusSpy = spyOn<any>(service, 'applyPublicGoalsBonus').and.callThrough();

        service.applyAllGoalsBonus(wordsFormed, gameServiceSpy.players[gameServiceSpy.currentTurn]);

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

        // checkFormedWordRespectGoals is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkFormedWordRespectGoalsSpy = spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // applyPrivateGoalsBonus is private
        // eslint-disable-next-line dot-notation
        service['applyPrivateGoalsBonus'](wordsFormed, gameServiceSpy.players[gameServiceSpy.currentTurn]);

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

        // checkFormedWordRespectGoals is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkFormedWordRespectGoalsSpy = spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // applyPublicGoalsBonus is private
        // eslint-disable-next-line dot-notation
        service['applyPublicGoalsBonus'](wordsFormed, gameServiceSpy.players[gameServiceSpy.currentTurn]);

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

        // checkFormedWordRespectGoals is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // applyPublicGoalsBonus is private
        // eslint-disable-next-line dot-notation
        service['applyPublicGoalsBonus'](wordsFormed, gameServiceSpy.players[gameServiceSpy.currentTurn]);

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

        // checkFormedWordRespectGoals is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // applyPrivateGoalsBonus is private
        // eslint-disable-next-line dot-notation
        service['applyPrivateGoalsBonus'](wordsFormed, gameServiceSpy.players[gameServiceSpy.currentTurn]);

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

        // checkFormedWordRespectGoals is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // applyPrivateGoalsBonus is private
        // eslint-disable-next-line dot-notation
        service['applyPrivateGoalsBonus'](wordsFormed, gameServiceSpy.players[gameServiceSpy.currentTurn]);

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

        // checkFormedWordRespectGoals is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // applyPrivateGoalsBonus is private
        // eslint-disable-next-line dot-notation
        service['applyPrivateGoalsBonus'](wordsFormed, gameServiceSpy.players[gameServiceSpy.currentTurn]);

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

        // checkFormedWordRespectGoals is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'checkFormedWordRespectGoals').and.callThrough();

        // applyPrivateGoalsBonus is private
        // eslint-disable-next-line dot-notation
        service['applyPrivateGoalsBonus'](wordsFormed, gameServiceSpy.players[gameServiceSpy.currentTurn]);

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
    it("setWordsFormedNumber should add the words if there are not in the player's wordsMapping", () => {
        gameServiceSpy.players[gameServiceSpy.currentTurn].wordsMapping = new Map<string, number>([
            ['manger', 1],
            ['finir', 2],
        ]);
        const wordsFormed = ['dame', 'pain'];
        service.setWordsFormedNumber(gameServiceSpy.players[gameServiceSpy.currentTurn], wordsFormed);

        expect(gameServiceSpy.players[gameServiceSpy.currentTurn].wordsMapping.has('dame')).toEqual(true);
        expect(gameServiceSpy.players[gameServiceSpy.currentTurn].wordsMapping.has('pain')).toEqual(true);
    });

    it('setWordsFormedNumber should restore the map and add the wordsMapping if it is not a Map instance', () => {
        // Necessary to test the case where the wordsMapping is not a Map instance
        // This case happens sometimes when sending and receiving from the server
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gameServiceSpy.players[gameServiceSpy.currentTurn].wordsMapping = {} as unknown as any;
        const wordsFormed = ['dame', 'pain'];
        goalServiceSpy.processWordsArrayInMap.and.returnValue(new Map<string, number>());
        service.setWordsFormedNumber(gameServiceSpy.players[gameServiceSpy.currentTurn], wordsFormed);

        expect(goalServiceSpy.processWordsArrayInMap).toHaveBeenCalled();
    });

    it("setWordsFormedNumber should add increment the words corresponding value if there are already in the player's wordsMapping", () => {
        gameServiceSpy.players[gameServiceSpy.currentTurn].wordsMapping = new Map<string, number>([
            ['manger', 1],
            ['finir', 2],
        ]);
        const wordsFormed = ['manger', 'finir'];
        service.setWordsFormedNumber(gameServiceSpy.players[gameServiceSpy.currentTurn], wordsFormed);
        const firstExpectedResult = 2;
        const secondExpectedResult = 3;

        expect(gameServiceSpy.players[gameServiceSpy.currentTurn].wordsMapping.get('manger')).toEqual(firstExpectedResult);
        expect(gameServiceSpy.players[gameServiceSpy.currentTurn].wordsMapping.get('finir')).toEqual(secondExpectedResult);
    });

    it('getUpdatedProgress should return the min value if the goal is undefined', () => {
        const result = service.getUpdatedProgress(undefined as unknown as Goal, gameServiceSpy.players[gameServiceSpy.currentTurn]);
        const expectedResult = 0;

        expect(result).toEqual(expectedResult);
    });

    it('getUpdatedProgress should calculate the progression if the goal is not completed', () => {
        const goal = { description: 'first goal', goalType: 0, bonus: 10, usesWord: false, complete: false };
        service.getUpdatedProgress(goal, gameServiceSpy.players[gameServiceSpy.currentTurn]);
        expect(goalServiceSpy.getProgress).toHaveBeenCalledTimes(1);
    });

    it('getUpdatedProgress should  return the max value if the goal is completed by us', () => {
        const expectedResult = 100;
        const goal: Goal = {
            description: 'first goal',
            goalType: 0,
            bonus: 10,
            usesWord: true,
            complete: true,
            completedBy: gameServiceSpy.players[gameServiceSpy.currentTurn],
        };
        const result = service.getUpdatedProgress(goal, gameServiceSpy.players[gameServiceSpy.currentTurn]);
        expect(goalServiceSpy.getProgress).not.toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
    });

    it('getUpdatedProgress should reinitialize value if the goal is completed by another player', () => {
        const playerThatCompletedGoal = {
            id: PLAYER.otherPlayer,
            name: 'playerThatCompletedGoal name',
            rack: [],
            points: 0,
            turnWithoutSkipAndExchangeCounter: 0,
            placeInTenSecondsGoalCounter: 3,
            wordsMapping: new Map<string, number>(),
            words: [],
        };
        const expectedResult = 0;
        const goal: Goal = {
            description: 'first goal',
            goalType: 0,
            bonus: 10,
            usesWord: false,
            complete: true,
            completedBy: playerThatCompletedGoal,
        };
        const result = service.getUpdatedProgress(goal, gameServiceSpy.players[gameServiceSpy.currentTurn]);
        expect(goalServiceSpy.getProgress).not.toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
    });

    it('getUpdatedProgress should return 0 if the goal is completed by unknown', () => {
        const expectedResult = 0;
        const goal: Goal = {
            description: 'first goal',
            goalType: 0,
            bonus: 10,
            usesWord: false,
            complete: true,
            completedBy: undefined,
        };
        const result = service.getUpdatedProgress(goal, gameServiceSpy.players[gameServiceSpy.currentTurn]);
        expect(goalServiceSpy.getProgress).not.toHaveBeenCalled();
        expect(result).toEqual(expectedResult);
    });
});
