import { TestBed } from '@angular/core/testing';
import { ExchangeSelectionService } from './exchange-selection.service';

describe('ExchangeSelectionService', () => {
    let service: ExchangeSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ExchangeSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
