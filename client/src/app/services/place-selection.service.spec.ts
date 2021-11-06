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

    // it(' getClickIndex should return NOT FOUND if false', () => {
    //     const result: Vec2 = { x: 7, y: 7 };
    //     const x = 10;
    //     const y = 10;

    //     const xValue = 7;
    //     const yValue = 7;
    //     const event = {
    //         button: 0,
    //         offsetX: xValue,
    //         offsetY: yValue,
    //     } as MouseEvent;

    //     const getClickcoordpy = spyOn(service, 'getClickIndex').and.callThrough();
    //     if (
    //         event.offsetX >= x * SQUARE_WIDTH &&
    //         event.offsetX < (x + 1) * SQUARE_WIDTH &&
    //         event.offsetY >= y * SQUARE_HEIGHT &&
    //         event.offsetY < (y + 1) * SQUARE_HEIGHT
    //     )
    //         expect(getClickcoordpy).toEqual(result);
    // });

    // it(' checkPlacementFeasibility should return false in index equal to notfound', () => {
    //     // const coord: Vec2 = { x: 7, y: 7 };
    //     // const params = -1;
    //     // const result = false;

    //     const checkPlacementFeasibilitySpy = spyOn(service, 'checkPlacementFeasibility').and.callThrough();

    //     expect(checkPlacementFeasibilitySpy).toEqual(true);
    // });
});
