import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { Vec2 } from '@app/classes/vec2';
import { BINGO_BONUS } from '@app/constants/board-constants';
import { PointsCountingService } from './points-counting.service';

describe('PointsCountingService', () => {
    let service: PointsCountingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PointsCountingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' getLetterPoints should return the letter points', () => {
        const letterToCheck = 'b';
        const expectedResult = 3;

        // getLetterPoints est privée
        // eslint-disable-next-line dot-notation
        const result = service['getLetterPoints'](letterToCheck);

        expect(result).toEqual(expectedResult);
    });

    it(' getLetterPoints should return the invalid number', () => {
        const letterToCheck = 'ë';
        const expectedResult = -1;

        // getLetterPoints est privée
        // eslint-disable-next-line dot-notation
        const result = service['getLetterPoints'](letterToCheck);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBingo should return the word points with a bonus', () => {
        const wordToCheck = 'abcabca';
        const wordBasePoints = 15;
        const expectedResult = wordBasePoints + BINGO_BONUS;

        // applyBingo est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBingo'](wordToCheck, wordBasePoints);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBingo should return the word base points', () => {
        const wordToCheck = 'abcabc';
        const wordBasePoints = 14;
        const expectedResult = wordBasePoints;

        // applyBingo est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBingo'](wordToCheck, wordBasePoints);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word base points', () => {
        const wordToCheck = 'abcabc';
        const wordBasePoints = 14;
        const expectedResult = wordBasePoints;

        // applyBingo est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBingo'](wordToCheck, wordBasePoints);

        expect(result).toEqual(expectedResult);
    });

    it(' processWordPoints should call applyBoardBonuses', () => {
        const wordToCheck = 'abcabc';
        const coord: Vec2 = { x: 7, y: 7 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        // applyBoardBonuses est privée
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

        // applyBingo est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const applyBingoSpy = spyOn<any>(service, 'applyBingo').and.callThrough();

        service.processWordPoints(wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(applyBingoSpy).toHaveBeenCalledTimes(1);
    });

    it(' applyBoardBonuses should return the word basePoint if there is not any bonus', () => {
        const wordToCheck = 'abc';
        const expectedResult = 7;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        tiles[coord.x][coord.y].bonus = 'xx';
        tiles[coord.x][coord.y + 1].bonus = 'xx';
        tiles[coord.x][coord.y + 2].bonus = 'xx';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a double letter bonus applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 8;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        tiles[coord.x][coord.y].bonus = 'dl';
        tiles[coord.x][coord.y + 1].bonus = 'xx';
        tiles[coord.x][coord.y + 2].bonus = 'xx';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a triple letter bonus applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 9;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        tiles[coord.x][coord.y].bonus = 'tl';
        tiles[coord.x][coord.y + 1].bonus = 'xx';
        tiles[coord.x][coord.y + 2].bonus = 'xx';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a triple word bonus applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 21;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        tiles[coord.x][coord.y].bonus = 'xx';
        tiles[coord.x][coord.y + 1].bonus = 'tw';
        tiles[coord.x][coord.y + 2].bonus = 'xx';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a double word bonus applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 14;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        tiles[coord.x][coord.y].bonus = 'xx';
        tiles[coord.x][coord.y + 1].bonus = 'dw';
        tiles[coord.x][coord.y + 2].bonus = 'xx';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a double word and a triple word bonuses applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 42;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        tiles[coord.x][coord.y].bonus = 'xx';
        tiles[coord.x][coord.y + 1].bonus = 'dw';
        tiles[coord.x][coord.y + 2].bonus = 'tw';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a double letter and a triple word bonuses applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 24;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        tiles[coord.x][coord.y].bonus = 'dl';
        tiles[coord.x][coord.y + 1].bonus = 'xx';
        tiles[coord.x][coord.y + 2].bonus = 'tw';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a triple letter and a triple word bonuses applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 27;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        tiles[coord.x][coord.y].bonus = 'tl';
        tiles[coord.x][coord.y + 1].bonus = 'xx';
        tiles[coord.x][coord.y + 2].bonus = 'tw';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a triple letter and a double word bonuses applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 18;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        tiles[coord.x][coord.y].bonus = 'tl';
        tiles[coord.x][coord.y + 1].bonus = 'xx';
        tiles[coord.x][coord.y + 2].bonus = 'dw';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint with a double letter and a double word bonuses applied', () => {
        const wordToCheck = 'abc';
        const expectedResult = 16;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

        tiles[coord.x][coord.y].bonus = 'dl';
        tiles[coord.x][coord.y + 1].bonus = 'xx';
        tiles[coord.x][coord.y + 2].bonus = 'dw';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint without letters used on board points', () => {
        const wordToCheck = 'abc';
        const expectedResult = 6;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [{ letter: 'a', coord }];

        tiles[coord.x][coord.y].bonus = 'xx';
        tiles[coord.x][coord.y + 1].bonus = 'xx';
        tiles[coord.x][coord.y + 2].bonus = 'xx';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBoardBonuses should return the word basePoint without letters used on board bonuses', () => {
        const wordToCheck = 'abc';
        const expectedResult = 6;

        const coord: Vec2 = { x: 7, y: 8 };
        const direction = 'h';
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [{ letter: 'a', coord }];

        tiles[coord.x][coord.y].bonus = 'dw';
        tiles[coord.x][coord.y + 1].bonus = 'xx';
        tiles[coord.x][coord.y + 2].bonus = 'xx';

        // applyBoardBonuses est privée
        // eslint-disable-next-line dot-notation
        const result = service['applyBoardBonuses'](wordToCheck, coord, direction, lettersUsedOnBoard);

        expect(result).toEqual(expectedResult);
    });
});
