import { TestBed } from '@angular/core/testing';
import { Dictionary } from './classes/dictionary';
import { VerifyService } from './verify.service';

describe('VerifyService', () => {
    let service: VerifyService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VerifyService);
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

    it(' isWordInDictionary should return true if the word exists in the dictionary', () => {
        const wordToCheck = 'manger';

        // Car isWordInDictionary est privée
        // eslint-disable-next-line dot-notation
        const result = service['isWordInDictionary'](wordToCheck);
        expect(result).toBeTrue();
    });

    it(' isWordInDictionary should return false if the word does not exist in the dictionary', () => {
        const wordToCheck = 'monter';

        // Car isWordInDictionary est privée
        // eslint-disable-next-line dot-notation
        const result = service['isWordInDictionary'](wordToCheck);
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

        // Car checkInvalidSymbols est privée
        // eslint-disable-next-line dot-notation
        const result = service['checkInvalidSymbols'](wordToCheck);
        expect(result).toBeTrue();
    });

    it(' checkInvalidSymbols should return false if the word does not contain invalid symbols', () => {
        const wordToCheck = 'papa';

        // Car checkInvalidSymbols est privée
        // eslint-disable-next-line dot-notation
        const result = service['checkInvalidSymbols'](wordToCheck);
        expect(result).toBeFalse();
    });
});
