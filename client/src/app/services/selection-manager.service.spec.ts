/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { PLAYER } from '@app/classes/player';
import { SQUARE_WIDTH } from '@app/constants/board-constants';
import { NOT_FOUND } from '@app/constants/common-constants';
import { MouseButton } from '@app/enums/mouse-enums';
import { SelectionType } from '@app/enums/selection-enum';
import { BehaviorSubject } from 'rxjs';
import { ExchangeSelectionService } from './exchange-selection.service';
import { GameService } from './game.service';
import { PlaceSelectionService } from './place-selection.service';
import { RackLettersManipulationService } from './rack-letters-manipulation.service';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';
import { SelectionManagerService } from './selection-manager.service';
import { SelectionUtilsService } from './selection-utils.service';
import { TimerService } from './timer.service';

describe('SelectionManagerService', () => {
    let service: SelectionManagerService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let selectionUtilsServiceSpy: jasmine.SpyObj<SelectionUtilsService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let timerServiceSpy: jasmine.SpyObj<TimerService>;
    let placeSelectionServiceSpy: jasmine.SpyObj<PlaceSelectionService>;
    let rackLettersManipulationServiceSpy: jasmine.SpyObj<RackLettersManipulationService>;
    let reserveServiceSpy: jasmine.SpyObj<ReserveService>;
    let exchangeSelectionServiceSpy: jasmine.SpyObj<ExchangeSelectionService>;

    beforeEach(() => {
        rackServiceSpy = jasmine.createSpyObj('RackService', ['fillRackPortion', 'isLetterOnRack']);
        selectionUtilsServiceSpy = jasmine.createSpyObj('SelectionUtilsService', ['getMouseClickIndex']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['initializePlayers', 'changeTurn']);
        timerServiceSpy = jasmine.createSpyObj('TimerService', ['startTimer']);
        placeSelectionServiceSpy = jasmine.createSpyObj('PlaceSelectionService', [
            'hideOperation',
            'cancelPlacement',
            'onBoardClick',
            'onKeyBoardClick',
        ]);
        rackLettersManipulationServiceSpy = jasmine.createSpyObj('RackLettersManipulationService', [
            'onKeyBoardClick',
            'cancelManipulation',
            'getIndexFromKey',
            'onMouseLeftClick',
        ]);
        selectionUtilsServiceSpy = jasmine.createSpyObj('SelectionUtilsService', ['getSelectedLetters', 'getMouseClickIndex']);
        exchangeSelectionServiceSpy = jasmine.createSpyObj('ExchangeSelectionService', [
            'hideOperation',
            'cancelExchange',
            'onMouseRightClick',
            'isLetterAlreadySelected',
            'buildExchangeCommand',
        ]);
        reserveServiceSpy = jasmine.createSpyObj('ReserveService', ['getQuantityOfAvailableLetters']);

        timerServiceSpy.timerDone = new BehaviorSubject<boolean>(true);

        reserveServiceSpy.alphabets = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 2, points: 3, display: 'B' },
            { name: 'C', quantity: 2, points: 3, display: 'C' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'F', quantity: 2, points: 4, display: 'F' },
            { name: 'G', quantity: 2, points: 4, display: 'G' },
            { name: 'H', quantity: 2, points: 4, display: 'H' },
        ];

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
                { provide: SelectionUtilsService, useValue: selectionUtilsServiceSpy },
                { provide: ReserveService, useValue: reserveServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: PlaceSelectionService, useValue: placeSelectionServiceSpy },
                { provide: TimerService, useValue: timerServiceSpy },
                { provide: RackLettersManipulationService, useValue: rackLettersManipulationServiceSpy },
                { provide: ExchangeSelectionService, useValue: exchangeSelectionServiceSpy },
            ],
        });
        service = TestBed.inject(SelectionManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('updateSelectionType should set the selection type', () => {
        service.updateSelectionType(SelectionType.Grid);
        expect(service.selectionType).toEqual(SelectionType.Grid);
    });

    it('onLeftClick should get the right function from map', () => {
        let flagToCheck = NOT_FOUND;
        service.onLeftClickSelectionTypeMapping = new Map([
            [
                SelectionType.Grid,
                () => {
                    flagToCheck = 0;
                },
            ],
            [
                SelectionType.Rack,
                () => {
                    flagToCheck = 1;
                },
            ],
        ]);
        const casePosition = 3;
        const event = {
            button: MouseButton.Left,
            offsetX: casePosition * SQUARE_WIDTH,
            offsetY: casePosition * SQUARE_WIDTH,
        } as MouseEvent;

        service.selectionType = SelectionType.Rack;
        service.onLeftClick(event);

        expect(flagToCheck).toEqual(1);
    });

    it('onLeftClick should cancel all selection', () => {
        let flagToCheck = NOT_FOUND;
        service.onLeftClickSelectionTypeMapping = new Map([
            [
                SelectionType.Grid,
                () => {
                    flagToCheck = 0;
                },
            ],
            [
                SelectionType.Rack,
                () => {
                    flagToCheck = 1;
                },
            ],
        ]);
        const casePosition = 3;
        const event = {
            button: MouseButton.Left,
            offsetX: casePosition * SQUARE_WIDTH,
            offsetY: casePosition * SQUARE_WIDTH,
        } as MouseEvent;

        service.selectionType = SelectionType.None;
        service.onLeftClick(event);

        expect(flagToCheck).toEqual(NOT_FOUND);
        expect(rackLettersManipulationServiceSpy.cancelManipulation).toHaveBeenCalled();
        expect(exchangeSelectionServiceSpy.cancelExchange).toHaveBeenCalled();
        expect(placeSelectionServiceSpy.cancelPlacement).toHaveBeenCalled();
    });

    it('handleGridSelectionOnLeftClick should select board and cancel other selections ', () => {
        const casePosition = 3;
        const event = {
            button: MouseButton.Left,
            offsetX: casePosition * SQUARE_WIDTH,
            offsetY: casePosition * SQUARE_WIDTH,
        } as MouseEvent;

        gameServiceSpy.currentTurn = PLAYER.realPlayer;
        service.handleGridSelectionOnLeftClick(event);

        expect(rackLettersManipulationServiceSpy.cancelManipulation).toHaveBeenCalled();
        expect(exchangeSelectionServiceSpy.cancelExchange).toHaveBeenCalled();
        expect(placeSelectionServiceSpy.onBoardClick).toHaveBeenCalledWith(event, true);
    });

    it('handleGridSelectionOnLeftClick should not select board and cancel other selections if it is not my turn', () => {
        const casePosition = 3;
        const event = {
            button: MouseButton.Left,
            offsetX: casePosition * SQUARE_WIDTH,
            offsetY: casePosition * SQUARE_WIDTH,
        } as MouseEvent;

        gameServiceSpy.currentTurn = PLAYER.otherPlayer;

        service.handleGridSelectionOnLeftClick(event);

        expect(rackLettersManipulationServiceSpy.cancelManipulation).not.toHaveBeenCalled();
        expect(exchangeSelectionServiceSpy.cancelExchange).not.toHaveBeenCalled();
        expect(placeSelectionServiceSpy.onBoardClick).not.toHaveBeenCalledWith(event, true);
    });

    it('handleRackSelectionOnLeftClick should select letter for manipulation if letter is not selected for exchange', () => {
        const casePosition = 3;
        const event = {
            button: MouseButton.Left,
            offsetX: casePosition * SQUARE_WIDTH,
            offsetY: casePosition * SQUARE_WIDTH,
        } as MouseEvent;

        const isLetterClickAlreadySelectedForExchangeSpy = spyOn(service, 'isLetterClickAlreadySelectedForExchange').and.returnValue(false);

        service.handleRackSelectionOnLeftClick(event);

        expect(isLetterClickAlreadySelectedForExchangeSpy).toHaveBeenCalled();
        expect(exchangeSelectionServiceSpy.cancelExchange).toHaveBeenCalled();
        expect(placeSelectionServiceSpy.cancelPlacement).toHaveBeenCalledWith();
        expect(rackLettersManipulationServiceSpy.onMouseLeftClick).toHaveBeenCalled();
    });
    it(' handleNoneSelectionOnLeftClick should call cancelPlacement and cancelManipulation', () => {
        service.handleNoneSelectionOnLeftClick();

        expect(placeSelectionServiceSpy.cancelPlacement).toHaveBeenCalled();
        expect(rackLettersManipulationServiceSpy.cancelManipulation).toHaveBeenCalled();
    });
    it(' handleNoneSelectionOnLeftClick should update selectionType and not call cancelExchange', () => {
        exchangeSelectionServiceSpy.hideOperation.and.returnValue(true);
        exchangeSelectionServiceSpy.cancelExchange.and.returnValue(void '');
        service.selectionType = SelectionType.Grid;
        service.handleNoneSelectionOnLeftClick();

        expect(service.selectionType).toEqual(2);
        expect(exchangeSelectionServiceSpy.cancelExchange).not.toHaveBeenCalled();
    });
    it(' handleNoneSelectionOnLeftClick should not update selectionType and should call cancelExchange', () => {
        exchangeSelectionServiceSpy.hideOperation.and.returnValue(false);
        exchangeSelectionServiceSpy.cancelExchange.and.returnValue(void '');
        service.selectionType = SelectionType.Grid;
        service.handleNoneSelectionOnLeftClick();

        expect(service.selectionType).toEqual(SelectionType.Grid);
        expect(exchangeSelectionServiceSpy.cancelExchange).toHaveBeenCalled();
    });

    it('onRightClick should not call cancelExchange', () => {
        const coord = { x: 7, y: 7 };
        const event = {
            button: MouseButton.Right,
            offsetX: coord.x * SQUARE_WIDTH,
            offsetY: coord.y * SQUARE_WIDTH,
            preventDefault: () => void '',
        } as MouseEvent;

        exchangeSelectionServiceSpy.onMouseRightClick.and.returnValue(void '');
        exchangeSelectionServiceSpy.cancelExchange.and.returnValue(void '');
        rackLettersManipulationServiceSpy.cancelManipulation.and.returnValue(NOT_FOUND);

        service.selectionType = SelectionType.Rack;
        service.onRightClick(event);

        expect(exchangeSelectionServiceSpy.cancelExchange).not.toHaveBeenCalled();
        expect(exchangeSelectionServiceSpy.onMouseRightClick).toHaveBeenCalled();
        expect(rackLettersManipulationServiceSpy.cancelManipulation).toHaveBeenCalled();
    });

    it('onRightClick should call cancelExchange', () => {
        const coord = { x: 7, y: 7 };
        const event = {
            button: MouseButton.Right,
            offsetX: coord.x * SQUARE_WIDTH,
            offsetY: coord.y * SQUARE_WIDTH,
            preventDefault: () => void '',
        } as MouseEvent;

        exchangeSelectionServiceSpy.onMouseRightClick.and.returnValue(void '');
        exchangeSelectionServiceSpy.cancelExchange.and.returnValue(void '');
        rackLettersManipulationServiceSpy.cancelManipulation.and.returnValue(NOT_FOUND);

        service.selectionType = SelectionType.Grid;
        service.onRightClick(event);

        expect(exchangeSelectionServiceSpy.cancelExchange).toHaveBeenCalled();
        expect(exchangeSelectionServiceSpy.onMouseRightClick).not.toHaveBeenCalled();
        expect(rackLettersManipulationServiceSpy.cancelManipulation).not.toHaveBeenCalled();
    });
    describe('onLeftClick', () => {
        let handleGridSelectionOnLeftClickSpy: jasmine.Spy<() => void>;
        let handleRackSelectionOnLeftClickSpy: jasmine.Spy<() => void>;
        let handleNoneSelectionOnLeftClickSpy: jasmine.Spy<() => void>;
        let flagToCheck: string;

        beforeEach(() => {
            service = TestBed.inject(SelectionManagerService);
            flagToCheck = 'NOT_FOUND';
            // Car handleGridSelectionOnLeftClick privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleGridSelectionOnLeftClickSpy = spyOn<any>(service, 'handleGridSelectionOnLeftClick').and.callFake(() => {
                flagToCheck = 'handleGridSelectionOnLeftClick';
            });
            // Car handleRackSelectionOnLeftClick privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleRackSelectionOnLeftClickSpy = spyOn<any>(service, 'handleRackSelectionOnLeftClick').and.callFake(() => {
                flagToCheck = 'handleRackSelectionOnLeftClick';
            });

            // Car handleNoneSelectionOnLeftClick privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleNoneSelectionOnLeftClickSpy = spyOn<any>(service, 'handleNoneSelectionOnLeftClick').and.callFake(() => {
                flagToCheck = 'handleNoneSelectionOnLeftClick';
            });
        });

        it('onLeftClick should handleGridSelectionOnLeftClick', () => {
            flagToCheck = 'NOT_FOUND';
            const coord = { x: 7, y: 7 };
            const event = {
                button: MouseButton.Right,
                offsetX: coord.x * SQUARE_WIDTH,
                offsetY: coord.y * SQUARE_WIDTH,
            } as MouseEvent;
            service.selectionType = SelectionType.Grid;
            service.onLeftClick(event);

            expect(flagToCheck).toEqual('handleGridSelectionOnLeftClick');
            expect(handleGridSelectionOnLeftClickSpy).toHaveBeenCalled();
            expect(handleRackSelectionOnLeftClickSpy).not.toHaveBeenCalled();
            expect(handleNoneSelectionOnLeftClickSpy).not.toHaveBeenCalled();
        });

        it('onLeftClick should handleRackSelectionOnLeftClick', () => {
            flagToCheck = 'NOT_FOUND';
            const coord = { x: 7, y: 7 };
            const event = {
                button: MouseButton.Right,
                offsetX: coord.x * SQUARE_WIDTH,
                offsetY: coord.y * SQUARE_WIDTH,
            } as MouseEvent;
            service.selectionType = SelectionType.Rack;
            service.onLeftClick(event);

            expect(flagToCheck).toEqual('handleRackSelectionOnLeftClick');
            expect(handleGridSelectionOnLeftClickSpy).not.toHaveBeenCalled();
            expect(handleRackSelectionOnLeftClickSpy).toHaveBeenCalled();
            expect(handleNoneSelectionOnLeftClickSpy).not.toHaveBeenCalled();
        });

        it('onLeftClick should handleNoneSelectionOnLeftClick', () => {
            flagToCheck = 'NOT_FOUND';
            const coord = { x: 7, y: 7 };
            const event = {
                button: MouseButton.Right,
                offsetX: coord.x * SQUARE_WIDTH,
                offsetY: coord.y * SQUARE_WIDTH,
            } as MouseEvent;
            service.selectionType = SelectionType.None;
            service.onLeftClick(event);

            expect(flagToCheck).toEqual('handleNoneSelectionOnLeftClick');
            expect(handleGridSelectionOnLeftClickSpy).not.toHaveBeenCalled();
            expect(handleRackSelectionOnLeftClickSpy).not.toHaveBeenCalled();
            expect(handleNoneSelectionOnLeftClickSpy).toHaveBeenCalled();
        });

        it('onLeftClick should not get a function', () => {
            flagToCheck = 'NOT_FOUND';
            const coord = { x: 7, y: 7 };
            const event = {
                button: MouseButton.Right,
                offsetX: coord.x * SQUARE_WIDTH,
                offsetY: coord.y * SQUARE_WIDTH,
            } as MouseEvent;
            service.selectionType = SelectionType.Chat;
            service.onLeftClick(event);

            expect(flagToCheck).toEqual('NOT_FOUND');
            expect(handleGridSelectionOnLeftClickSpy).not.toHaveBeenCalled();
            expect(handleRackSelectionOnLeftClickSpy).not.toHaveBeenCalled();
            expect(handleNoneSelectionOnLeftClickSpy).not.toHaveBeenCalled();
        });
    });
    describe('onKeyBoardClick', () => {
        let handleGridSelectionOnKeyBoardClickSpy: jasmine.Spy<() => void>;
        let handleRackSelectionOnKeyBoardClickSpy: jasmine.Spy<() => void>;
        let flagToCheck: string;

        beforeEach(() => {
            service = TestBed.inject(SelectionManagerService);
            flagToCheck = 'NOT_FOUND';
            // Car handleGridSelectionOnKeyBoardClick privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleGridSelectionOnKeyBoardClickSpy = spyOn<any>(service, 'handleGridSelectionOnKeyBoardClick').and.callFake(() => {
                flagToCheck = 'handleGridSelectionOnKeyBoardClick';
            });
            // Car handleRackSelectionOnKeyBoardClick privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleRackSelectionOnKeyBoardClickSpy = spyOn<any>(service, 'handleRackSelectionOnKeyBoardClick').and.callFake(() => {
                flagToCheck = 'handleRackSelectionOnKeyBoardClick';
            });
        });

        it('onKeyBoardClick should handleGridSelectionOnKeyBoardClick', () => {
            flagToCheck = 'NOT_FOUND';
            const keyEvent = {
                key: 'b',
                preventDefault: () => void '',
            } as KeyboardEvent;
            service.selectionType = SelectionType.Grid;
            service.onKeyBoardClick(keyEvent);

            expect(flagToCheck).toEqual('handleGridSelectionOnKeyBoardClick');
            expect(handleGridSelectionOnKeyBoardClickSpy).toHaveBeenCalled();
            expect(handleRackSelectionOnKeyBoardClickSpy).not.toHaveBeenCalled();
        });

        it('onKeyBoardClick should handleRackSelectionOnKeyBoardClick', () => {
            flagToCheck = 'NOT_FOUND';
            const keyEvent = {
                key: 'b',
                preventDefault: () => void '',
            } as KeyboardEvent;
            service.selectionType = SelectionType.Rack;
            service.onKeyBoardClick(keyEvent);

            expect(flagToCheck).toEqual('handleRackSelectionOnKeyBoardClick');
            expect(handleGridSelectionOnKeyBoardClickSpy).not.toHaveBeenCalled();
            expect(handleRackSelectionOnKeyBoardClickSpy).toHaveBeenCalled();
        });

        it('onKeyBoardClick should not get a function', () => {
            flagToCheck = 'NOT_FOUND';
            const keyEvent = {
                key: 'b',
                preventDefault: () => void '',
            } as KeyboardEvent;
            service.selectionType = SelectionType.Chat;
            service.onKeyBoardClick(keyEvent);

            expect(flagToCheck).toEqual('NOT_FOUND');
            expect(handleGridSelectionOnKeyBoardClickSpy).not.toHaveBeenCalled();
            expect(handleRackSelectionOnKeyBoardClickSpy).not.toHaveBeenCalled();
        });
    });
});
