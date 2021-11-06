import { TestBed } from '@angular/core/testing';
import { PlaceSelectionService } from './place-selection.service';

fdescribe('PlaceSelectionService', () => {
    let service: PlaceSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlaceSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it(' getClickIndex should return NOT FOUND if false', () => {

    //     const returnValue = 'NOT FOUND'

    //     const getClickIndexSpy = spyOn(service, 'getClickIndex').and.callThrough();
    //     expect(getClickIndexSpy).toHaveBeenCalledTimes(expectCallTimes)
    // });

});
