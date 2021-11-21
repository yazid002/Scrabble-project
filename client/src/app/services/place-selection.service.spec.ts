/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Dictionary } from '@app/classes/dictionary';
import { ICharacter } from '@app/classes/letter';
import { PLAYER } from '@app/classes/player';
import { SQUARE_NUMBER, SQUARE_WIDTH } from '@app/constants/board-constants';
import { NOT_FOUND } from '@app/constants/common-constants';
import { KeyboardKeys } from '@app/enums/keyboard-enum';
import { MouseButton } from '@app/enums/mouse-enums';
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
            'areCoordValid',
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
                turnWithoutSkipAndExchangeCounter: 0,
                placeInTenSecondsGoalCounter: 0,
                words: [],
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

    it('getIndexOnRackFromKey return should the first index of letter on rack', () => {
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

    it('getIndexOnRackFromKey should the third index of letter on rack (*)', () => {
        const keyEvent = {
            key: 'B',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: '*', quantity: 2, points: 0, display: '*' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];
        service.selectedRackIndexesForPlacement = [1];

        const expected = 3;
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

    it('buildPlacementCommand should return the right vertical', () => {
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
    describe('onKeyBoardClick', () => {
        let cancelUniqueSelectionFromRackSpy: jasmine.Spy<() => void>;
        let cancelUniqueBoardClickSpy: jasmine.Spy<() => void>;
        let buildPlacementCommandSpy: jasmine.Spy<() => void>;
        let cancelPlacementSpy: jasmine.Spy<() => void>;
        let flagToCheck: string;

        beforeEach(() => {
            service = TestBed.inject(PlaceSelectionService);
            flagToCheck = 'NOT_FOUND';
            cancelUniqueSelectionFromRackSpy = spyOn(service, 'cancelUniqueSelectionFromRack').and.callFake(() => {
                flagToCheck = 'cancelUniqueSelectionFromRack';
            });

            cancelUniqueBoardClickSpy = spyOn(service, 'cancelUniqueBoardClick').and.callFake(() => {
                flagToCheck += 'cancelUniqueBoardClick';
            });

            buildPlacementCommandSpy = spyOn(service, 'buildPlacementCommand').and.callFake(() => {
                flagToCheck = 'buildPlacementCommand';
                return flagToCheck;
            });

            cancelPlacementSpy = spyOn(service, 'cancelPlacement').and.callFake(() => {
                flagToCheck = 'cancelPlacement';
            });
        });

        it('onKeyBoardClick should not get the right function from map', () => {
            flagToCheck = 'NOT_FOUND';
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

            expect(flagToCheck).toEqual('NOT_FOUND');
            expect(cancelUniqueSelectionFromRackSpy).not.toHaveBeenCalled();
            expect(cancelUniqueBoardClickSpy).not.toHaveBeenCalled();
            expect(buildPlacementCommandSpy).not.toHaveBeenCalled();
            expect(cancelPlacementSpy).not.toHaveBeenCalled();
        });

        it('onKeyBoardClick should cancelUniqueSelection', () => {
            flagToCheck = 'NOT_FOUND';
            const keyEvent = {
                key: KeyboardKeys.Backspace,
                preventDefault: () => void '',
            } as KeyboardEvent;

            const rack: ICharacter[] = [
                { name: 'E', quantity: 15, points: 1, display: 'E' },
                { name: 'B', quantity: 0, points: 3, display: 'B' },
                { name: 'B', quantity: 0, points: 3, display: 'B' },
                { name: 'D', quantity: 3, points: 2, display: 'D' },
                { name: 'E', quantity: 15, points: 1, display: 'E' },
            ];

            verifyServiceSpy.normalizeWord.and.returnValue('backspace');

            service.onKeyBoardClick(keyEvent, rack);

            expect(flagToCheck).toEqual('cancelUniqueSelectionFromRackcancelUniqueBoardClick');
            expect(cancelUniqueSelectionFromRackSpy).toHaveBeenCalled();
            expect(cancelUniqueBoardClickSpy).toHaveBeenCalled();
            expect(buildPlacementCommandSpy).not.toHaveBeenCalled();
            expect(cancelPlacementSpy).not.toHaveBeenCalled();
        });

        it('onKeyBoardClick should buildPlacementCommand', () => {
            flagToCheck = 'NOT_FOUND';
            const keyEvent = {
                key: KeyboardKeys.Enter,
                preventDefault: () => void '',
            } as KeyboardEvent;

            const rack: ICharacter[] = [
                { name: 'E', quantity: 15, points: 1, display: 'E' },
                { name: 'B', quantity: 0, points: 3, display: 'B' },
                { name: 'B', quantity: 0, points: 3, display: 'B' },
                { name: 'D', quantity: 3, points: 2, display: 'D' },
                { name: 'E', quantity: 15, points: 1, display: 'E' },
            ];

            verifyServiceSpy.normalizeWord.and.returnValue('enter');

            service.onKeyBoardClick(keyEvent, rack);

            expect(flagToCheck).toEqual('buildPlacementCommand');
            expect(cancelUniqueSelectionFromRackSpy).not.toHaveBeenCalled();
            expect(cancelUniqueBoardClickSpy).not.toHaveBeenCalled();
            expect(buildPlacementCommandSpy).toHaveBeenCalled();
            expect(cancelPlacementSpy).not.toHaveBeenCalled();
        });

        it('onKeyBoardClick should call cancelPlacement', () => {
            flagToCheck = 'NOT_FOUND';
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

            expect(flagToCheck).toEqual('cancelPlacement');
            expect(cancelUniqueSelectionFromRackSpy).not.toHaveBeenCalled();
            expect(cancelUniqueBoardClickSpy).not.toHaveBeenCalled();
            expect(buildPlacementCommandSpy).not.toHaveBeenCalled();
            expect(cancelPlacementSpy).toHaveBeenCalled();
        });

        it('onKeyBoardClick should call placeOnBoard', () => {
            flagToCheck = 'NOT_FOUND';
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

            expect(flagToCheck).toEqual('NOT_FOUND');
            expect(placeOnBoardSpy).toHaveBeenCalled();
            expect(cancelUniqueSelectionFromRackSpy).not.toHaveBeenCalled();
            expect(cancelUniqueBoardClickSpy).not.toHaveBeenCalled();
            expect(buildPlacementCommandSpy).not.toHaveBeenCalled();
            expect(cancelPlacementSpy).not.toHaveBeenCalled();
        });
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
        const result = service.checkPlacementFeasibility(coord, index);
        expect(result).toEqual(false);
        expect(verifyServiceSpy.areCoordValid).not.toHaveBeenCalled();
    });

    it('checkPlacementFeasibility should return false 2', () => {
        const coord = { x: 1, y: 1 };
        const index = 2;

        verifyServiceSpy.areCoordValid.and.returnValue(false);
        const isTileAlreadySelectedSpy = spyOn(service, 'isTileAlreadySelected').and.callThrough();

        const result = service.checkPlacementFeasibility(coord, index);
        expect(result).toEqual(false);
        expect(isTileAlreadySelectedSpy).not.toHaveBeenCalled();
    });

    it('checkPlacementFeasibility should return false 3', () => {
        const coord = { x: 1, y: 1 };
        const index = 2;

        verifyServiceSpy.areCoordValid.and.returnValue(true);
        const isTileAlreadySelectedSpy = spyOn(service, 'isTileAlreadySelected').and.returnValue(true);

        const result = service.checkPlacementFeasibility(coord, index);
        expect(result).toEqual(false);
        expect(isTileAlreadySelectedSpy).toHaveBeenCalled();
    });

    it('checkPlacementFeasibility should return true', () => {
        const coord = { x: 1, y: 1 };
        const index = 2;

        verifyServiceSpy.areCoordValid.and.returnValue(true);
        spyOn(service, 'isTileAlreadySelected').and.returnValue(false);

        const result = service.checkPlacementFeasibility(coord, index);
        expect(result).toEqual(true);
    });

    it('incrementNextCoord should go to the next coord empty', () => {
        const coord = { x: 7, y: 7 };
        tiles[coord.y][coord.x].text = 'a';
        tiles[coord.y + 1][coord.x].text = 'b';
        tiles[coord.y + 2][coord.x].text = 'f';
        tiles[coord.y + 3][coord.x].text = '';
        tiles[coord.y][coord.x + 1].text = 'c';
        tiles[coord.y][coord.x + 2].text = 'd';
        tiles[coord.y][coord.x + 3].text = '';
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
        tiles[coord.y + 3][coord.x].text = '';
        tiles[coord.y][coord.x + 1].text = 'c';
        tiles[coord.y][coord.x + 2].text = 'd';
        tiles[coord.y][coord.x + 3].text = '';
        service.direction = false;

        const expectedY = 10;
        tiles[expectedY][coord.x].text = '';

        const result = service.incrementNextCoord(coord);
        expect(result).toEqual({ x: coord.x, y: expectedY });
    });

    it('incrementNextCoord should go to the next coord empty if we are at the bottom but write horizontally', () => {
        const coord = { x: 7, y: 14 };
        tiles[coord.y][coord.x].text = 'a';
        tiles[coord.y][coord.x + 1].text = 'a=';
        service.direction = true;

        const expectedX = 8;

        const result = service.incrementNextCoord(coord);
        expect(result).toEqual({ x: expectedX, y: coord.y });
    });

    it('incrementNextCoord should return the current coords if the placement cannot go further horizontally', () => {
        const coord = { x: SQUARE_NUMBER - 1, y: 7 };
        service.direction = true;

        const result = service.incrementNextCoord(coord);
        expect(result).toEqual({ x: coord.x, y: coord.y });
    });

    it('incrementNextCoord should return the current coords if the placement cannot go further vertically', () => {
        const coord = { x: 7, y: SQUARE_NUMBER - 1 };
        service.direction = false;

        const result = service.incrementNextCoord(coord);
        expect(result).toEqual({ x: coord.x, y: coord.y });
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

    it('cancelUniqueBoardClick should call fillGridPortion, remove and draw arrow one time each', () => {
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
        expect(gridServiceSpy.fillGridPortion).toHaveBeenCalledTimes(1);
    });

    it('cancelUniqueBoardClick should remove arrow and reinitialize selected coord if there is selection but there is no letter placed', () => {
        const coord = { x: 7, y: 7 };
        service.selectedCoord = coord;

        service.direction = false;
        service.selectedTilesForPlacement = [];

        const expectedTimes = 2;
        const expectedCoords = { x: NOT_FOUND, y: NOT_FOUND };

        service.cancelUniqueBoardClick();
        expect(gridServiceSpy.removeArrow).toHaveBeenCalledTimes(expectedTimes);
        expect(gridServiceSpy.drawArrow).not.toHaveBeenCalled();
        expect(service.selectedCoord).toEqual(expectedCoords);
    });

    it('checkBoardClickFeasibility should return false if the tile is not empty', () => {
        const coord = { x: 7, y: 7 };
        tiles[coord.y][coord.x].letter = 'a';

        service.direction = false;
        service.selectedTilesForPlacement = [];

        const result = service.checkBoardClickFeasibility(coord, true);

        expect(result).toEqual(false);
    });

    it('checkBoardClickFeasibility should return false if the coord.y is not valid', () => {
        const coord = { x: 0, y: NOT_FOUND };

        service.direction = false;
        service.selectedTilesForPlacement = [];

        const result = service.checkBoardClickFeasibility(coord, true);

        expect(result).toEqual(false);
    });

    it('checkBoardClickFeasibility should return false if the coord.x is not valid', () => {
        const coord = { x: NOT_FOUND, y: 0 };

        service.direction = false;
        service.selectedTilesForPlacement = [];

        const result = service.checkBoardClickFeasibility(coord, true);

        expect(result).toEqual(false);
    });

    it('checkBoardClickFeasibility should return false if we try to change direction after a placement', () => {
        const coord = { x: 7, y: 0 };

        service.direction = true;
        service.selectedRackIndexesForPlacement = [1];

        const result = service.checkBoardClickFeasibility(coord, true);

        expect(result).toEqual(false);
    });

    it('checkBoardClickFeasibility should return true', () => {
        const coord = { x: 7, y: 7 };
        tiles[coord.y][coord.x].letter = '';

        service.direction = false;
        service.selectedTilesForPlacement = [];

        const result = service.checkBoardClickFeasibility(coord, true);

        expect(result).toEqual(true);
    });

    it('hideOperation should return true if there is no placement', () => {
        service.selectedRackIndexesForPlacement = [];

        const result = service.hideOperation();

        expect(result).toEqual(true);
    });

    it('hideOperation should return false if there is a placement', () => {
        service.selectedRackIndexesForPlacement = [1];

        const result = service.hideOperation();

        expect(result).toEqual(false);
    });

    it('onBoardClick should not select tile if the placement is not feasible', () => {
        const coord = { x: 7, y: 7 };
        spyOn(service, 'checkBoardClickFeasibility').and.returnValue(false);
        const event = {
            button: MouseButton.Right,
            offsetX: coord.x * SQUARE_WIDTH,
            offsetY: coord.y * SQUARE_WIDTH,
        } as MouseEvent;

        service.onBoardClick(event, true);

        expect(gridServiceSpy.drawArrow).not.toHaveBeenCalled();
        expect(gridServiceSpy.removeArrow).not.toHaveBeenCalled();
    });

    it('onBoardClick should not select draw without removing arrow if it is the first click', () => {
        const coord = { x: 7, y: 7 };
        spyOn(service, 'checkBoardClickFeasibility').and.returnValue(true);
        service.selectedCoord = { x: NOT_FOUND, y: NOT_FOUND };
        const event = {
            button: MouseButton.Right,
            offsetX: coord.x * SQUARE_WIDTH,
            offsetY: coord.y * SQUARE_WIDTH,
        } as MouseEvent;

        service.onBoardClick(event, true);

        expect(gridServiceSpy.drawArrow).toHaveBeenCalled();
        expect(gridServiceSpy.removeArrow).not.toHaveBeenCalled();
    });

    it('onBoardClick should reinitialize direction and removeArrow if we click on another tile without any placement', () => {
        const coord = { x: 7, y: 7 };
        spyOn(service, 'checkBoardClickFeasibility').and.returnValue(true);
        service.selectedCoord = { x: coord.x, y: coord.y - 1 };
        const event = {
            button: MouseButton.Right,
            offsetX: coord.x * SQUARE_WIDTH,
            offsetY: coord.y * SQUARE_WIDTH,
        } as MouseEvent;
        service.direction = false;

        service.onBoardClick(event, true);

        expect(gridServiceSpy.drawArrow).toHaveBeenCalled();
        expect(gridServiceSpy.removeArrow).toHaveBeenCalled();
        expect(service.direction).toEqual(true);
    });

    it('onBoardClick should change direction and removeArrow if we click on the same tile', () => {
        const coord = { x: 7, y: 7 };
        spyOn(service, 'checkBoardClickFeasibility').and.returnValue(true);
        service.selectedCoord = { x: coord.x, y: coord.y };
        const event = {
            button: MouseButton.Right,
            offsetX: coord.x * SQUARE_WIDTH,
            offsetY: coord.y * SQUARE_WIDTH,
        } as MouseEvent;
        service.direction = true;

        service.onBoardClick(event, true);

        expect(gridServiceSpy.drawArrow).toHaveBeenCalled();
        expect(gridServiceSpy.removeArrow).toHaveBeenCalled();
        expect(service.direction).toEqual(false);
    });

    it('onBoardClick should not reinitialize direction and removeArrow if we click on another tile after a placement', () => {
        const coord = { x: 7, y: 7 };
        spyOn(service, 'checkBoardClickFeasibility').and.returnValue(true);
        service.selectedCoord = { x: coord.x, y: coord.y - 1 };
        const event = {
            button: MouseButton.Right,
            offsetX: coord.x * SQUARE_WIDTH,
            offsetY: coord.y * SQUARE_WIDTH,
        } as MouseEvent;
        service.direction = false;

        service.onBoardClick(event, false);

        expect(gridServiceSpy.drawArrow).toHaveBeenCalled();
        expect(gridServiceSpy.removeArrow).toHaveBeenCalled();
        expect(service.direction).toEqual(false);
    });

    it('cancelPlacement should cancel placement while there is a placement', () => {
        const coord = { x: 7, y: 7 };

        service.selectedRackIndexesForPlacement = [1, 2];
        service.selectedTilesForPlacement = [coord, { x: coord.x, y: coord.y + 1 }];
        service.selectedCoord = { x: coord.x, y: coord.y + 2 };

        const cancelUniqueSelectionFromRackSpy = spyOn(service, 'cancelUniqueSelectionFromRack').and.callThrough();
        const cancelUniqueBoardClickSpy = spyOn(service, 'cancelUniqueBoardClick').and.callThrough();
        const expectedCallTimes = 2;
        service.cancelPlacement();

        expect(cancelUniqueSelectionFromRackSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(cancelUniqueBoardClickSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('cancelUniqueSelectionFromRack should not call fillRackPortion if there is no selection', () => {
        service.selectedRackIndexesForPlacement = [];

        service.cancelUniqueSelectionFromRack();

        expect(rackServiceSpy.fillRackPortion).not.toHaveBeenCalled();
    });

    it('cancelUniqueSelectionFromRack should cancel only one selection', () => {
        service.selectedRackIndexesForPlacement = [1, 2];
        const expectedResult = [1];

        service.cancelUniqueSelectionFromRack();

        expect(rackServiceSpy.fillRackPortion).toHaveBeenCalledTimes(1);
        expect(service.selectedRackIndexesForPlacement).toEqual(expectedResult);
    });

    it('moveToNextEmptyTile should not call onBoardClick if the nextCoord is the same than the current one', () => {
        const coord = { x: 7, y: 7 };

        spyOn(service, 'incrementNextCoord').and.returnValue(coord);
        const onBoardClickSpy = spyOn(service, 'onBoardClick').and.callThrough();

        service.moveToNextEmptyTile(coord);

        expect(onBoardClickSpy).not.toHaveBeenCalled();
    });

    it('moveToNextEmptyTile should call onBoardClick if the nextCoord is not the same than the current one', () => {
        const coord = { x: 7, y: 7 };

        spyOn(service, 'incrementNextCoord').and.returnValue({ x: coord.x, y: coord.y + 1 });
        const onBoardClickSpy = spyOn(service, 'onBoardClick').and.callThrough();

        service.moveToNextEmptyTile(coord);

        expect(onBoardClickSpy).toHaveBeenCalled();
    });

    it('isTileAlreadySelected should return true', () => {
        const coord = { x: 7, y: 7 };

        service.selectedTilesForPlacement = [coord];

        const result = service.isTileAlreadySelected(coord);

        expect(result).toEqual(true);
    });

    it('isTileAlreadySelected should return true', () => {
        const coord = { x: 7, y: 7 };

        service.selectedTilesForPlacement = [];

        const result = service.isTileAlreadySelected(coord);

        expect(result).toEqual(false);
    });

    it('getClickCoords the right coords', () => {
        const coord = { x: 9, y: 7 };
        const event = {
            button: MouseButton.Right,
            offsetX: coord.x * SQUARE_WIDTH,
            offsetY: coord.y * SQUARE_WIDTH,
        } as MouseEvent;

        const result = service.getClickCoords(event);

        expect(result).toEqual(coord);
    });

    it('getClickCoords not found', () => {
        const coord = { x: 15, y: 7 };
        const event = {
            button: MouseButton.Right,
            offsetX: coord.x * SQUARE_WIDTH,
            offsetY: coord.y * SQUARE_WIDTH,
        } as MouseEvent;

        const result = service.getClickCoords(event);

        expect(result).toEqual({ x: NOT_FOUND, y: NOT_FOUND });
    });
});
