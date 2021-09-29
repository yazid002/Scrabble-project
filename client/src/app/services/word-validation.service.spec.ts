import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { WordValidationService } from './word-validation.service';

describe('WordValidationService', () => {
    let service: WordValidationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WordValidationService);
        const dictionary = {
            title: 'dictionnaire test',
            description: 'description de test',
            words: ['aa', 'finir', 'manger', 'rouler'],
        } as Dictionary;
        service.dictionary = dictionary;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(" checkWordMinLength should return true if the word's length is greater than the minLength specified", () => {
        const wordToCheck = 'taper';
        const minLength = 2;

        const result = service.checkWordMinLength(minLength, wordToCheck);
        expect(result).toBeTrue();
    });

    it(" checkWordMinLength should return true if the word's length is equal to the minLength specified", () => {
        const wordToCheck = 'tu';
        const minLength = 2;

        const result = service.checkWordMinLength(minLength, wordToCheck);
        expect(result).toBeTrue();
    });

    it(" checkWordMinLength should return false if the word's length is less than the minLength specified", () => {
        const wordToCheck = 't';
        const minLength = 2;

        const result = service.checkWordMinLength(minLength, wordToCheck);
        expect(result).toBeFalse();
    });

    it(' checkWordExists should return true if the word exists in the dictionary', () => {
        const wordToCheck = 'manger';

        const result = service.checkWordExists(wordToCheck);
        expect(result).toBeTrue();
    });

    it(' checkWordExists should return false if the word does not exist in the dictionary', () => {
        const wordToCheck = 'monter';

        const result = service.checkWordExists(wordToCheck);
        expect(result).toBeFalse();
    });

    it(' normalizeWord should return the word without accents and diacritics', () => {
        const wordToCheck = 'éîöPÑ-è';
        const expectedResult = 'eioPN-e';

        const result = service.normalizeWord(wordToCheck);
        expect(result).toEqual(expectedResult);
    });

    it(' checkInvalidSymbols should return true if the word contains invalid symbols', () => {
        const wordToCheck = 'grand-frere';

        const result = service.checkInvalidSymbols(wordToCheck);
        expect(result).toBeTrue();
    });

    it(' checkInvalidSymbols should return false if the word does not contain invalid symbols', () => {
        const wordToCheck = 'papa';

        const result = service.checkInvalidSymbols(wordToCheck);
        expect(result).toBeFalse();
    });

    it(' validateWord should not call checkWordExists and checkWordMinLength if the word contains invalid symbols', () => {
        const checkInvalidSymbolsSpy = spyOn(service, 'checkInvalidSymbols').and.returnValue(true);

        const checkWordExistsSpy = spyOn(service, 'checkWordExists').and.callThrough();

        const checkWordMinLengthSpy = spyOn(service, 'checkWordMinLength').and.callThrough();
        const minLength = 2;
        const wordToCheck = 'grand-frere';
        service.validateWord(minLength, wordToCheck);
        expect(checkInvalidSymbolsSpy).toHaveBeenCalled();
        expect(checkWordExistsSpy).not.toHaveBeenCalled();
        expect(checkWordMinLengthSpy).not.toHaveBeenCalled();
    });

    it(' validateWord should call checkWordExists and checkWordMinLength if the word does not contain invalid symbols', () => {
        const checkInvalidSymbolsSpy = spyOn(service, 'checkInvalidSymbols').and.returnValue(false);

        const checkWordExistsSpy = spyOn(service, 'checkWordExists').and.callThrough();

        const checkWordMinLengthSpy = spyOn(service, 'checkWordMinLength').and.callThrough();
        const minLength = 2;
        const wordToCheck = 'grand-frere';
        service.validateWord(minLength, wordToCheck);
        expect(checkInvalidSymbolsSpy).toHaveBeenCalled();
        expect(checkWordMinLengthSpy).toHaveBeenCalled();
        expect(checkWordExistsSpy).toHaveBeenCalled();
    });
});
