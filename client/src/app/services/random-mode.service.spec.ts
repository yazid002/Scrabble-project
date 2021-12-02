import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { GridService } from './grid.service';
import { RandomModeService } from './random-mode.service';
import { UserSettingsService } from './user-settings.service';

describe('RandomModeService', () => {
    let service: RandomModeService;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let ctxStub: CanvasRenderingContext2D;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
    beforeEach(() => {
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries']);
        userSettingsServiceSpy.getDictionaries.and.returnValue(undefined);
        const CANVAS_WIDTH = 500;
        const CANVAS_HEIGHT = 500;

        gridServiceSpy = jasmine.createSpyObj('GridService', ['fillGridPortion']);
        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridServiceSpy }],
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(RandomModeService);
        service.tiles = JSON.parse(JSON.stringify(tiles));
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridServiceSpy.gridContext = ctxStub;
        gridServiceSpy.letterStyle = { color: 'NavajoWhite', font: '15px serif' };
        gridServiceSpy.pointStyle = { color: 'NavajoWhite', font: '10px serif' };
        gridServiceSpy.border = { squareBorderColor: 'black' };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' getRandomInInclusive should  return a number between 0 and 3', () => {
        const expectedValue: number[] = [0, 1, 2, 3];
        const minValue = 0;
        const maxValue = 3;

        const result = service.getRandomIntInclusive(minValue, maxValue);
        expect(expectedValue).toContain(result);
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

    it(' randomizeIndex should call getRandomIntInclusive 1 time', () => {
        const expectCallTimes = 1;
        const minValue = 0;
        const maxValue = 3;
        service.bonusOnGrid = [
            { text: 'tw', color: 'IndianRed', quantity: 8 },
            { text: 'tl', color: 'RoyalBlue', quantity: 12 },
            { text: 'dw', color: 'LightPink', quantity: 17 },
            { text: 'dl', color: 'LightSkyBlue', quantity: 24 },
        ];

        const getRandomIntInclusiveSpy = spyOn(service, 'getRandomIntInclusive').and.callThrough();
        service.randomizeIndex(minValue, maxValue);
        expect(getRandomIntInclusiveSpy).toHaveBeenCalledTimes(expectCallTimes);
    });

    // TODO: Revoir le comportement pour arranger les tests
    it(' randomizeBonus should call randomizeIndex 61 times', () => {
        const expectCallTimes = 61;
        const minValue = 0;
        const maxValue = 3;
        service.isChecked = true;

        const randomizeIndexSpy = spyOn(service, 'randomizeIndex').and.callThrough();
        service.randomizeBonus(minValue, maxValue);
        expect(randomizeIndexSpy).toHaveBeenCalledTimes(expectCallTimes);
    });

    it(' randomizeBonus should call fillGridPortion 61 times', () => {
        const expectCallTimes = 61;
        const minValue = 0;
        const maxValue = 3;
        service.isChecked = true;

        service.randomizeBonus(minValue, maxValue);
        expect(gridServiceSpy.fillGridPortion).toHaveBeenCalledTimes(expectCallTimes);
    });
});
