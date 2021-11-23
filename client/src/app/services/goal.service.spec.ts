/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { PLAYER, Player } from '@app/classes/player';
import { GoalType } from '@app/enums/goals-enum';
import { GoalService } from './goal.service';
import { TimerService } from './timer.service';

describe('GoalService', () => {
    let service: GoalService;
    let timerServiceSpy: TimerService;
    let player: Player;

    beforeEach(() => {
        timerServiceSpy = jasmine.createSpyObj('TimerService', ['decrementTime']);
        timerServiceSpy.counter = {
            min: 0,
            seconds: 0,
            resetValue: 0,
            totalTimer: 0,
        };

        TestBed.configureTestingModule({ providers: [{ provide: TimerService, useValue: timerServiceSpy }] });
        service = TestBed.inject(GoalService);
        const dictionary = {
            title: 'dictionnaire test',
            description: 'description de test',
            words: ['aa', 'finir', 'manger', 'rouler', 'kilos', 'jartera'],
        } as Dictionary;
        // dictionary est privée
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
            words: [],
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('generateRandomWord should return a word with a length between 5 and 7 from the dictionary', () => {
        const max = 7;
        const min = 5;
        // Car generateRandomWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['generateRandomWord']();

        // Car dictionary est privée
        // eslint-disable-next-line dot-notation
        expect(service['dictionary'].words).toContain(result);
        expect(result.length).toBeGreaterThanOrEqual(min);
        expect(result.length).toBeLessThanOrEqual(max);
    });

    it('generateRandomWord should call generateNumber', () => {
        // Car generateNumber est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const generateNumberSpy = spyOn<any>(service, 'generateNumber').and.callThrough();

        // Car generateRandomWord est privée
        // eslint-disable-next-line dot-notation
        service['generateRandomWord']();

        expect(generateNumberSpy).toHaveBeenCalled();
    });

    it('playTheRandomWord should return true', () => {
        // Car randomWord est privée
        // eslint-disable-next-line dot-notation
        service['randomWord'] = 'finir';

        player.words = ['manger', 'finir'];

        // Car playTheRandomWord est privée
        // eslint-disable-next-line dot-notation
        const result = service.goalsFunctions[GoalType.PlayTheRandomWord](player);

        expect(result).toEqual(true);
    });

    it('playTheRandomWord should return false', () => {
        // Car randomWord est privée
        // eslint-disable-next-line dot-notation
        service['randomWord'] = 'finir';

        player.words = ['manger', 'kilos'];

        const result = service.goalsFunctions[GoalType.PlayTheRandomWord](player);

        expect(result).toEqual(false);
    });

    it('playTheSameWordThreeTimes should return true', () => {
        player.words = ['manger', 'kilos', 'manger', 'finir', 'manger'];

        const result = service.goalsFunctions[GoalType.PlayTheSameWordThreeTimes](player);

        expect(result).toEqual(true);
    });

    it('playTheSameWordThreeTimes should return false', () => {
        player.words = ['manger', 'kilos', 'manger', 'finir', 'kilos'];

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
        expect(player.placeInTenSecondsGoalCounter).toEqual(0);
    });

    it('placeInTenSecondsGoal should return false but increment the counter', () => {
        const numberOfTurns = 1;

        player.placeInTenSecondsGoalCounter = numberOfTurns;

        timerServiceSpy.counter.totalTimer = 10;

        const result = service.goalsFunctions[GoalType.PlayInTenSeconds](player);

        expect(result).toEqual(false);
        expect(player.placeInTenSecondsGoalCounter).toEqual(numberOfTurns + 1);
    });

    it('placeInTenSecondsGoal should return true', () => {
        const numberOfTurns = 2;

        player.placeInTenSecondsGoalCounter = numberOfTurns;

        timerServiceSpy.counter.totalTimer = 10;

        const result = service.goalsFunctions[GoalType.PlayInTenSeconds](player);

        expect(result).toEqual(true);
        expect(player.placeInTenSecondsGoalCounter).toEqual(0);
    });

    it('generateUniqueIndex should call generateNumber one time', () => {
        const min = 0;
        const max = 5;

        // car usedIndex est privée
        // eslint-disable-next-line dot-notation
        service['usedIndex'] = [];

        // Car generateNumber est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const generateNumberSpy = spyOn<any>(service, 'generateNumber').and.callThrough();

        // Car generateRandomWord est privée
        // eslint-disable-next-line dot-notation
        service['generateUniqueIndex'](min, max);

        expect(generateNumberSpy).toHaveBeenCalledTimes(1);
    });

    it('generateUniqueIndex should return a number that is not in the usedIndex ', () => {
        const min = 0;
        const max = 5;

        // car usedIndex est privée
        // eslint-disable-next-line dot-notation
        service['usedIndex'] = [min, min + 1, min + 2, max - 2, max];

        // Car generateNumber est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'generateNumber').and.callThrough();

        // Car generateRandomWord est privée
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
        // car usedIndex est privée
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
        const anAudio: HTMLAudioElement = {
            src: 'une source',
            load: () => void '',
            play: async () => Promise.resolve(void ''),
            addEventListener: () => void '',
        } as unknown as HTMLAudioElement;

        const audioSpy = spyOn(global, 'Audio').and.returnValue(anAudio);

        const loadSpy = spyOn(anAudio, 'load').and.returnValue(void '');

        const playSpy = spyOn(anAudio, 'play').and.returnValue(Promise.resolve(void ''));

        service.completeGoalSound();
        expect(audioSpy).toHaveBeenCalled();
        expect(loadSpy).toHaveBeenCalled();
        expect(playSpy).toHaveBeenCalled();
    });
});
