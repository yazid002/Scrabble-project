import { TestBed } from '@angular/core/testing';

import { RandomModeService } from './random-mode.service';

describe('RandomModeService', () => {
    let service: RandomModeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RandomModeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' getRandomInInclusive should  return a number between 0 and 3', () => {
        const expectedValue: number[] = [0, 1, 2, 3];
        const minValue = 0;
        const maxValue = 3;

        const getRandomInInclusiveSpy = spyOn(service, 'getRandomIntInclusive');
        service.getRandomIntInclusive(minValue, maxValue);
        expect(getRandomInInclusiveSpy).toContain(expectedValue);
    });

    it(' randomizeIndex should call getRandomInInclusive 1 time', () => {
        const expectCallTimes = 1;
        const minValue = 0;
        const maxValue = 3;

        const getRandomInInclusiveSpy = spyOn(service, 'getRandomIntInclusive').and.callThrough();
        service.randomizeIndex(minValue, maxValue);
        expect(getRandomInInclusiveSpy).toHaveBeenCalledTimes(expectCallTimes);
    });

    it(' randomizeIndex should call getRandomInInclusive 1 time', () => {
        const expectCallTimes = 1;
        const minValue = 0;
        const maxValue = 3;

        const getRandomInInclusiveSpy = spyOn(service, 'getRandomIntInclusive').and.callThrough();
        service.randomizeIndex(minValue, maxValue);
        expect(getRandomInInclusiveSpy).toHaveBeenCalledTimes(expectCallTimes);
    });


    it(' randomizeIndex should call getRandomInInclusive 1 time', () => {
        const expectCallTimes = 1;
        const minValue = 0;
        const maxValue = 3;

        const getRandomInInclusiveSpy = spyOn(service, 'getRandomIntInclusive').and.callThrough();
        service.randomizeIndex(minValue, maxValue);
        expect(getRandomInInclusiveSpy).toHaveBeenCalledTimes(expectCallTimes);


        it(' randomizeBonus should call randomizeIndex 1 time', () => {
            const expectCallTimes = 1;
            const minValue = 0;
            const maxValue = 3;
    
            const randomizeIndexSpy = spyOn(service, 'randomizeIndex').and.callThrough();
            service.randomizeBonus(minValue, maxValue);
            expect(randomizeIndexSpy).toHaveBeenCalledTimes(expectCallTimes);

});


it(' randomizeBonus should call fillGridPortion 1 time', () => {
    const expectCallTimes = 1;
    const minValue = 0;
    const maxValue = 3;

    const fillGridPortionSpy= spyOn(service, 'fillGridPortion').and.callThrough();
    service.randomizeBonus(minValue, maxValue);
    expect(fillGridPortionSpy).toHaveBeenCalledTimes(expectCallTimes);

});


