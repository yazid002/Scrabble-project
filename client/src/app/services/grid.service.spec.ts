import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { SQUARE_NUMBER } from '@app/constants/board-constants';
import { GridService } from '@app/services/grid.service';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;
    const coord: Vec2 = { x: 7, y: 7 };
    const letter = 'a';
    const color = 'NavajoWhite';
    const font = '15px serif';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it(' drawGrid should call drawGridOutdoor 1 time', () => {
        const expectCallTimes = 1;

        const drawGridOutdoorSpy = spyOn(service, 'drawGridOutdoor').and.callThrough();
        service.drawGrid();
        expect(drawGridOutdoorSpy).toHaveBeenCalledTimes(expectCallTimes);
    });

    it(' drawGrid should call fillGridPortion ', () => {
        const expectCallTimes = 225;
        const fillGridPortionSpy = spyOn(service, 'fillGridPortion').and.callThrough();
        service.drawGrid();

        expect(fillGridPortionSpy).toHaveBeenCalledTimes(expectCallTimes);
    });

    it(' drawGrid should call StrokeRect ', () => {
        const expectCallTimes = 225;
        const strokeTextSpy = spyOn(service.gridContext, 'strokeRect').and.callThrough();
        service.drawGrid();

        expect(strokeTextSpy).toHaveBeenCalledTimes(expectCallTimes);
    });

    describe('fillGridPortion', () => {
        it('should call strokeText to represent letters and their number of point on the board', () => {
            const strokeTextSpy = spyOn(service.gridContext, 'strokeText').and.callThrough();

            service.fillGridPortion(coord, letter, color, font);
            expect(strokeTextSpy).toHaveBeenCalledTimes(2);
        });

        it('should call clearRect once', () => {
            const clearRectSpy = spyOn(service.gridContext, 'clearRect').and.callThrough();

            service.fillGridPortion(coord, letter, color, font);
            expect(clearRectSpy).toHaveBeenCalledTimes(1);
        });

        it('should call stroke once', () => {
            const strokeSpy = spyOn(service.gridContext, 'stroke').and.callThrough();
            service.fillGridPortion(coord, letter, color, font);
            expect(strokeSpy).toHaveBeenCalledTimes(1);
        });

        it('should call fillRect once', () => {
            const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();

            service.fillGridPortion(coord, letter, color, font);
            expect(fillRectSpy).toHaveBeenCalledTimes(1);
        });

        it(' should color pixels on the GRID canvas in a specified portion', () => {
            let imageData = service.gridContext.getImageData(
                (CANVAS_WIDTH / SQUARE_NUMBER) * coord.y,
                (CANVAS_WIDTH / SQUARE_NUMBER) * coord.x,
                CANVAS_WIDTH / SQUARE_NUMBER,
                CANVAS_WIDTH / SQUARE_NUMBER,
            ).data;
            const beforeSize = imageData.filter((x) => x !== 0).length;

            service.fillGridPortion(coord, letter, color, font);

            imageData = service.gridContext.getImageData(
                (CANVAS_WIDTH / SQUARE_NUMBER) * coord.y,
                (CANVAS_WIDTH / SQUARE_NUMBER) * coord.x,
                CANVAS_WIDTH / SQUARE_NUMBER,
                CANVAS_WIDTH / SQUARE_NUMBER,
            ).data;
            const afterSize = imageData.filter((x) => x !== 0).length;
            expect(afterSize).toBeGreaterThan(beforeSize);
        });
    });

    describe('drawGridOutdoor', () => {
        it('should call changeGridStyle 2 times', () => {
            const stylePeach = 'PeachPuff';

            const changeGridStyleSpy = spyOn(service, 'changeGridStyle').and.callThrough();

            service.changeGridStyle(stylePeach);
            expect(changeGridStyleSpy).toHaveBeenCalledTimes(1);
        });
    });

    it(' changeTileSize should call fillGridPortion if tile.letter is not empty and not a bonus', () => {
        const x = 3;
        const y = 4;
        const letterStep = 1;
        const pointStep = 1;
        tiles[y][x].text = 'a';
        tiles[y][x].bonus = 'x';

        const fillGridPortionSpy = spyOn(service, 'fillGridPortion').and.callThrough();
        service.changeTileSize(letterStep, pointStep);

        expect(fillGridPortionSpy).toHaveBeenCalled();
    });

    it(' increaseTileSize should call changeTileSize if maxValue is not reach  ', () => {
        const letterStep = 1;
        const pointStep = 1;
        const maxValue = 25;

        service.letterStyle.font = '10px serif';
        service.pointStyle.font = '2px serif';

        const expectCallTimes = 2;
        const changeTileSizeSpy = spyOn(service, 'changeTileSize').and.callThrough();

        service.increaseTileSize(letterStep, pointStep, maxValue);

        expect(changeTileSizeSpy).toHaveBeenCalledTimes(expectCallTimes);
    });

    it(' increaseTileSize should not call changeTileSize if maxValue is reach  ', () => {
        const letterStep = 1;
        const pointStep = 1;
        const maxValue = 2;

        service.letterStyle.font = '10px serif';
        service.pointStyle.font = '2px serif';

        const changeTileSizeSpy = spyOn(service, 'changeTileSize').and.callThrough();

        service.increaseTileSize(letterStep, pointStep, maxValue);

        expect(changeTileSizeSpy).not.toHaveBeenCalled();
    });

    it(' decreaseTileSize should call changeTileSize if minValue is not reach  ', () => {
        const letterStep = 1;
        const pointStep = 1;
        const minValue = 2;

        service.letterStyle.font = '30px serif';
        service.pointStyle.font = '15px serif';

        const expectCallTimes = 2;
        const changeTileSizeSpy = spyOn(service, 'changeTileSize').and.callThrough();

        service.decreaseTileSize(letterStep, pointStep, minValue);

        expect(changeTileSizeSpy).toHaveBeenCalledTimes(expectCallTimes);
    });

    it(' decreaseTileSize should not call changeTileSize if minValue is reach  ', () => {
        const letterStep = 1;
        const pointStep = 1;
        const minValue = 100;

        service.letterStyle.font = '30px serif';
        service.pointStyle.font = '15px serif';

        const changeTileSizeSpy = spyOn(service, 'changeTileSize').and.callThrough();

        service.decreaseTileSize(letterStep, pointStep, minValue);

        expect(changeTileSizeSpy).not.toHaveBeenCalled();
    });

    it(' removeArrow should call fillGridPortion 1 time', () => {
        const fillGridPortionSpy = spyOn(service, 'fillGridPortion').and.callThrough();

        service.removeArrow(coord);

        expect(fillGridPortionSpy).not.toHaveBeenCalled();
    });

    it('drawArrow should call drawImage 1 time', () => {
        const img = document.getElementById('img') as HTMLImageElement;

        const drawImageSpy = spyOn(service.gridContext, 'drawImage').and.callThrough();

        service.gridContext.drawImage(img, coord.x, coord.y);

        expect(drawImageSpy).toHaveBeenCalled();
    });
});
