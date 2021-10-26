/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { GameService, REAL_PLAYER } from '@app/services/game.service';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';

describe('RackService', () => {
    let service: RackService;
    let reserveServiceSpy: jasmine.SpyObj<ReserveService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;

    beforeEach(() => {
        reserveServiceSpy = jasmine.createSpyObj('ReserveService', ['getQuantityOfAvailableLetters', 'getLettersFromReserve', 'addLetterInReserve']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['initializePlayers']);
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
        TestBed.configureTestingModule({
            providers: [{ provide: GameService, useValue: gameServiceSpy }],
        });
        // const player: Player =
        // gameServiceSpy.players = [player];
        reserveServiceSpy.alphabets = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 2, points: 3, affiche: 'B' },
            { name: 'C', quantity: 2, points: 3, affiche: 'C' },
            { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            { name: 'E', quantity: 15, points: 1, affiche: 'E' },
            { name: 'F', quantity: 2, points: 4, affiche: 'F' },
            { name: 'G', quantity: 2, points: 4, affiche: 'G' },
            { name: 'H', quantity: 2, points: 4, affiche: 'H' },
        ];
        TestBed.configureTestingModule({ providers: [{ provide: ReserveService, useValue: reserveServiceSpy }] });
        service = TestBed.inject(RackService);

        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.rackContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('isLetterOnRack', () => {
        it('isLetterOnRack should call findLetterPosition', () => {
            const letterToCheck = 'B';
            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const findLetterPositionSpy = spyOn<any>(service, 'findLetterPosition').and.callThrough();

            service.isLetterOnRack(letterToCheck);

            // Car findLetterPosition est privée
            // eslint-disable-next-line dot-notation
            expect(findLetterPositionSpy).toHaveBeenCalled();
        });

        it('should return true', () => {
            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findLetterPosition').and.returnValue(2);
            const letterToCheck = 'B';

            const result = service.isLetterOnRack(letterToCheck);

            expect(result).toBeTrue();
        });

        it('should return false', () => {
            const notFound = -1;
            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findLetterPosition').and.returnValue(notFound);
            const letterToCheck = 'Z';

            const result = service.isLetterOnRack(letterToCheck);

            expect(result).toBeFalse();
        });
    });

    describe('findLetterPosition', () => {
<<<<<<< HEAD
        it('should return NOT_FOUND', () => {
            const NOT_FOUND = -1;
            const LETTER_TO_CHECK = 'Z';
=======
        it('should return notFound', () => {
            const notFound = -1;
            const letterToCheck = 'Z';

>>>>>>> feature/placer-des-lettres
            // Car findLetterPosition est privée
            // eslint-disable-next-line dot-notation
            const result = service['findLetterPosition'](letterToCheck);

            expect(result).toEqual(notFound);
        });

        it('should return the letter position', () => {
            const position = 0;
            const letterToCheck = 'A';

            // Car findLetterPosition est privée
            // eslint-disable-next-line dot-notation
            const result = service['findLetterPosition'](letterToCheck);

            expect(result).toEqual(position);
        });
    });

    it('findInexistentLettersOnRack should return all lettersToChange that are not on the rack', () => {
        const letterToChange: string[] = ['B', 'U', 'D'];

        const isLetterOnRackSpy = spyOn(service, 'isLetterOnRack')
            .withArgs(letterToChange[0])
            .and.returnValue(true)
            .withArgs(letterToChange[1])
            .and.returnValue(false)
            .withArgs(letterToChange[2])
            .and.returnValue(true);

        const expectedResult = ['U'];

        // eslint-disable-next-line dot-notation
        const result = service['findInexistentLettersOnRack'](letterToChange);

        expect(isLetterOnRackSpy).toHaveBeenCalledTimes(letterToChange.length);
        expect(result).toEqual(expectedResult);
    });

    describe('findJokersNumberOnRack', () => {
        it('should return the number of jokers on Rack', () => {
            service.gameService.players[REAL_PLAYER].rack = [
                { name: 'A', quantity: 9, points: 1, affiche: 'A' },
                { name: '*', quantity: 0, points: 0, affiche: '*' },
                { name: '*', quantity: 0, points: 0, affiche: '*' },
                { name: 'D', quantity: 3, points: 2, affiche: 'D' },
                { name: 'E', quantity: 15, points: 1, affiche: 'E' },
            ];
            const expectedResult = 2;

            const result = service.findJokersNumberOnRack();

            expect(result).toEqual(expectedResult);
        });

        it('should return 0 if there is no joker on Rack', () => {
            service.gameService.players[REAL_PLAYER].rack = [
                { name: 'A', quantity: 9, points: 1, affiche: 'A' },
                { name: 'D', quantity: 3, points: 2, affiche: 'D' },
                { name: 'E', quantity: 15, points: 1, affiche: 'E' },
            ];
            const expectedResult = 0;

            const result = service.findJokersNumberOnRack();

            expect(result).toEqual(expectedResult);
        });
    });

    describe('countLetterOccurrences', () => {
        it('should return the number of occurrences of the specified letter in the array of letters', () => {
            const lettersForTest: string[] = ['B', 'B', 'B', 'G'];
            const letterToCheck = 'B';
            const expectedResult = 3;

            const result = service.countLetterOccurrences(letterToCheck, lettersForTest);

            expect(result).toEqual(expectedResult);
        });

        it('should return 0 if there is no occurrence of the specified letter', () => {
            const lettersForTest: string[] = ['B', 'B', 'B', 'G'];
            const letterToCheck = 'C';
            const expectedResult = 0;

            const result = service.countLetterOccurrences(letterToCheck, lettersForTest);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('checkLettersAvailability', () => {
        it('should call getQuantityOfAvailableLetters of reserveServiceSpy', () => {
            const limit = 5;

            service.checkLettersAvailability(limit);

            expect(reserveServiceSpy.getQuantityOfAvailableLetters).toHaveBeenCalled();
        });

        it('should return true if there is enough letters in the reserve of reserveServiceSpy', () => {
            const expectedResult = true;

            const limit = 5;
            const fakeNumberOfAvailableLetters = 10;
            reserveServiceSpy.getQuantityOfAvailableLetters.and.returnValue(fakeNumberOfAvailableLetters);

            const result = service.checkLettersAvailability(limit);

            expect(result).toEqual(expectedResult);
        });

        it('should return false if there is not enough letters in the reserve of reserveServiceSpy', () => {
            const expectedResult = false;

            const limit = 10;
            const fakeNumberOfAvailableLetters = 10;
            reserveServiceSpy.getQuantityOfAvailableLetters.and.returnValue(fakeNumberOfAvailableLetters);

            const result = service.checkLettersAvailability(limit);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('replaceWord', () => {
        it('should call replaceLetter', () => {
            const wordToReplace = 'abc';
            // Car replaceLetter est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const replaceLetterSpy = spyOn<any>(service, 'replaceLetter').and.callFake(() => {
                return void '';
            });

            service.replaceWord(wordToReplace);

            expect(replaceLetterSpy).toHaveBeenCalledTimes(wordToReplace.length);
        });

        it('should also replace *', () => {
            const wordToReplace = '*';
            service.gameService.players[REAL_PLAYER].rack = [
                { name: 'A', quantity: 9, points: 1, affiche: 'A' },
                { name: '*', quantity: 0, points: 0, affiche: '*' },
                { name: '*', quantity: 0, points: 0, affiche: '*' },
                { name: 'D', quantity: 3, points: 2, affiche: 'D' },
                { name: 'E', quantity: 15, points: 1, affiche: 'E' },
            ];

            // Car replaceLetter est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'replaceLetter').and.callFake(() => {
                service.gameService.players[REAL_PLAYER].rack[1] = { name: 'D', quantity: 3, points: 2, affiche: 'D' };
            });

            service.replaceWord(wordToReplace);

            expect(service.gameService.players[REAL_PLAYER].rack[1].name).not.toEqual(wordToReplace);
        });
    });

    describe('replaceLetter', () => {
        it('should call reserveServiceSpy.getLettersFromReserve if the letter to replace is on the rack', () => {
            const letterToReplace = 'A';
            const replacementLetter = { name: 'X', quantity: 1, points: 10, affiche: 'X' };
            reserveServiceSpy.getLettersFromReserve.and.returnValue([replacementLetter]);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](letterToReplace, true);

            expect(reserveServiceSpy.getLettersFromReserve).toHaveBeenCalledWith(letterToReplace.length);
        });

        it('should call fillRackPortion there is a letter for replacement', () => {
            const letterToReplace = 'A';
            const indexOfLetterToReplaceOnRack = 0;
            const replacementLetter = { name: 'D', quantity: 3, points: 2, affiche: 'D' };
            const color = 'NavajoWhite';

            // Car fillRackPortion est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fillRackPortionSpy = spyOn<any>(service, 'fillRackPortion').and.callThrough();
            reserveServiceSpy.getLettersFromReserve.and.returnValue([replacementLetter]);

            // Car replaceLetter est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](letterToReplace, true);

            expect(fillRackPortionSpy).toHaveBeenCalledWith(indexOfLetterToReplaceOnRack, color);
        });

        it('should call reserveServiceSpy.addLetterInReserve if there is letter for replacement and the replacement is also in reserve', () => {
            const letterToReplace = 'A';
            const replacementLetter = { name: 'V', quantity: 2, points: 4, affiche: 'V' };
            reserveServiceSpy.getLettersFromReserve.and.returnValue([replacementLetter]);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](letterToReplace, false);

            expect(reserveServiceSpy.addLetterInReserve).toHaveBeenCalledWith(letterToReplace);
        });

        it('should not call reserveServiceSpy.addLetterInReserve if there is letter for replacement but the replacement is only on rack', () => {
            const letterToReplace = 'A';
            const replacementLetter = { name: 'V', quantity: 2, points: 4, affiche: 'V' };
            reserveServiceSpy.getLettersFromReserve.and.returnValue([replacementLetter]);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](letterToReplace, true);

            expect(reserveServiceSpy.addLetterInReserve).not.toHaveBeenCalledWith(letterToReplace);
        });

        it('should actually replace the letter to replace on the rack', () => {
            const letterToReplace = 'A';
            const replacementLetter = { name: 'V', quantity: 2, points: 4, affiche: 'V' };
            const indexOfLetterToReplaceOnRack = 0;
            reserveServiceSpy.getLettersFromReserve.and.returnValue([replacementLetter]);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](letterToReplace, true);

<<<<<<< HEAD
            expect(service.gameService.players[REAL_PLAYER].rack[INDEX_OF_LETTER_TO_REPLACE_ON_RACK]).toEqual(REPLACEMENT_LETTER);
=======
            expect(service.rackLetters[indexOfLetterToReplaceOnRack]).toEqual(replacementLetter);
>>>>>>> feature/placer-des-lettres
        });

        it('should call findLetterPosition if the rackLetters is not null', () => {
            const letterToReplace = 'A';
            const replacementLetter = { name: 'X', quantity: 1, points: 10, affiche: 'X' };
            reserveServiceSpy.getLettersFromReserve.and.returnValue([replacementLetter]);

            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const findLetterPositionSpy = spyOn<any>(service, 'findLetterPosition').and.callThrough();

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](letterToReplace, true);

            expect(findLetterPositionSpy).toHaveBeenCalled();
        });

        it('should not call fillRackPortion if the letter to replace is not on the rack', () => {
            const notFound = -1;
            const letterToReplace = 'Z';
            const replacementLetter = { name: 'X', quantity: 1, points: 10, affiche: 'X' };
            // Car fillRackPortion est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fillRackPortionSpy = spyOn<any>(service, 'fillRackPortion').and.callThrough();
            reserveServiceSpy.getLettersFromReserve.and.returnValue([replacementLetter]);
            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findLetterPosition').and.returnValue(notFound);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](letterToReplace, true);

            expect(fillRackPortionSpy).not.toHaveBeenCalled();
        });

        it('should not call reserveServiceSpy.addLetterInReserve if there is not letter for replacement', () => {
            const letterToReplace = 'A';
            reserveServiceSpy.getLettersFromReserve.and.returnValue([]);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](letterToReplace, false);

            expect(reserveServiceSpy.addLetterInReserve).not.toHaveBeenCalled();
        });
    });

    describe('fillRackPortion', () => {
        it('should call fillText to represent letters and their number of point on the rack', () => {
            const index = 1;
            const color = 'NavajoWhite';
            const fillTextSpy = spyOn(service.rackContext, 'fillText').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](index, color);
            expect(fillTextSpy).toHaveBeenCalledTimes(2);
        });

        it('should not call fillText if there is no letter to represent on the rack at the index provided', () => {
            const index = 10;
            const color = 'NavajoWhite';
            const fillTextSpy = spyOn(service.rackContext, 'fillText').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](index, color);
            expect(fillTextSpy).not.toHaveBeenCalled();
        });

        it('should call clearRect once', () => {
            const index = 1;
            const color = 'NavajoWhite';
            const clearRectSpy = spyOn(service.rackContext, 'clearRect').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](index, color);
            expect(clearRectSpy).toHaveBeenCalledTimes(1);
        });

        it('should call rect once', () => {
            const index = 1;
            const color = 'NavajoWhite';
            const rectSpy = spyOn(service.rackContext, 'rect').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](index, color);
            expect(rectSpy).toHaveBeenCalledTimes(1);
        });

        it('should call stroke once', () => {
            const index = 1;
            const color = 'NavajoWhite';
            const strokeSpy = spyOn(service.rackContext, 'stroke').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](index, color);
            expect(strokeSpy).toHaveBeenCalledTimes(1);
        });

        it('should call fillRect once', () => {
            const index = 1;
            const color = 'NavajoWhite';
            const fillRectSpy = spyOn(service.rackContext, 'fillRect').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](index, color);
            expect(fillRectSpy).toHaveBeenCalledTimes(1);
        });

        it(' should color pixels on the rack canvas in a specified portion', () => {
            const color = 'NavajoWhite';
            const index = 1;
            let imageData = service.rackContext.getImageData(0, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT).data;
            const beforeSize = imageData.filter((x) => x !== 0).length;

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](index, color);

            imageData = service.rackContext.getImageData(0, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT).data;
            const afterSize = imageData.filter((x) => x !== 0).length;
            expect(afterSize).toBeGreaterThan(beforeSize);
        });
    });
<<<<<<< HEAD
=======

    it(' fillRack should call fillRackPortion as many times as RACK_SIZE', () => {
        const aLetterInReserve = { name: 'X', quantity: 1, points: 10, affiche: 'X' };

        // Car fillRackPortion est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fillRackPortionSpy = spyOn<any>(service, 'fillRackPortion').and.callThrough();
        reserveServiceSpy.getLettersFromReserve.and.returnValue([aLetterInReserve]);

        // Car fillRackPortion est privée
        // eslint-disable-next-line dot-notation
        service['fillRack']();

        expect(fillRackPortionSpy).toHaveBeenCalledTimes(RACK_SIZE);
    });

    it(' fillRack should call reserveServiceSpy.getLettersFromReserve once', () => {
        const aLetterInReserve = { name: 'X', quantity: 1, points: 10, affiche: 'X' };
        reserveServiceSpy.getLettersFromReserve.and.returnValue([aLetterInReserve]);

        // Car fillRackPortion est privée
        // eslint-disable-next-line dot-notation
        service['fillRack']();

        expect(reserveServiceSpy.getLettersFromReserve).toHaveBeenCalledTimes(1);
    });
>>>>>>> feature/placer-des-lettres
});
