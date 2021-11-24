/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { Goal } from '@app/classes/goal';
import { PLAYER, Player } from '@app/classes/player';
import { GoalType } from '@app/enums/goals-enum';
import { GoalService } from './goal.service';
import { SoundManagerService } from './sound-manager.service';
import { TimerService } from './timer.service';

describe('GoalService', () => {
    let service: GoalService;
    let timerServiceSpy: TimerService;
    let player: Player;
    let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;

    beforeEach(() => {
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playGoalAchievementAudio']);
        timerServiceSpy = jasmine.createSpyObj('TimerService', ['decrementTime']);
        timerServiceSpy.counter = {
            min: 0,
            seconds: 0,
            resetValue: 0,
            totalTimer: 0,
        };

        TestBed.configureTestingModule({
            providers: [
                { provide: TimerService, useValue: timerServiceSpy },
                { provide: SoundManagerService, useValue: soundManagerServiceSpy },
            ],
        });
        service = TestBed.inject(GoalService);
        const dictionary = {
            title: 'dictionnaire test',
            description: 'description de test',
            words: ['aa', 'finir', 'manger', 'rouler', 'kilos', 'jartera'],
        } as Dictionary;
        // dictionary is private
        // eslint-disable-next-line dot-notation
        service['dictionary'] = dictionary;

        player = {
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
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('generateRandomWord should return a word with a length between 5 and 7 from the dictionary', () => {
        const max = 7;
        const min = 5;
        // generateRandomWord is private
        // eslint-disable-next-line dot-notation
        const result = service['generateRandomWord']();

        // dictionary is private
        // eslint-disable-next-line dot-notation
        expect(service['dictionary'].words).toContain(result);
        expect(result.length).toBeGreaterThanOrEqual(min);
        expect(result.length).toBeLessThanOrEqual(max);
    });

    it('generateRandomWord should call generateNumber', () => {
        // generateNumber is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const generateNumberSpy = spyOn<any>(service, 'generateNumber').and.callThrough();

        // generateRandomWord is private
        // eslint-disable-next-line dot-notation
        service['generateRandomWord']();

        expect(generateNumberSpy).toHaveBeenCalled();
    });

    it('playTheRandomWord should return true', () => {
        // randomWord is private
        // eslint-disable-next-line dot-notation
        service['randomWord'] = 'finir';

        player.wordsMapping = new Map<string, number>([
            ['manger', 1],
            ['finir', 1],
        ]);

        // playTheRandomWord is private
        // eslint-disable-next-line dot-notation
        const result = service.goalsFunctions[GoalType.PlayTheRandomWord](player);

        expect(result).toEqual(true);
    });

    it('playTheRandomWord should return false', () => {
        // randomWord is private
        // eslint-disable-next-line dot-notation
        service['randomWord'] = 'finir';

        player.wordsMapping = new Map<string, number>([
            ['manger', 1],
            ['kilos', 1],
        ]);

        const result = service.goalsFunctions[GoalType.PlayTheRandomWord](player);

        expect(result).toEqual(false);
    });

    it('playTheSameWordThreeTimes should return true', () => {
        player.wordsMapping = new Map<string, number>([
            ['manger', 3],
            ['kilos', 1],
            ['finir', 1],
        ]);

        const result = service.goalsFunctions[GoalType.PlayTheSameWordThreeTimes](player);

        expect(result).toEqual(true);
    });

    it('playTheSameWordThreeTimes should return false', () => {
        player.wordsMapping = new Map<string, number>([
            ['manger', 2],
            ['kilos', 1],
            ['finir', 2],
        ]);

        const result = service.goalsFunctions[GoalType.PlayTheSameWordThreeTimes](player);

        expect(result).toEqual(false);
    });

    it('playFiveTimesWithoutSkipAndExchange should return true', () => {
        const numberOfTurnsToWin = 5;

        player.turnWithoutSkipAndExchangeCounter = numberOfTurnsToWin;

        const result = service.goalsFunctions[GoalType.PlayFiveTimesWithoutSkipAndExchange](player);

        expect(result).toEqual(true);
    });

    it('playFiveTimesWithoutSkipAndExchange should return false', () => {
        const numberOfTurns = 3;

        player.turnWithoutSkipAndExchangeCounter = numberOfTurns;

        const result = service.goalsFunctions[GoalType.PlayFiveTimesWithoutSkipAndExchange](player);

        expect(result).toEqual(false);
    });

    it('placeInTenSecondsGoal should return false', () => {
        const numberOfTurns = 1;

        player.placeInTenSecondsGoalCounter = numberOfTurns;

        timerServiceSpy.counter.totalTimer = 20;

        const result = service.goalsFunctions[GoalType.PlayInTenSeconds](player);

        expect(result).toEqual(false);
    });

    it('placeInTenSecondsGoal should return true', () => {
        const numberOfTurns = 3;

        player.placeInTenSecondsGoalCounter = numberOfTurns;

        timerServiceSpy.counter.totalTimer = 10;

        const result = service.goalsFunctions[GoalType.PlayInTenSeconds](player);

        expect(result).toEqual(true);
        expect(player.placeInTenSecondsGoalCounter).toEqual(0);
    });

    it('generateUniqueIndex should call generateNumber one time', () => {
        const min = 0;
        const max = 5;

        // car usedIndex is private
        // eslint-disable-next-line dot-notation
        service['usedIndex'] = [];

        // generateNumber is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const generateNumberSpy = spyOn<any>(service, 'generateNumber').and.callThrough();

        // generateRandomWord is private
        // eslint-disable-next-line dot-notation
        service['generateUniqueIndex'](min, max);

        expect(generateNumberSpy).toHaveBeenCalledTimes(1);
    });

    it('generateUniqueIndex should return a number that is not in the usedIndex ', () => {
        const min = 0;
        const max = 5;

        // car usedIndex is private
        // eslint-disable-next-line dot-notation
        service['usedIndex'] = [min, min + 1, min + 2, max - 2, max];

        // generateNumber is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'generateNumber').and.callThrough();

        // generateRandomWord is private
        // eslint-disable-next-line dot-notation
        const result = service['generateUniqueIndex'](min, max);

        expect(result).toEqual(max - 1);
    });

    it('doesWordContainConsecutiveConsonant should return true', () => {
        const wordToCheck = 'obscure';

        const result = service.goalsFunctions[GoalType.WriteWordContainingConsecutiveConsonants](wordToCheck);

        expect(result).toEqual(true);
    });

    it('doesWordContainConsecutiveConsonant should return false', () => {
        const wordToCheck = 'finir';

        const result = service.goalsFunctions[GoalType.WriteWordContainingConsecutiveConsonants](wordToCheck);

        expect(result).toEqual(false);
    });

    it('isWordLengthEqualToFifteen should return false', () => {
        const wordToCheck = 'finir';

        const result = service.goalsFunctions[GoalType.WriteWordLengthEqualToFifteen](wordToCheck);

        expect(result).toEqual(false);
    });

    it('isWordLengthEqualToFifteen should return false', () => {
        const wordToCheck = 'abasourdissante';

        const result = service.goalsFunctions[GoalType.WriteWordLengthEqualToFifteen](wordToCheck);

        expect(result).toEqual(true);
    });

    it('doesWordContainQWithoutU should return false', () => {
        const wordToCheck = 'abasourdissante';

        const result = service.goalsFunctions[GoalType.WriteWordContainingQwithoutU](wordToCheck);

        expect(result).toEqual(false);
    });

    it('doesWordContainQWithoutU should return false if word contains q but followed by u', () => {
        const wordToCheck = 'que';

        const result = service.goalsFunctions[GoalType.WriteWordContainingQwithoutU](wordToCheck);

        expect(result).toEqual(false);
    });

    it('doesWordContainQWithoutU should return false if word contains 2 q but 1 is followed by u', () => {
        const wordToCheck = 'queqe';

        const result = service.goalsFunctions[GoalType.WriteWordContainingQwithoutU](wordToCheck);

        expect(result).toEqual(false);
    });

    it('doesWordContainQWithoutU should return true', () => {
        const wordToCheck = 'qat';

        const result = service.goalsFunctions[GoalType.WriteWordContainingQwithoutU](wordToCheck);

        expect(result).toEqual(true);
    });

    it('doesWordContainQWithoutU should return true if the word is finished by a q', () => {
        const wordToCheck = 'coq';

        const result = service.goalsFunctions[GoalType.WriteWordContainingQwithoutU](wordToCheck);

        expect(result).toEqual(true);
    });

    it('isWordPalindrome should return true if the word is a palindrome', () => {
        const wordToCheck = 'ete';

        const result = service.goalsFunctions[GoalType.WritePalindromeWord](wordToCheck);

        expect(result).toEqual(true);
    });

    it('isWordPalindrome should return false if the word is not a palindrome', () => {
        const wordToCheck = 'etait';

        const result = service.goalsFunctions[GoalType.WritePalindromeWord](wordToCheck);

        expect(result).toEqual(false);
    });

    it('getAUniqueGoal should return a goal which index is not in the usedIndex from goalHandler ', () => {
        // car usedIndex is private
        // eslint-disable-next-line dot-notation
        service['usedIndex'] = [
            GoalType.WritePalindromeWord,
            GoalType.WriteWordContainingQwithoutU,
            GoalType.WriteWordLengthEqualToFifteen,
            GoalType.PlayInTenSeconds,
            GoalType.PlayFiveTimesWithoutSkipAndExchange,
            GoalType.PlayTheSameWordThreeTimes,
            GoalType.PlayTheRandomWord,
        ];

        const result = service.getAUniqueGoal();
        const expectedResult = service.goalHandler[GoalType.WriteWordContainingConsecutiveConsonants];

        expect(result).toEqual(expectedResult);
    });
    it('completeGoalSound should play an audio', () => {
        soundManagerServiceSpy.playGoalAchievementAudio.and.returnValue(void '');
        service.completeGoalSound();
        expect(soundManagerServiceSpy.playGoalAchievementAudio).toHaveBeenCalled();
    });

    describe('getProgress', () => {
        it('should call getGoalUsingWordProgress', () => {
            const goal: Goal = { description: 'first goal', goalType: GoalType.WritePalindromeWord, bonus: 10, usesWord: true, complete: false };
            // getGoalUsingWordProgress is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const getGoalUsingWordProgressSpy = spyOn<any>(service, 'getGoalUsingWordProgress').and.returnValue(true);

            service.getProgress(goal, player);
            expect(getGoalUsingWordProgressSpy).toHaveBeenCalled();

            goal.goalType = GoalType.WriteWordContainingConsecutiveConsonants;
            service.getProgress(goal, player);
            expect(getGoalUsingWordProgressSpy).toHaveBeenCalled();

            goal.goalType = GoalType.WriteWordContainingQwithoutU;
            service.getProgress(goal, player);
            expect(getGoalUsingWordProgressSpy).toHaveBeenCalled();

            goal.goalType = GoalType.WriteWordLengthEqualToFifteen;
            service.getProgress(goal, player);
            expect(getGoalUsingWordProgressSpy).toHaveBeenCalled();

            goal.goalType = GoalType.PlayTheRandomWord;
            service.getProgress(goal, player);
            expect(getGoalUsingWordProgressSpy).toHaveBeenCalled();
        });

        it('should call getPlayInTenSecondsGoalProgress', () => {
            const goal: Goal = { description: 'first goal', goalType: GoalType.PlayInTenSeconds, bonus: 10, usesWord: true, complete: false };
            // getPlayInTenSecondsGoalProgress is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const getPlayInTenSecondsGoalProgressSpy = spyOn<any>(service, 'getPlayInTenSecondsGoalProgress').and.returnValue(true);

            service.getProgress(goal, player);
            expect(getPlayInTenSecondsGoalProgressSpy).toHaveBeenCalled();
        });

        it('should call getPlayFiveTimesWithoutSkipAndExchange', () => {
            const goal: Goal = {
                description: 'first goal',
                goalType: GoalType.PlayFiveTimesWithoutSkipAndExchange,
                bonus: 10,
                usesWord: true,
                complete: false,
            };
            // getPlayInTenSecondsGoalProgress is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const getPlayFiveTimesWithoutSkipAndExchangeSpy = spyOn<any>(service, 'getPlayFiveTimesWithoutSkipAndExchange').and.returnValue(true);

            service.getProgress(goal, player);
            expect(getPlayFiveTimesWithoutSkipAndExchangeSpy).toHaveBeenCalled();
        });

        it('should call getPlayTheSameWordThreeTimesProgress', () => {
            const goal: Goal = {
                description: 'first goal',
                goalType: GoalType.PlayTheSameWordThreeTimes,
                bonus: 10,
                usesWord: true,
                complete: false,
            };
            // getPlayTheSameWordThreeTimesProgress is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const getPlayTheSameWordThreeTimesProgressSpy = spyOn<any>(service, 'getPlayTheSameWordThreeTimesProgress').and.returnValue(true);

            service.getProgress(goal, player);
            expect(getPlayTheSameWordThreeTimesProgressSpy).toHaveBeenCalled();
        });
    });

    it('incrementPlayerCounters should call incrementTurnWithoutSkipAndExchangeCounter and incrementPlaceInTenSecondsGoalCounter', () => {
        // incrementTurnWithoutSkipAndExchangeCounter is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const incrementTurnWithoutSkipAndExchangeCounterSpy = spyOn<any>(service, 'incrementTurnWithoutSkipAndExchangeCounter').and.returnValue(
            void '',
        );

        // setPlaceInTenSecondsGoalCounter is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const setPlaceInTenSecondsGoalCounterSpy = spyOn<any>(service, 'setPlaceInTenSecondsGoalCounter').and.returnValue(void '');

        service.incrementPlayerCounters(player);
        expect(incrementTurnWithoutSkipAndExchangeCounterSpy).toHaveBeenCalled();
        expect(setPlaceInTenSecondsGoalCounterSpy).toHaveBeenCalled();
    });

    it('incrementTurnWithoutSkipAndExchangeCounter should call increment with a step of 1 the player TurnWithoutSkipAndExchangeCounter', () => {
        player.turnWithoutSkipAndExchangeCounter = 0;
        // incrementTurnWithoutSkipAndExchangeCounter is private
        // eslint-disable-next-line dot-notation
        service['incrementTurnWithoutSkipAndExchangeCounter'](player);
        expect(player.turnWithoutSkipAndExchangeCounter).toEqual(1);
    });

    it('incrementTurnWithoutSkipAndExchangeCounter should call increment with a step of 1 the player TurnWithoutSkipAndExchangeCounter', () => {
        player.turnWithoutSkipAndExchangeCounter = 0;
        // incrementTurnWithoutSkipAndExchangeCounter is private
        // eslint-disable-next-line dot-notation
        service['incrementTurnWithoutSkipAndExchangeCounter'](player);
        expect(player.turnWithoutSkipAndExchangeCounter).toEqual(1);
    });

    it('setPlaceInTenSecondsGoalCounter should increment the player placeInTenSecondsGoalCounter if the time is less than or equal to 10', () => {
        player.placeInTenSecondsGoalCounter = 0;
        timerServiceSpy.counter.totalTimer = 3;
        // setPlaceInTenSecondsGoalCounter is private
        // eslint-disable-next-line dot-notation
        service['setPlaceInTenSecondsGoalCounter'](player);
        expect(player.placeInTenSecondsGoalCounter).toEqual(1);
    });

    it('setPlaceInTenSecondsGoalCounter should reset the player placeInTenSecondsGoalCounter if the time is greater than 10', () => {
        const timePassed = 11;
        player.placeInTenSecondsGoalCounter = 2;
        timerServiceSpy.counter.totalTimer = timePassed;
        // setPlaceInTenSecondsGoalCounter is private
        // eslint-disable-next-line dot-notation
        service['setPlaceInTenSecondsGoalCounter'](player);
        expect(player.placeInTenSecondsGoalCounter).toEqual(0);
    });

    it('getPlayInTenSecondsGoalProgress should calculate the progress with the player counter if the goal is not completed', () => {
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: false,
        };
        const counter = 1;
        const expectedResult = counter / 3.0;
        player.placeInTenSecondsGoalCounter = counter;
        // getPlayInTenSecondsGoalProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['getPlayInTenSecondsGoalProgress'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('getPlayInTenSecondsGoalProgress should calculate the progress with the player counter if the goal is completed by not by the player', () => {
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
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: true,
            completedBy: playerThatCompletedGoal,
        };
        const counter = 2;
        const expectedResult = counter / 3.0;
        player.placeInTenSecondsGoalCounter = counter;
        // getPlayInTenSecondsGoalProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['getPlayInTenSecondsGoalProgress'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('getPlayInTenSecondsGoalProgress should return 1 if the player is the one who completed the goal', () => {
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: true,
            completedBy: player,
        };
        const counter = 2;
        const expectedResult = 1;
        player.placeInTenSecondsGoalCounter = counter;
        // getPlayInTenSecondsGoalProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['getPlayInTenSecondsGoalProgress'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('getPlayFiveTimesWithoutSkipAndExchange should return 1 if the player is the one who completed the goal', () => {
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: true,
            completedBy: player,
        };
        const counter = 2;
        const expectedResult = 1;
        player.turnWithoutSkipAndExchangeCounter = counter;
        // getPlayFiveTimesWithoutSkipAndExchange is private
        // eslint-disable-next-line dot-notation
        const result = service['getPlayFiveTimesWithoutSkipAndExchange'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('getPlayFiveTimesWithoutSkipAndExchange should calculate the progress with the player counter if the goal is not completed', () => {
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: false,
        };
        const counter = 2;
        const maxValue = 5.0;
        const expectedResult = counter / maxValue;
        player.turnWithoutSkipAndExchangeCounter = counter;
        // getPlayFiveTimesWithoutSkipAndExchange is private
        // eslint-disable-next-line dot-notation
        const result = service['getPlayFiveTimesWithoutSkipAndExchange'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it(
        'getPlayFiveTimesWithoutSkipAndExchange should calculate the progress with the player ' +
            'counter if the goal is completed by not by the player',
        () => {
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
            const goal: Goal = {
                description: 'first goal',
                goalType: GoalType.PlayInTenSeconds,
                bonus: 10,
                usesWord: false,
                complete: true,
                completedBy: playerThatCompletedGoal,
            };
            const counter = 2;
            const maxValue = 5.0;
            const expectedResult = counter / maxValue;
            player.turnWithoutSkipAndExchangeCounter = counter;
            // getPlayFiveTimesWithoutSkipAndExchange is private
            // eslint-disable-next-line dot-notation
            const result = service['getPlayFiveTimesWithoutSkipAndExchange'](goal, player);
            expect(result).toEqual(expectedResult);
        },
    );

    it('getGoalUsingWordProgress should return 1 if the player is the one who completed the goal', () => {
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: true,
            completedBy: player,
        };
        const expectedResult = 1;
        // getGoalUsingWordProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['getGoalUsingWordProgress'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('getGoalUsingWordProgress should return 0 if the player is the goal is not completed', () => {
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: false,
        };
        const expectedResult = 0;
        // getGoalUsingWordProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['getGoalUsingWordProgress'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('getGoalUsingWordProgress should return 0 if the goal is completed by not by the player', () => {
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
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: true,
            completedBy: playerThatCompletedGoal,
        };
        const expectedResult = 0;
        // getGoalUsingWordProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['getGoalUsingWordProgress'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('getPlayTheSameWordThreeTimesProgress should return 0 if the player did not place any word', () => {
        player.wordsMapping = new Map<string, number>();
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: false,
        };
        const expectedResult = 0;
        // getPlayTheSameWordThreeTimesProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['getPlayTheSameWordThreeTimesProgress'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('getPlayTheSameWordThreeTimesProgress should return 0 if the player wordsMapping is undefined', () => {
        player.wordsMapping = undefined as unknown as Map<string, number>;
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: false,
        };
        const expectedResult = 0;
        // getPlayTheSameWordThreeTimesProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['getPlayTheSameWordThreeTimesProgress'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('getPlayTheSameWordThreeTimesProgress should return 1 if the player completed the goal', () => {
        player.wordsMapping = new Map<string, number>([
            ['manger', 1],
            ['finir', 2],
        ]);
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: true,
            completedBy: player,
        };
        const expectedResult = 1;
        // getPlayTheSameWordThreeTimesProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['getPlayTheSameWordThreeTimesProgress'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('getPlayTheSameWordThreeTimesProgress should return 1/max value if the player placed each word only one time', () => {
        player.wordsMapping = new Map<string, number>([
            ['manger', 1],
            ['finir', 1],
        ]);
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: false,
        };
        const maxValue = 3.0;
        const expectedResult = 1 / maxValue;
        // getPlayTheSameWordThreeTimesProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['getPlayTheSameWordThreeTimesProgress'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('getPlayTheSameWordThreeTimesProgress should return 2/max value if the player placed at least one word two times', () => {
        player.wordsMapping = new Map<string, number>([
            ['manger', 1],
            ['finir', 2],
        ]);
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: false,
        };
        const maxValue = 3.0;
        const expectedResult = 2 / maxValue;
        // getPlayTheSameWordThreeTimesProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['getPlayTheSameWordThreeTimesProgress'](goal, player);
        expect(result).toEqual(expectedResult);
    });

    it('processWordsArrayInMap should return a map containing all the words in the array', () => {
        const arrayTest = ['manger', 'lier', 'lier'];
        const expectedResult = new Map<string, number>([
            ['manger', 1],
            ['lier', 2],
        ]);

        // getPlayTheSameWordThreeTimesProgress is private
        // eslint-disable-next-line dot-notation
        const result = service['processWordsArrayInMap'](arrayTest);
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expectedResult));
    });
});
