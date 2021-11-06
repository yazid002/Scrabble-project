/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Dictionary } from '@app/classes/dictionary';
import { ICharacter } from '@app/classes/letter';
import { PLAYER } from '@app/classes/player';
import { NOT_FOUND } from '@app/constants/common-constants';
import { KeyboardKeys } from '@app/enums/keyboard-enum';
import { GameService } from './game.service';
import { GridService } from './grid.service';
import { PlaceSelectionService } from './place-selection.service';
import { RackService } from './rack.service';
import { VerifyService } from './verify.service';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
describe('PlaceSelectionService', () => {
    let service: PlaceSelectionService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let ctxStub: CanvasRenderingContext2D;
    let ctxStubRack: CanvasRenderingContext2D;
    let verifyServiceSpy: jasmine.SpyObj<VerifyService>;
    let gameServiceSpy: GameService;

    beforeEach(() => {
        verifyServiceSpy = jasmine.createSpyObj('VerifyService', [
            'computeCoordByDirection',
            'checkAllWordsExist',
            'validatePlaceFeasibility',
            'normalizeWord',
        ]);
        const dictionary = {
            title: 'dictionnaire test',
            description: 'description de test',
            words: ['aa', 'finir', 'manger', 'rouler'],
        } as Dictionary;
        verifyServiceSpy.dictionary = dictionary;

        rackServiceSpy = jasmine.createSpyObj('RackService', ['fillRackPortion', 'isLetterOnRack']);
        gridServiceSpy = jasmine.createSpyObj('GridService', ['fillGridPortion', 'writeLetter', 'removeArrow', 'drawArrow']);

        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        ctxStubRack = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridServiceSpy.gridContext = ctxStub;
        gridServiceSpy.letterStyle = { color: 'NavajoWhite', font: '15px serif' };
        gridServiceSpy.pointStyle = { color: 'NavajoWhite', font: '10px serif' };
        gridServiceSpy.border = { squareBorderColor: 'black' };
        rackServiceSpy.rackContext = ctxStubRack;

        gameServiceSpy = jasmine.createSpyObj('GameService', ['initializePlayers', 'changeTurn']);
        gameServiceSpy.currentTurn = PLAYER.realPlayer;
        gameServiceSpy.players = [
            {
                id: PLAYER.realPlayer,
                name: 'Random name',
                rack: [
                    { name: 'A', quantity: 9, points: 1, display: 'A' },
                    { name: 'B', quantity: 2, points: 3, display: 'B' },
                    { name: 'C', quantity: 2, points: 3, display: 'C' },
                    { name: 'D', quantity: 3, points: 2, display: 'D' },
                    { name: 'E', quantity: 15, points: 1, display: 'E' },
                ],
                points: 0,
            },
        ];

        TestBed.configureTestingModule({
            providers: [
                { provide: RackService, useValue: rackServiceSpy },
                { provide: GridService, useValue: gridServiceSpy },
                { provide: VerifyService, useValue: verifyServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
            ],
        });
        service = TestBed.inject(PlaceSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getIndexOnRackFromKey should the first index of letter on rack', () => {
        const keyEvent = {
            key: 'b',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];
        service.selectedRackIndexesForPlacement = [];

        const expected = 1;
        const result = service.getIndexOnRackFromKey(keyEvent.key, rack);

        expect(result).toEqual(expected);
    });

    it('getIndexOnRackFromKey should the second index of letter on rack if it is already selected', () => {
        const keyEvent = {
            key: 'b',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];
        service.selectedRackIndexesForPlacement = [1];

        const expected = 2;
        const result = service.getIndexOnRackFromKey(keyEvent.key, rack);

        expect(result).toEqual(expected);
    });

    it('buildPlacementCommand should return empty string', () => {
        service.selectedTilesForPlacement = [];

        const expected = '';
        const result = service.buildPlacementCommand();

        expect(result).toEqual(expected);
    });

    it('buildPlacementCommand should return the right horizontal', () => {
        const coord = { x: 7, y: 7 };
        tiles[coord.y][coord.x].text = 'a';
        tiles[coord.y + 1][coord.x].text = 'b';
        tiles[coord.y + 2][coord.x].text = 'f';
        tiles[coord.y][coord.x + 1].text = 'c';
        tiles[coord.y][coord.x + 2].text = 'd';
        service.selectedTilesForPlacement = [coord, { x: coord.x + 2, y: coord.y }];

        service.direction = true;
        const expected = '!placer h8h acd';
        const result = service.buildPlacementCommand();

        expect(result).toEqual(expected);
    });

    it('buildPlacementCommand should return empty string', () => {
        const coord = { x: 7, y: 7 };
        tiles[coord.y][coord.x].text = 'a';
        tiles[coord.y + 1][coord.x].text = 'b';
        tiles[coord.y + 2][coord.x].text = 'f';
        tiles[coord.y][coord.x + 1].text = 'c';
        tiles[coord.y][coord.x + 2].text = 'd';
        service.selectedTilesForPlacement = [coord, { x: coord.x, y: coord.y + 2 }];

        service.direction = false;
        const expected = '!placer h8v abf';
        const result = service.buildPlacementCommand();

        expect(result).toEqual(expected);
    });

    it('onKeyBoardClick should get the right function from map', () => {
        let flagToCheck = NOT_FOUND;
        service.keyEventOperationMap = new Map([
            [
                KeyboardKeys.Backspace,
                () => {
                    flagToCheck = 0;
                },
            ],
            [
                KeyboardKeys.Enter,
                () => {
                    flagToCheck = 1;
                },
            ],
            [
                KeyboardKeys.Escape,
                () => {
                    flagToCheck = 2;
                },
            ],
        ]);
        const keyEvent = {
            key: KeyboardKeys.Escape,
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        verifyServiceSpy.normalizeWord.and.returnValue('escape');

        service.onKeyBoardClick(keyEvent, rack);

        expect(flagToCheck).toEqual(2);
    });

    it('onKeyBoardClick should not get the right function from map', () => {
        let flagToCheck = NOT_FOUND;
        service.keyEventOperationMap = new Map([
            [
                KeyboardKeys.Backspace,
                () => {
                    flagToCheck = 0;
                },
            ],
            [
                KeyboardKeys.Enter,
                () => {
                    flagToCheck = 1;
                },
            ],
            [
                KeyboardKeys.Escape,
                () => {
                    flagToCheck = 2;
                },
            ],
        ]);
        const keyEvent = {
            key: KeyboardKeys.ArrowLeft,
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        verifyServiceSpy.normalizeWord.and.returnValue('arrowLeft');

        service.onKeyBoardClick(keyEvent, rack);

        expect(flagToCheck).toEqual(NOT_FOUND);
    });

    it('onKeyBoardClick should call placeOnBoard', () => {
        let flagToCheck = NOT_FOUND;
        service.keyEventOperationMap = new Map([
            [
                KeyboardKeys.Backspace,
                () => {
                    flagToCheck = 0;
                },
            ],
            [
                KeyboardKeys.Enter,
                () => {
                    flagToCheck = 1;
                },
            ],
            [
                KeyboardKeys.Escape,
                () => {
                    flagToCheck = 2;
                },
            ],
        ]);
        const keyEvent = {
            key: 'e',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        verifyServiceSpy.normalizeWord.and.returnValue('e');

        const placeOnBoardSpy = spyOn(service, 'placeOnBoard').and.callThrough();

        service.onKeyBoardClick(keyEvent, rack);

        expect(flagToCheck).toEqual(NOT_FOUND);
        expect(placeOnBoardSpy).toHaveBeenCalled();
    });

    it('placeOnBoard should not place on board', () => {
        const keyEvent = {
            key: KeyboardKeys.Escape,
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        verifyServiceSpy.normalizeWord.and.returnValue('e');

        const checkPlacementFeasibilitySpy = spyOn(service, 'checkPlacementFeasibility').and.returnValue(false);
        const moveToNextEmptyTileSpy = spyOn(service, 'moveToNextEmptyTile').and.callThrough();

        service.placeOnBoard(keyEvent.key, 'blue', rack);
        expect(checkPlacementFeasibilitySpy).toHaveBeenCalled();
        expect(moveToNextEmptyTileSpy).not.toHaveBeenCalled();
    });
    it('placeOnBoard should place on board', () => {
        const keyEvent = {
            key: KeyboardKeys.Escape,
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        verifyServiceSpy.normalizeWord.and.returnValue('e');

        const checkPlacementFeasibilitySpy = spyOn(service, 'checkPlacementFeasibility').and.returnValue(true);
        const moveToNextEmptyTileSpy = spyOn(service, 'moveToNextEmptyTile').and.returnValue(void '');

        service.placeOnBoard(keyEvent.key, 'blue', rack);
        expect(checkPlacementFeasibilitySpy).toHaveBeenCalled();
        expect(moveToNextEmptyTileSpy).toHaveBeenCalled();
        expect(gridServiceSpy.writeLetter).toHaveBeenCalled();
        expect(rackServiceSpy.fillRackPortion).toHaveBeenCalled();
    });

    it('checkPlacementFeasibility should return false 1', () => {
        const coord = { x: 1, y: 1 };
        const index = -1;

        const areCoordValidSpy = spyOn(service, 'areCoordValid').and.callThrough();

        const result = service.checkPlacementFeasibility(coord, index);
        expect(result).toEqual(false);
        expect(areCoordValidSpy).not.toHaveBeenCalled();
    });

    it('checkPlacementFeasibility should return false 2', () => {
        const coord = { x: 1, y: 1 };
        const index = 2;

        spyOn(service, 'areCoordValid').and.returnValue(false);
        const isTileAlreadySelectedSpy = spyOn(service, 'isTileAlreadySelected').and.callThrough();

        const result = service.checkPlacementFeasibility(coord, index);
        expect(result).toEqual(false);
        expect(isTileAlreadySelectedSpy).not.toHaveBeenCalled();
    });

    it('checkPlacementFeasibility should return false 3', () => {
        const coord = { x: 1, y: 1 };
        const index = 2;

        spyOn(service, 'areCoordValid').and.returnValue(true);
        const isTileAlreadySelectedSpy = spyOn(service, 'isTileAlreadySelected').and.returnValue(true);

        const result = service.checkPlacementFeasibility(coord, index);
        expect(result).toEqual(false);
        expect(isTileAlreadySelectedSpy).toHaveBeenCalled();
    });

    it('incrementNextCoord should go to the next coord empty', () => {
        const coord = { x: 7, y: 7 };
        tiles[coord.y][coord.x].text = 'a';
        tiles[coord.y + 1][coord.x].text = 'b';
        tiles[coord.y + 2][coord.x].text = 'f';
        tiles[coord.y][coord.x + 1].text = 'c';
        tiles[coord.y][coord.x + 2].text = 'd';
        service.direction = true;

        const expectedX = 10;

        const result = service.incrementNextCoord(coord);
        expect(result).toEqual({ x: expectedX, y: coord.y });
    });

    it('incrementNextCoord should go to the next coord empty vertical', () => {
        const coord = { x: 7, y: 7 };
        tiles[coord.y][coord.x].text = 'a';
        tiles[coord.y + 1][coord.x].text = 'b';
        tiles[coord.y + 2][coord.x].text = 'f';
        tiles[coord.y][coord.x + 1].text = 'c';
        tiles[coord.y][coord.x + 2].text = 'd';
        service.direction = false;

        const expectedY = 10;

        const result = service.incrementNextCoord(coord);
        expect(result).toEqual({ x: coord.x, y: expectedY });
    });

    it('cancelUniqueBoardClick should cancel only one selection', () => {
        const coord = { x: 7, y: 7 };
        tiles[coord.y][coord.x].text = 'a';
        tiles[coord.y + 1][coord.x].text = 'b';
        tiles[coord.y + 2][coord.x].text = 'f';
        tiles[coord.y][coord.x + 1].text = 'c';
        tiles[coord.y][coord.x + 2].text = 'd';
        service.direction = false;
        service.selectedTilesForPlacement = [coord, { x: coord.x, y: coord.y + 1 }];

        service.cancelUniqueBoardClick();
        expect(service.selectedTilesForPlacement.length).toEqual(1);
    });

    it('cancelUniqueBoardClick should cancel only one selection', () => {
        const coord = { x: 7, y: 7 };
        tiles[coord.y][coord.x].text = 'a';
        tiles[coord.y + 1][coord.x].text = 'b';
        tiles[coord.y + 2][coord.x].text = 'f';
        tiles[coord.y][coord.x + 1].text = 'c';
        tiles[coord.y][coord.x + 2].text = 'd';
        service.direction = false;
        service.selectedTilesForPlacement = [coord, { x: coord.x, y: coord.y + 1 }];

        service.cancelUniqueBoardClick();
        expect(service.selectedTilesForPlacement.length).toEqual(1);
        expect(gridServiceSpy.removeArrow).toHaveBeenCalledTimes(1);
        expect(gridServiceSpy.drawArrow).toHaveBeenCalledTimes(1);
    });
});
