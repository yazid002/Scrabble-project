import { TestBed } from '@angular/core/testing';
import { PlaceSelectionService } from './place-selection.service';

describe('PlaceSelectionService', () => {
    let service: PlaceSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlaceSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
