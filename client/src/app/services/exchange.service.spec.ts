import { TestBed } from '@angular/core/testing';
import { InexistentLettersOnRack } from '@app/classes/command-errors/command-syntax-errors/inexistent-letters-on-rack';
import { InvalidArgumentsLength } from '@app/classes/command-errors/command-syntax-errors/invalid-argument-length';
import { NotEnoughOccurrences } from '@app/classes/command-errors/command-syntax-errors/not-enough-occurrences';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { ExchangeService } from './exchange.service';
import { GameService, REAL_PLAYER } from './game.service';
import { RackService } from './rack.service';

describe('ExchangeService', () => {
    let service: ExchangeService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;

    beforeEach(() => {
        gameServiceSpy = jasmine.createSpyObj('GameService', ['initializePlayers', 'changeTurn']);
        gameServiceSpy.currentTurn = REAL_PLAYER;
        gameServiceSpy.players = [
            {
                id: REAL_PLAYER,
                name: 'Random name',
                rack: [
                    { name: 'A', quantity: 9, points: 1, affiche: 'A' },
                    { name: 'B', quantity: 2, points: 3, affiche: 'B' },
                    { name: 'C', quantity: 2, points: 3, affiche: 'C' },
                    { name: 'D', quantity: 3, points: 2, affiche: 'D' },
                    { name: 'E', quantity: 15, points: 1, affiche: 'E' },
                ],
                points: 0,
            },
        ];

        rackServiceSpy = jasmine.createSpyObj('RackService', [
            'replaceLetter',
            'findLetterPosition',
            'countLetterOccurrences',
            'checkLettersAvailability',
            'findInexistentLettersOnRack',
        ]);
        rackServiceSpy.gameService = gameServiceSpy;
        TestBed.configureTestingModule({
            providers: [
                { provide: RackService, useValue: rackServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
            ],
        });
        service = TestBed.inject(ExchangeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('validateLetterOccurrencesMatch should call countLetterOccurrences of rackServiceSpy', () => {
        const letterToChange = 'B';
        const lettersToChange = ['B', 'U', 'D'];

        // eslint-disable-next-line dot-notation
        service['validateLetterOccurrencesMatch'](letterToChange, lettersToChange);

        expect(rackServiceSpy.countLetterOccurrences).toHaveBeenCalled();
    });

    it('validateLetterOccurrencesMatch should return true if the letterToChange has same or less occurrence number in command and on rack', () => {
        const letterToChange = 'B';
        const lettersToChange = ['B', 'D'];
        rackServiceSpy.gameService.players[0].rack = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            { name: 'E', quantity: 15, points: 1, affiche: 'E' },
        ];
        const rackLettersToStrings = ['A', 'B', 'B', 'D', 'E'];
        rackServiceSpy.countLetterOccurrences
            .withArgs(letterToChange, lettersToChange)
            .and.returnValue(1)
            .withArgs(letterToChange, rackLettersToStrings)
            .and.returnValue(2);

        // eslint-disable-next-line dot-notation
        const result = service['validateLetterOccurrencesMatch'](letterToChange, lettersToChange);

        expect(result).toBeTrue();
    });

    it('validateLetterOccurrencesMatch should return false if the letterToChange has more occurrence number in command and on rack', () => {
        const letterToChange = 'B';
        const lettersToChange = ['B', 'B', 'D'];
        rackServiceSpy.gameService.players[0].rack = [
            { name: 'A', quantity: 1, points: 3, affiche: 'A' },
            { name: 'B', quantity: 1, points: 3, affiche: 'B' },
            { name: 'C', quantity: 1, points: 3, affiche: 'C' },
            { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            { name: 'E', quantity: 15, points: 1, affiche: 'E' },
        ];
        const rackLettersToStrings = ['A', 'B', 'C', 'D', 'E'];
        rackServiceSpy.countLetterOccurrences
            .withArgs(letterToChange, lettersToChange)
            .and.returnValue(2)
            .withArgs(letterToChange, rackLettersToStrings)
            .and.returnValue(1);

        // eslint-disable-next-line dot-notation
        const result = service['validateLetterOccurrencesMatch'](letterToChange, lettersToChange);

        expect(result).toBeFalse();
    });

    it('validateArgumentLength should return true if there is more than min and less than max', () => {
        const lettersToChange = ['B', 'U', 'D'];
        const min = 1;
        const max = 7;
        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const validateArgumentLengthSpy = spyOn<any>(service, 'validateArgumentLength').and.returnValue(true);

        // eslint-disable-next-line dot-notation
        const result = service['validateArgumentLength'](lettersToChange, min, max);

        expect(result).toBeTrue();
    });

    it('validateArgumentLength should return true if there is min lettersToChange', () => {
        const lettersToChange = ['B'];
        const min = 1;
        const max = 7;
        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const validateArgumentLengthSpy = spyOn<any>(service, 'validateArgumentLength').and.returnValue(true);

        // eslint-disable-next-line dot-notation
        const result = service['validateArgumentLength'](lettersToChange, min, max);

        expect(result).toBeTrue();
    });

    it('validateArgumentLength should return true if there is max lettersToChange', () => {
        const lettersToChange = ['B', 'U', 'D', 'C'];
        const min = 1;
        const max = 4;

        // eslint-disable-next-line dot-notation
        const result = service['validateArgumentLength'](lettersToChange, min, max);

        expect(result).toBeTrue();
    });

    it('validateArgumentLength should return false if there is less than min lettersToChange', () => {
        const lettersToChange: string[] = [];
        const min = 1;
        const max = 7;

        // eslint-disable-next-line dot-notation
        const result = service['validateArgumentLength'](lettersToChange, min, max);

        expect(result).toBeFalse();
    });

    it('validateArgumentLength should return false if there is more then max lettersToChange', () => {
        const lettersToChange: string[] = ['B', 'U', 'D', 'C', 'T'];
        const min = 1;
        const max = 4;

        // eslint-disable-next-line dot-notation
        const result = service['validateArgumentLength'](lettersToChange, min, max);

        expect(result).toBeFalse();
    });

    it('findIncoherentOccurrencesMatch should return all lettersToChange that occurrences are not same on the rack without duplicates', () => {
        const lettersToChange: string[] = ['B', 'B', 'U', 'D'];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validateLetterOccurrencesMatchSpy = spyOn<any>(service, 'validateLetterOccurrencesMatch')
            .withArgs(lettersToChange[0], lettersToChange)
            .and.returnValue(false)
            .withArgs(lettersToChange[1], lettersToChange)
            .and.returnValue(false)
            .withArgs(lettersToChange[2], lettersToChange)
            .and.returnValue(true)
            .withArgs(lettersToChange[3], lettersToChange)
            .and.returnValue(false);

        const expectedResult = ['B', 'D'];

        // eslint-disable-next-line dot-notation
        const result = service['findIncoherentOccurrencesMatch'](lettersToChange);

        expect(validateLetterOccurrencesMatchSpy).toHaveBeenCalledTimes(lettersToChange.length);
        expect(result).toEqual(expectedResult);
    });

    it('exchangeLetters should call replaceLetter of rackServiceSpy on each letter to change', () => {
        const lettersToChange = ['B', 'D'];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validateExchangeFeasibilitySpy = spyOn<any>(service, 'validateExchangeFeasibility').and.returnValue(void '');

        service.exchangeLetters(lettersToChange);

        expect(validateExchangeFeasibilitySpy).toHaveBeenCalled();
        expect(rackServiceSpy.replaceLetter).toHaveBeenCalledTimes(lettersToChange.length);
    });

    it('validateExchangeFeasibility should throw ImpossibleCommand', () => {
        const lettersToChange = ['B', 'D'];

        rackServiceSpy.checkLettersAvailability.and.returnValue(false);

        // eslint-disable-next-line dot-notation
        expect(() => service['validateExchangeFeasibility'](lettersToChange)).toThrow(
            new ImpossibleCommand("Il n'y a plus assez de lettres dans la réserve."),
        );
    });

    it('validateExchangeFeasibility should throw InvalidArgumentsLength', () => {
        const lettersToChange = ['B', 'D'];

        rackServiceSpy.checkLettersAvailability.and.returnValue(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validateArgumentLengthSpy = spyOn<any>(service, 'validateArgumentLength').and.returnValue(false);

        // eslint-disable-next-line dot-notation
        expect(() => service['validateExchangeFeasibility'](lettersToChange)).toThrow(new InvalidArgumentsLength(''));
        expect(validateArgumentLengthSpy).toHaveBeenCalled();
    });

    it('validateExchangeFeasibility should throw InexistentLettersOnRack', () => {
        const lettersToChange = ['B', 'D', 'C'];
        const inexistentLettersOnRack = ['B', 'D'];

        rackServiceSpy.checkLettersAvailability.and.returnValue(true);
        rackServiceSpy.findInexistentLettersOnRack.and.returnValue(inexistentLettersOnRack);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'validateArgumentLength').and.returnValue(true);

        // eslint-disable-next-line dot-notation
        expect(() => service['validateExchangeFeasibility'](lettersToChange)).toThrow(
            new InexistentLettersOnRack(`${inexistentLettersOnRack.join(', ')}.`),
        );
        expect(rackServiceSpy.findInexistentLettersOnRack).toHaveBeenCalled();
    });

    it('validateExchangeFeasibility should throw NotEnoughOccurrences', () => {
        const lettersToChange = ['B', 'D', 'C'];
        const incoherentOccurrences = ['B', 'D'];

        rackServiceSpy.checkLettersAvailability.and.returnValue(true);
        rackServiceSpy.findInexistentLettersOnRack.and.returnValue([]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'validateArgumentLength').and.returnValue(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const findIncoherentOccurrencesMatchSpy = spyOn<any>(service, 'findIncoherentOccurrencesMatch').and.returnValue(incoherentOccurrences);

        // eslint-disable-next-line dot-notation
        expect(() => service['validateExchangeFeasibility'](lettersToChange)).toThrow(
            new NotEnoughOccurrences(`${incoherentOccurrences.join(', ')} à échanger.`),
        );
        expect(findIncoherentOccurrencesMatchSpy).toHaveBeenCalled();
    });

    it('validateExchangeFeasibility should return void', () => {
        const lettersToChange = ['B', 'D', 'C'];

        rackServiceSpy.checkLettersAvailability.and.returnValue(true);
        rackServiceSpy.findInexistentLettersOnRack.and.returnValue([]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'validateArgumentLength').and.returnValue(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'findIncoherentOccurrencesMatch').and.returnValue([]);

        // eslint-disable-next-line dot-notation
        const result = service['validateExchangeFeasibility'](lettersToChange);

        expect(result).toEqual(void '');
    });
});
