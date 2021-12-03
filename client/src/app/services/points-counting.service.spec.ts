/* eslint-disable max-lines */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { Vec2 } from '@app/classes/vec2';
import { BINGO_BONUS, SQUARE_NUMBER } from '@app/constants/board-constants';
import { NOT_FOUND } from '@app/constants/common-constants';
import { PointsCountingService } from './points-counting.service';
import { ReserveService } from './reserve.service';
import { VerifyService } from './verify.service';

describe('PointsCountingService', () => {
    let service: PointsCountingService;
    let reserveServiceSpy: jasmine.SpyObj<ReserveService>;
    let verifyServiceSpy: jasmine.SpyObj<VerifyService>;
    beforeEach(() => {
        reserveServiceSpy = jasmine.createSpyObj('ReserveService', ['findLetterInReserve']);
        reserveServiceSpy.alphabets = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 2, points: 3, display: 'B' },
            { name: 'C', quantity: 2, points: 3, display: 'C' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'F', quantity: 2, points: 4, display: 'F' },
            { name: 'G', quantity: 2, points: 4, display: 'G' },
            { name: 'H', quantity: 2, points: 4, display: 'H' },
        ];

        verifyServiceSpy = jasmine.createSpyObj('VerifyService', ['computeCoordByDirection', 'areCoordValid']);
        verifyServiceSpy.formedWords = [];
        verifyServiceSpy.computeCoordByDirection.and.callFake((direction: string, coord: Vec2, step: number) => {
            const x = direction === 'h' || direction === 'horizontal' ? coord.x + step : coord.x;
            const y = direction === 'v' || direction === 'vertical' ? coord.y + step : coord.y;

            return { y, x };
        });

        verifyServiceSpy.areCoordValid.and.callFake((coord: Vec2) => {
            return coord.y < SQUARE_NUMBER && coord.x < SQUARE_NUMBER && coord.x >= 0 && coord.y >= 0;
        });

        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                { provide: ReserveService, useValue: reserveServiceSpy },
                { provide: VerifyService, useValue: verifyServiceSpy },
            ],
        });
        service = TestBed.inject(PointsCountingService);
        service.tiles = JSON.parse(JSON.stringify(tiles));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' getLetterPoints should return the letter points', () => {
        const letterToCheck = 'b';
        const expectedResult = 3;
        const character = { name: 'B', quantity: 2, points: 3, display: 'B' };

        reserveServiceSpy.findLetterInReserve.and.returnValue(character);

        // getLetterPoints is private
        // eslint-disable-next-line dot-notation
        const result = service['getLetterPoints'](letterToCheck);

        expect(result).toEqual(expectedResult);
    });

    it(' getLetterPoints should return the invalid number', () => {
        const letterToCheck = 'ë';
        const expectedResult = -1;

        reserveServiceSpy.findLetterInReserve.and.returnValue(NOT_FOUND);

        // getLetterPoints is private
        // eslint-disable-next-line dot-notation
        const result = service['getLetterPoints'](letterToCheck);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBingo should return the word points with a bonus', () => {
        const wordToCheck = 'abcabca';
        const wordBasePoints = 15;
        const coordTest = { x: 3, y: 4 };
        const directionTest = 'horizontal';
        const expectedResult = wordBasePoints + BINGO_BONUS;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3, 1, 3, 3);

        // applyBingo is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBingo'](wordToCheck, coordTest, directionTest, wordBasePoints, []);

        expect(result).toEqual(expectedResult);
    });

    it(" applyBingo should return the word base points if the word's length is 7 but there are letters used on board", () => {
        const wordToCheck = 'abcabc';
        const wordBasePoints = 14;
        const coord = { x: 3, y: 4 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [{ letter: 'b', coord: { x: 4, y: 4 } }];
        const expectedResult = wordBasePoints;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 1, 3, 3);
        // applyBingo is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBingo'](wordToCheck, coord, direction, wordBasePoints, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word base points', () => {
        const wordToCheck = 'abcabc';
        const wordBasePoints = 14;
        const coord = { x: 3, y: 4 };
        const direction = 'h';
        const expectedResult = wordBasePoints;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3, 1, 3, 3);

        // applyBingo is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBingo'](wordToCheck, coord, direction, wordBasePoints, []);

        expect(result).toEqual(expectedResult);
    });

    it(' processWordPoints should call applyBoardBonuses', () => {
        const wordToCheck = 'abcabc';
        const coord: Vec2 = { x: 7, y: 7 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3, 1, 3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyBoardBonusesSpy = spyOn<any>(service, 'applyBoardBonuses').and.callThrough();

        service.processWordPoints(wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(applyBoardBonusesSpy).toHaveBeenCalledTimes(1);
    });

    it(' processWordPoints should call applyBingo', () => {
        const wordToCheck = 'abcabc';
        const coord: Vec2 = { x: 7, y: 7 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3, 1, 3, 3);

        // applyBingo is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyBingoSpy = spyOn<any>(service, 'applyBingo').and.callThrough();

        service.processWordPoints(wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(applyBingoSpy).toHaveBeenCalledTimes(1);
    });

    it(' applyBoardBonuses should return the word basePoint if there is not any bonus', () => {
        const wordToCheck = 'abc';
        const expectedResult = 7;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        service.tiles[coord.y][coord.x].bonus = 'xx';
        service.tiles[coord.y + 1][coord.x].bonus = 'xx';
        service.tiles[coord.y + 2][coord.x].bonus = 'xx';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a double letter bonus applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 8;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        service.tiles[coord.y][coord.x].bonus = 'dl';
        service.tiles[coord.y + 1][coord.x].bonus = 'xx';
        service.tiles[coord.y + 2][coord.x].bonus = 'xx';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a triple letter bonus applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 9;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        service.tiles[coord.y][coord.x].bonus = 'tl';
        service.tiles[coord.y + 1][coord.x].bonus = 'xx';
        service.tiles[coord.y + 2][coord.x].bonus = 'xx';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a triple word bonus applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 21;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3);

        service.tiles[coord.y][coord.x].bonus = 'xx';
        service.tiles[coord.y + 1][coord.x].bonus = 'tw';
        service.tiles[coord.y + 2][coord.x].bonus = 'xx';

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a double word bonus applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 14;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        service.tiles[coord.y][coord.x].bonus = 'xx';
        service.tiles[coord.y + 1][coord.x].bonus = 'dw';
        service.tiles[coord.y + 2][coord.x].bonus = 'xx';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a double word and a triple word bonuses applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 42;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        service.tiles[coord.y][coord.x].bonus = 'xx';
        service.tiles[coord.y + 1][coord.x].bonus = 'dw';
        service.tiles[coord.y + 2][coord.x].bonus = 'tw';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a double letter and a triple word bonuses applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 24;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        service.tiles[coord.y][coord.x].bonus = 'dl';
        service.tiles[coord.y + 1][coord.x].bonus = 'xx';
        service.tiles[coord.y + 2][coord.x].bonus = 'tw';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a triple letter and a triple word bonuses applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 27;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        service.tiles[coord.y][coord.x].bonus = 'tl';
        service.tiles[coord.y + 1][coord.x].bonus = 'xx';
        service.tiles[coord.y + 2][coord.x].bonus = 'tw';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a triple letter and a double word bonuses applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 18;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        service.tiles[coord.y][coord.x].bonus = 'tl';
        service.tiles[coord.y + 1][coord.x].bonus = 'xx';
        service.tiles[coord.y + 2][coord.x].bonus = 'dw';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a double letter and a double word bonuses applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 16;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        service.tiles[coord.y][coord.x].bonus = 'dl';
        service.tiles[coord.y + 1][coord.x].bonus = 'xx';
        service.tiles[coord.y + 2][coord.x].bonus = 'dw';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(1, 3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint without letters used on board points', () => {
        const wordToCheck = 'abc';
        const expectedResult = 6;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [{ letter: 'a', coord }];

        service.tiles[coord.y][coord.x].bonus = 'xx';
        service.tiles[coord.y + 1][coord.x].bonus = 'xx';
        service.tiles[coord.y + 2][coord.x].bonus = 'xx';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint without letters used on board bonuses', () => {
        const wordToCheck = 'abc';
        const expectedResult = 6;

        const coord: Vec2 = { y: 7, x: 8 };
        const direction = 'v';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [{ letter: 'a', coord }];

        service.tiles[coord.y][coord.x].bonus = 'dw';
        service.tiles[coord.y + 1][coord.x].bonus = 'xx';
        service.tiles[coord.y + 2][coord.x].bonus = 'xx';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'getLetterPoints').and.returnValues(3, 3);

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the bad word', () => {
        const wordToCheck = 'abc';
        const expectedResult = -100;

        const coord: Vec2 = { y: -1, x: -1 };
        const direction = 'v';

        // applyBoardBonuses is private
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, []);

        expect(result).toEqual(expectedResult);
    });
});
