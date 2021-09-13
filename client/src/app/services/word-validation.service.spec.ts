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
        // Pour tester les méthodes privées
        // eslint-disable-next-line dot-notation
        const result = service['checkWordMinLength'](minLength, wordToCheck);
        expect(result).toBeTrue();
    });

    it(" checkWordMinLength should return true if the word's length is equal to the minLength specified", () => {
        const wordToCheck = 'tu';
        const minLength = 2;
        // Pour tester les méthodes privées
        // eslint-disable-next-line dot-notation
        const result = service['checkWordMinLength'](minLength, wordToCheck);
        expect(result).toBeTrue();
    });

    it(" checkWordMinLength should return false if the word's length is less than the minLength specified", () => {
        const wordToCheck = 't';
        const minLength = 2;
        // Pour tester les méthodes privées
        // eslint-disable-next-line dot-notation
        const result = service['checkWordMinLength'](minLength, wordToCheck);
        expect(result).toBeFalse();
    });

    it(' checkWordExists should return true if the word exists in the dictionary', () => {
        const wordToCheck = 'manger';
        // Pour tester les méthodes privées
        // eslint-disable-next-line dot-notation
        const result = service['checkWordExists'](wordToCheck);
        expect(result).toBeTrue();
    });

    it(' checkWordExists should return false if the word does not exist in the dictionary', () => {
        const wordToCheck = 'monter';
        // Pour tester les méthodes privées
        // eslint-disable-next-line dot-notation
        const result = service['checkWordExists'](wordToCheck);
        expect(result).toBeFalse();
    });

    it(' processWord should return the word in lowercase without accents and diacritics', () => {
        const wordToCheck = 'éîöPÑ-è';
        const expectedResult = 'eiopn-e';
        // Pour tester les méthodes privées
        // eslint-disable-next-line dot-notation
        const result = service['processWord'](wordToCheck);
        expect(result).toEqual(expectedResult);
    });

    it(' checkInvalidSymbols should return true if the word contains invalid symbols', () => {
        const wordToCheck = 'grand-frere';
        // Pour tester les méthodes privées
        // eslint-disable-next-line dot-notation
        const result = service['checkInvalidSymbols'](wordToCheck);
        expect(result).toBeTrue();
    });

    it(' checkInvalidSymbols should return false if the word does not contain invalid symbols', () => {
        const wordToCheck = 'papa';
        // eslint-disable-next-line dot-notation
        const result = service['checkInvalidSymbols'](wordToCheck);
        expect(result).toBeFalse();
    });

    it(' validateWord should not call checkWordExists and checkWordMinLength if the word contains invalid symbols', () => {
        // Pour tester les méthodes privées
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkInvalidSymbolsSpy = spyOn<any>(service, 'checkInvalidSymbols').and.returnValue(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkWordExistsSpy = spyOn<any>(service, 'checkWordExists').and.callThrough();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkWordMinLengthSpy = spyOn<any>(service, 'checkWordMinLength').and.callThrough();
        const minLength = 2;
        const wordToCheck = 'grand-frere';
        service.validateWord(minLength, wordToCheck);
        expect(checkInvalidSymbolsSpy).toHaveBeenCalled();
        expect(checkWordExistsSpy).not.toHaveBeenCalled();
        expect(checkWordMinLengthSpy).not.toHaveBeenCalled();
    });

    it(' validateWord should call checkWordExists and checkWordMinLength if the word does not contain invalid symbols', () => {
        // Pour tester les méthodes privées
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkInvalidSymbolsSpy = spyOn<any>(service, 'checkInvalidSymbols').and.returnValue(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkWordExistsSpy = spyOn<any>(service, 'checkWordExists').and.callThrough();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checkWordMinLengthSpy = spyOn<any>(service, 'checkWordMinLength').and.callThrough();
        const minLength = 2;
        const wordToCheck = 'grand-frere';
        service.validateWord(minLength, wordToCheck);
        expect(checkInvalidSymbolsSpy).toHaveBeenCalled();
        expect(checkWordMinLengthSpy).toHaveBeenCalled();
        expect(checkWordExistsSpy).toHaveBeenCalled();
    });
});
