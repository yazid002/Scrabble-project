import { TestBed } from '@angular/core/testing';
import { ICharacter } from '@app/classes/letter';
import { BINGO_BONUS, PointsCountingService } from './points-counting.service';

// // A placer dans un fichier de constantes
// export const INVALID_NUMBER = -1;
// export const BINGO_BONUS = 50;
// export const BINGO_LENGTH = 7;

describe('PointsCountingService', () => {
    let service: PointsCountingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PointsCountingService);
        const reserve: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 2, points: 3, affiche: 'B' },
            { name: 'C', quantity: 2, points: 3, affiche: 'C' },
        ];
        service.reserve = reserve;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' getLetterPoints should return the letter points', () => {
        const letterToCheck = 'B';
        const expectedResult = 3;

        const result = service.getLetterPoints(letterToCheck);

        expect(result).toEqual(expectedResult);
    });

    it(' getLetterPoints should return the invalid number', () => {
        const letterToCheck = 'D';
        const expectedResult = -1;

        const result = service.getLetterPoints(letterToCheck);

        expect(result).toEqual(expectedResult);
    });

    it(' getWordBasePoints should return the word points', () => {
        const wordToCheck = 'ABC';
        const expectedResult = 7;
        service.wordIsValid = true;

        const result = service.getWordBasePoints(wordToCheck);

        expect(result).toEqual(expectedResult);
    });
    it(' applyBingo should return the word points with a bonus', () => {
        const wordToCheck = 'ABCABCA';
        const wordBasePoints = 15;
        const expectedResult = wordBasePoints + BINGO_BONUS;
        service.wordIsValid = true;

        const result = service.applyBingo(wordToCheck, wordBasePoints);

        expect(result).toEqual(expectedResult);
    });

    it(' applyBingo should return the word base points', () => {
        const wordToCheck = 'ABCABC';
        const wordBasePoints = 14;
        const expectedResult = wordBasePoints;
        service.wordIsValid = true;

        const result = service.applyBingo(wordToCheck, wordBasePoints);

        expect(result).toEqual(expectedResult);
    });
});
