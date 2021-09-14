import { TestBed } from '@angular/core/testing';
import { PointsCountingService } from './points-counting.service';

describe('PointsCountingService', () => {
    let service: PointsCountingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PointsCountingService);
        const reserve: { name: string; params: { quantity: number; points: number; display: string } }[] = [
            { name: 'A', params: { quantity: 9, points: 1, display: 'A' } },
            { name: 'B', params: { quantity: 2, points: 3, display: 'B' } },
            { name: 'C', params: { quantity: 2, points: 3, display: 'C' } },
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

    it(' getWordPoints should return the word points', () => {
        const wordToCheck = 'ABC';
        const expectedResult = 7;
        service.wordIsValid = true;
        const result = service.getWordPoints(wordToCheck);
        expect(result).toEqual(expectedResult);
    });

    it(' getWordPoints should return the invalid number', () => {
        const wordToCheck = 'ABC';
        const expectedResult = -1;
        service.wordIsValid = false;
        const result = service.getWordPoints(wordToCheck);
        expect(result).toEqual(expectedResult);
    });
});
