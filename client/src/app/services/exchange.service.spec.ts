import { TestBed } from '@angular/core/testing';
import { ExchangeService } from './exchange.service';
import { RackService } from './rack.service';

describe('ExchangeService', () => {
    let service: ExchangeService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;

    beforeEach(() => {
        rackServiceSpy = jasmine.createSpyObj('RackService', ['replaceLetter', 'findLetterPosition', 'countLetterOccurrences', 'disableAll']);
        rackServiceSpy.rackLetters = [
            { name: 'A', params: { quantity: 9, points: 1, affiche: 'A' } },
            { name: 'B', params: { quantity: 2, points: 3, affiche: 'B' } },
            { name: 'C', params: { quantity: 2, points: 3, affiche: 'C' } },
            { name: 'D', params: { quantity: 3, points: 2, affiche: 'D' } },
            { name: 'E', params: { quantity: 15, points: 1, affiche: 'E' } },
        ];
        TestBed.configureTestingModule({
            providers: [{ provide: RackService, useValue: rackServiceSpy }],
        });
        service = TestBed.inject(ExchangeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('findLetterToChangeOnRack should call findLetterPosition de rackServiceSpy', () => {
        const letterToChange = 'B';
        // eslint-disable-next-line dot-notation
        service['findLetterToChangeOnRack'](letterToChange);
        expect(rackServiceSpy.findLetterPosition).toHaveBeenCalled();
    });

    it('findLetterToChangeOnRack should return true', () => {
        rackServiceSpy.findLetterPosition.and.returnValue(2);
        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const findLetterToChangeOnRackSpy = spyOn<any>(service, 'findLetterToChangeOnRack').and.returnValue(true);
        const letterToChange = 'B';
        // eslint-disable-next-line dot-notation
        const result = service['findLetterToChangeOnRack'](letterToChange);
        expect(result).toBeTrue();
    });

    it('findLetterToChangeOnRack should return false', () => {
        const notFound = -1;
        rackServiceSpy.findLetterPosition.and.returnValue(notFound);
        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // const findLetterToChangeOnRackSpy = spyOn<any>(service, 'findLetterToChangeOnRack').and.returnValue(true);
        const letterToChange = 'G';
        // eslint-disable-next-line dot-notation
        const result = service['findLetterToChangeOnRack'](letterToChange);
        expect(result).toBeFalse();
    });

    it('checkLetterOccurrencesMatch should call countLetterOccurrences de rackServiceSpy', () => {
        const letterToChange = 'B';
        const lettersToChange = ['B', 'U', 'D'];
        // eslint-disable-next-line dot-notation
        service['checkLetterOccurrencesMatch'](letterToChange, lettersToChange);
        expect(rackServiceSpy.countLetterOccurrences).toHaveBeenCalled();
    });

    it('checkLetterOccurrencesMatch should return true if the letter to change has the same or less occurrence number in command and on rack', () => {
        const letterToChange = 'B';
        const lettersToChange = ['B', 'D'];
        rackServiceSpy.rackLetters = [
            { name: 'A', params: { quantity: 9, points: 1, affiche: 'A' } },
            { name: 'B', params: { quantity: 0, points: 3, affiche: 'B' } },
            { name: 'B', params: { quantity: 0, points: 3, affiche: 'B' } },
            { name: 'D', params: { quantity: 3, points: 2, affiche: 'D' } },
            { name: 'E', params: { quantity: 15, points: 1, affiche: 'E' } },
        ];
        // eslint-disable-next-line dot-notation
        const result = service['checkLetterOccurrencesMatch'](letterToChange, lettersToChange);
        expect(rackServiceSpy.countLetterOccurrences).toHaveBeenCalledWith(letterToChange, ['A', 'B', 'B', 'D', 'E']);
        expect(result).toBeTrue();
    });
});
