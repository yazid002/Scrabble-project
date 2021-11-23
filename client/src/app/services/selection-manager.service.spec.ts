/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { PLAYER } from '@app/classes/player';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { SQUARE_WIDTH } from '@app/constants/board-constants';
import { NOT_FOUND } from '@app/constants/common-constants';
import { KeyboardKeys } from '@app/enums/keyboard-enum';
import { MouseButton } from '@app/enums/mouse-enums';
import { OperationType, SelectionType } from '@app/enums/selection-enum';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from './chat.service';
import { CommandExecutionService } from './command-execution/command-execution.service';
import { ExchangeSelectionService } from './exchange-selection.service';
import { GameService } from './game.service';
import { PlaceSelectionService } from './place-selection.service';
import { RackLettersManipulationService } from './rack-letters-manipulation.service';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';
import { SelectionManagerService } from './selection-manager.service';
import { SelectionUtilsService } from './selection-utils.service';
import { TimerService } from './timer.service';

class MockChatboxComponent extends ChatboxComponent {
    inputBox = '';
    fromSelection = false;
    async onSubmit() {
        return Promise.resolve(void '');
    }
}

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
    let commandExecutionServiceSpy: jasmine.SpyObj<CommandExecutionService>;
    let chatServiceSpy: jasmine.SpyObj<ChatService>;

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
                wordsMapping: new Map<string, number>(),
                words: [],
            },
        ];
        commandExecutionServiceSpy = jasmine.createSpyObj('CommandExecutionService', ['interpretCommand', 'executeCommand', 'addLetterInReserve']);
        chatServiceSpy = jasmine.createSpyObj('ChatService', ['addMessage', 'getMessages']);

        TestBed.configureTestingModule({
            declarations: [ChatboxComponent],
            providers: [
                { provide: RackService, useValue: rackServiceSpy },
                { provide: SelectionUtilsService, useValue: selectionUtilsServiceSpy },
                { provide: ReserveService, useValue: reserveServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: PlaceSelectionService, useValue: placeSelectionServiceSpy },
                { provide: TimerService, useValue: timerServiceSpy },
                { provide: RackLettersManipulationService, useValue: rackLettersManipulationServiceSpy },
                { provide: ExchangeSelectionService, useValue: exchangeSelectionServiceSpy },
                { provide: ChatboxComponent, useValue: MockChatboxComponent },
                { provide: CommandExecutionService, useValue: commandExecutionServiceSpy },
                { provide: ChatService, useValue: chatServiceSpy },
            ],
        }).compileComponents();
        service = TestBed.inject(SelectionManagerService);
        service.chatboxComponent = new MockChatboxComponent(chatServiceSpy, commandExecutionServiceSpy, service);
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
        // eslint-disable-next-line dot-notation
        service['handleGridSelectionOnLeftClick'](event);

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

        // eslint-disable-next-line dot-notation
        service['handleGridSelectionOnLeftClick'](event);

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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isLetterClickAlreadySelectedForExchangeSpy = spyOn<any>(service, 'isLetterClickAlreadySelectedForExchange').and.returnValue(false);

        // eslint-disable-next-line dot-notation
        service['handleRackSelectionOnLeftClick'](event);

        expect(isLetterClickAlreadySelectedForExchangeSpy).toHaveBeenCalled();
        expect(exchangeSelectionServiceSpy.cancelExchange).toHaveBeenCalled();
        expect(placeSelectionServiceSpy.cancelPlacement).toHaveBeenCalledWith();
        expect(rackLettersManipulationServiceSpy.onMouseLeftClick).toHaveBeenCalled();
    });

    it('handleRackSelectionOnLeftClick should not select letter for manipulation if letter is selected for exchange', () => {
        const casePosition = 3;
        const event = {
            button: MouseButton.Left,
            offsetX: casePosition * SQUARE_WIDTH,
            offsetY: casePosition * SQUARE_WIDTH,
        } as MouseEvent;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isLetterClickAlreadySelectedForExchangeSpy = spyOn<any>(service, 'isLetterClickAlreadySelectedForExchange').and.returnValue(true);

        // eslint-disable-next-line dot-notation
        service['handleRackSelectionOnLeftClick'](event);

        expect(isLetterClickAlreadySelectedForExchangeSpy).toHaveBeenCalled();
        expect(exchangeSelectionServiceSpy.cancelExchange).not.toHaveBeenCalled();
        expect(rackLettersManipulationServiceSpy.onMouseLeftClick).not.toHaveBeenCalled();
    });

    it(' handleNoneSelectionOnLeftClick should call cancelPlacement and cancelManipulation', () => {
        // eslint-disable-next-line dot-notation
        service['handleNoneSelectionOnLeftClick']();

        expect(placeSelectionServiceSpy.cancelPlacement).toHaveBeenCalled();
        expect(rackLettersManipulationServiceSpy.cancelManipulation).toHaveBeenCalled();
    });
    it(' handleNoneSelectionOnLeftClick should update selectionType and not call cancelExchange', () => {
        exchangeSelectionServiceSpy.hideOperation.and.returnValue(true);
        exchangeSelectionServiceSpy.cancelExchange.and.returnValue(void '');
        service.selectionType = SelectionType.Grid;
        // eslint-disable-next-line dot-notation
        service['handleNoneSelectionOnLeftClick']();

        expect(service.selectionType).toEqual(2);
        expect(exchangeSelectionServiceSpy.cancelExchange).not.toHaveBeenCalled();
    });
    it(' handleNoneSelectionOnLeftClick should not update selectionType and should call cancelExchange', () => {
        exchangeSelectionServiceSpy.hideOperation.and.returnValue(false);
        exchangeSelectionServiceSpy.cancelExchange.and.returnValue(void '');
        service.selectionType = SelectionType.Grid;
        // handleNoneSelectionOnLeftClick is private
        // eslint-disable-next-line dot-notation
        service['handleNoneSelectionOnLeftClick']();

        expect(service.selectionType).toEqual(SelectionType.Grid);
        expect(exchangeSelectionServiceSpy.cancelExchange).toHaveBeenCalled();
    });

    it(
        ' handleRackSelectionOnKeyBoardClick should call cancelManipulation' +
            ' if rack is not selected for manipulation and letter is already selected for exchange',
        () => {
            const keyEvent = {
                key: 'b',
                preventDefault: () => void '',
            } as KeyboardEvent;

            // isLetterKeyAlreadySelectedForExchange is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isLetterKeyAlreadySelectedForExchange').and.returnValue(true);
            // handleRackSelectionOnKeyBoardClick is private
            // eslint-disable-next-line dot-notation
            service['handleRackSelectionOnKeyBoardClick'](keyEvent);

            expect(exchangeSelectionServiceSpy.cancelExchange).not.toHaveBeenCalled();
            expect(rackLettersManipulationServiceSpy.onKeyBoardClick).not.toHaveBeenCalled();
            expect(rackLettersManipulationServiceSpy.cancelManipulation).toHaveBeenCalled();
        },
    );

    it(
        ' handleRackSelectionOnKeyBoardClick should not call cancelManipulation and cancelExchange' +
            ' if rack is selected for manipulation (key is arrowLeft)',
        () => {
            const keyEvent = {
                key: KeyboardKeys.ArrowLeft,
                preventDefault: () => void '',
            } as KeyboardEvent;

            // isLetterKeyAlreadySelectedForExchange is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isLetterKeyAlreadySelectedForExchangeSpy = spyOn<any>(service, 'isLetterKeyAlreadySelectedForExchange').and.callThrough();
            // handleRackSelectionOnKeyBoardClick is private
            // eslint-disable-next-line dot-notation
            service['handleRackSelectionOnKeyBoardClick'](keyEvent);

            expect(exchangeSelectionServiceSpy.cancelExchange).not.toHaveBeenCalled();
            expect(rackLettersManipulationServiceSpy.onKeyBoardClick).toHaveBeenCalled();
            expect(rackLettersManipulationServiceSpy.cancelManipulation).not.toHaveBeenCalled();
            expect(isLetterKeyAlreadySelectedForExchangeSpy).not.toHaveBeenCalled();
        },
    );

    it(
        ' handleRackSelectionOnKeyBoardClick should not call cancelManipulation and cancelExchange' +
            ' if rack is selected for manipulation (key is arrowRight)',
        () => {
            const keyEvent = {
                key: KeyboardKeys.ArrowRight,
                preventDefault: () => void '',
            } as KeyboardEvent;

            // isLetterKeyAlreadySelectedForExchange is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isLetterKeyAlreadySelectedForExchangeSpy = spyOn<any>(service, 'isLetterKeyAlreadySelectedForExchange').and.callThrough();
            // handleRackSelectionOnKeyBoardClick is private
            // eslint-disable-next-line dot-notation
            service['handleRackSelectionOnKeyBoardClick'](keyEvent);

            expect(exchangeSelectionServiceSpy.cancelExchange).not.toHaveBeenCalled();
            expect(rackLettersManipulationServiceSpy.onKeyBoardClick).toHaveBeenCalled();
            expect(rackLettersManipulationServiceSpy.cancelManipulation).not.toHaveBeenCalled();
            expect(isLetterKeyAlreadySelectedForExchangeSpy).not.toHaveBeenCalled();
        },
    );

    it(
        ' handleRackSelectionOnKeyBoardClick should not call cancelManipulation and cancelExchange' +
            ' if rack is selected for manipulation (key is shift)',
        () => {
            const keyEvent = {
                key: KeyboardKeys.Shift,
                preventDefault: () => void '',
            } as KeyboardEvent;

            // isLetterKeyAlreadySelectedForExchange is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isLetterKeyAlreadySelectedForExchangeSpy = spyOn<any>(service, 'isLetterKeyAlreadySelectedForExchange').and.callThrough();
            // handleRackSelectionOnKeyBoardClick is private
            // eslint-disable-next-line dot-notation
            service['handleRackSelectionOnKeyBoardClick'](keyEvent);

            expect(exchangeSelectionServiceSpy.cancelExchange).not.toHaveBeenCalled();
            expect(rackLettersManipulationServiceSpy.onKeyBoardClick).toHaveBeenCalled();
            expect(rackLettersManipulationServiceSpy.cancelManipulation).not.toHaveBeenCalled();
            expect(isLetterKeyAlreadySelectedForExchangeSpy).not.toHaveBeenCalled();
        },
    );

    it(
        ' handleRackSelectionOnKeyBoardClick should call onKeyBoardClick and cancelExchange' +
            ' if rack is selected not selected for manipulation and letter is not already selected for exchange',
        () => {
            const keyEvent = {
                key: KeyboardKeys.Enter,
                preventDefault: () => void '',
            } as KeyboardEvent;

            // isLetterKeyAlreadySelectedForExchange is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isLetterKeyAlreadySelectedForExchangeSpy = spyOn<any>(service, 'isLetterKeyAlreadySelectedForExchange').and.returnValue(false);
            // handleRackSelectionOnKeyBoardClick is private
            // eslint-disable-next-line dot-notation
            service['handleRackSelectionOnKeyBoardClick'](keyEvent);

            expect(exchangeSelectionServiceSpy.cancelExchange).toHaveBeenCalled();
            expect(rackLettersManipulationServiceSpy.onKeyBoardClick).toHaveBeenCalled();
            expect(rackLettersManipulationServiceSpy.cancelManipulation).not.toHaveBeenCalled();
            expect(isLetterKeyAlreadySelectedForExchangeSpy).toHaveBeenCalled();
        },
    );

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
        placeSelectionServiceSpy.cancelPlacement.and.returnValue(void '');
        rackLettersManipulationServiceSpy.cancelManipulation.and.returnValue(NOT_FOUND);

        service.selectionType = SelectionType.Rack;
        service.onRightClick(event);

        expect(exchangeSelectionServiceSpy.cancelExchange).not.toHaveBeenCalled();
        expect(exchangeSelectionServiceSpy.onMouseRightClick).toHaveBeenCalled();
        expect(rackLettersManipulationServiceSpy.cancelManipulation).toHaveBeenCalled();
        expect(placeSelectionServiceSpy.cancelPlacement).toHaveBeenCalled();
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
            // handleGridSelectionOnLeftClick privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleGridSelectionOnLeftClickSpy = spyOn<any>(service, 'handleGridSelectionOnLeftClick').and.callFake(() => {
                flagToCheck = 'handleGridSelectionOnLeftClick';
            });
            // handleRackSelectionOnLeftClick privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleRackSelectionOnLeftClickSpy = spyOn<any>(service, 'handleRackSelectionOnLeftClick').and.callFake(() => {
                flagToCheck = 'handleRackSelectionOnLeftClick';
            });

            // handleNoneSelectionOnLeftClick privée
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
            // handleGridSelectionOnKeyBoardClick privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleGridSelectionOnKeyBoardClickSpy = spyOn<any>(service, 'handleGridSelectionOnKeyBoardClick').and.callFake(() => {
                flagToCheck = 'handleGridSelectionOnKeyBoardClick';
            });
            // handleRackSelectionOnKeyBoardClick privée
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
    describe('handleGridSelectionOnKeyBoardClick', () => {
        it('should  updateSelectionType and not call onKeyBoardClick if it is not my turn', () => {
            gameServiceSpy.currentTurn = PLAYER.otherPlayer;
            const keyEvent = {
                key: 'b',
                preventDefault: () => void '',
            } as KeyboardEvent;
            service.selectionType = SelectionType.Grid;
            // eslint-disable-next-line dot-notation
            service['handleGridSelectionOnKeyBoardClick'](keyEvent);

            expect(service.selectionType).toEqual(2);
            expect(placeSelectionServiceSpy.onKeyBoardClick).not.toHaveBeenCalled();
        });

        it('should not  updateSelectionType and call onKeyBoardClick if it is my turn', () => {
            gameServiceSpy.currentTurn = PLAYER.realPlayer;
            const keyEvent = {
                key: 'b',
                preventDefault: () => void '',
            } as KeyboardEvent;
            service.selectionType = SelectionType.Grid;
            // eslint-disable-next-line dot-notation
            service['handleGridSelectionOnKeyBoardClick'](keyEvent);

            expect(service.selectionType).toEqual(SelectionType.Grid);
            expect(placeSelectionServiceSpy.onKeyBoardClick).toHaveBeenCalled();
        });

        it('should updateSelectionType if it is my turn and the placement is cancelled by escape', () => {
            gameServiceSpy.currentTurn = PLAYER.realPlayer;
            const keyEvent = {
                key: KeyboardKeys.Escape,
                preventDefault: () => void '',
            } as KeyboardEvent;
            service.selectionType = SelectionType.Grid;
            // eslint-disable-next-line dot-notation
            service['handleGridSelectionOnKeyBoardClick'](keyEvent);

            expect(service.selectionType).toEqual(2);
        });

        it('should updateSelectionType if it is my turn and the placement is cancelled by taking off all letters by backspace', () => {
            gameServiceSpy.currentTurn = PLAYER.realPlayer;
            const keyEvent = {
                key: KeyboardKeys.Backspace,
                preventDefault: () => void '',
            } as KeyboardEvent;
            service.selectionType = SelectionType.Grid;
            placeSelectionServiceSpy.selectedTilesForPlacement = [];
            // eslint-disable-next-line dot-notation
            service['handleGridSelectionOnKeyBoardClick'](keyEvent);

            expect(service.selectionType).toEqual(2);
        });

        it('should call activePlacement the key is enter and it is my turn', () => {
            gameServiceSpy.currentTurn = PLAYER.realPlayer;
            const keyEvent = {
                key: KeyboardKeys.Enter,
                preventDefault: () => void '',
            } as KeyboardEvent;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const activePlacementSpy = spyOn<any>(service, 'activePlacement').and.returnValue(void '');

            // eslint-disable-next-line dot-notation
            service['handleGridSelectionOnKeyBoardClick'](keyEvent);

            expect(activePlacementSpy).toHaveBeenCalled();
        });
    });
    describe('onMouseWheel', () => {
        it('should not call onKeyBoardClick if the rack is not selected', () => {
            const wheelEvent = {
                deltaY: 0,
                deltaX: 0,
                deltaZ: 0,
            } as WheelEvent;
            service.selectionType = SelectionType.Grid;
            const onKeyBoardClickSpy = spyOn(service, 'onKeyBoardClick').and.returnValue(void '');
            // eslint-disable-next-line dot-notation
            service['onMouseWheel'](wheelEvent);

            expect(onKeyBoardClickSpy).not.toHaveBeenCalled();
        });

        it('should call onKeyBoardClick with arrowLeft (move the letter to the left)', () => {
            const wheelEvent = {
                deltaY: -1,
                deltaX: 0,
                deltaZ: 0,
            } as WheelEvent;
            service.selectionType = SelectionType.Rack;
            const onKeyBoardClickSpy = spyOn(service, 'onKeyBoardClick').and.returnValue(void '');
            // eslint-disable-next-line dot-notation
            service['onMouseWheel'](wheelEvent);

            expect(onKeyBoardClickSpy).toHaveBeenCalled();
        });

        it('should call onKeyBoardClick with arrowRight (move the letter to the right)', () => {
            const wheelEvent = {
                deltaY: 2,
                deltaX: 0,
                deltaZ: 0,
            } as WheelEvent;
            service.selectionType = SelectionType.Rack;
            const onKeyBoardClickSpy = spyOn(service, 'onKeyBoardClick').and.returnValue(void '');
            // eslint-disable-next-line dot-notation
            service['onMouseWheel'](wheelEvent);

            expect(onKeyBoardClickSpy).toHaveBeenCalled();
        });
    });
    describe('onCancelManipulation', () => {
        it('should update selection type and cancel manipulation', () => {
            service.selectionType = SelectionType.Grid;
            service.onCancelManipulation(SelectionType.Rack);

            expect(service.selectionType).toEqual(2);
            expect(rackLettersManipulationServiceSpy.cancelManipulation).toHaveBeenCalled();
        });
    });
    describe('disableManipulation', () => {
        it('should return true', () => {
            rackLettersManipulationServiceSpy.selectedIndexes = [];
            const result = service.disableManipulation();
            expect(result).toEqual(true);
        });
        it('should return false', () => {
            rackLettersManipulationServiceSpy.selectedIndexes = [1];
            const result = service.disableManipulation();
            expect(result).toEqual(false);
        });
    });

    describe('disableExchange', () => {
        it('should return true if it is not my turn', () => {
            const availableLetters = 9;
            gameServiceSpy.currentTurn = PLAYER.otherPlayer;
            reserveServiceSpy.getQuantityOfAvailableLetters.and.returnValue(availableLetters);
            const result = service.disableExchange();
            expect(result).toEqual(true);
        });
        it('should return true if there are not enough letters left in reserve', () => {
            const availableLetters = 1;
            gameServiceSpy.currentTurn = PLAYER.realPlayer;
            reserveServiceSpy.getQuantityOfAvailableLetters.and.returnValue(availableLetters);
            const result = service.disableExchange();
            expect(result).toEqual(true);
        });

        it('should return true if there are not enough letters left in reserve and it is not my turn', () => {
            const availableLetters = 1;
            gameServiceSpy.currentTurn = PLAYER.otherPlayer;
            reserveServiceSpy.getQuantityOfAvailableLetters.and.returnValue(availableLetters);
            const result = service.disableExchange();
            expect(result).toEqual(true);
        });
        it('should return false it is my turn and there are enough letters in reserve', () => {
            const availableLetters = 9;
            gameServiceSpy.currentTurn = PLAYER.realPlayer;
            reserveServiceSpy.getQuantityOfAvailableLetters.and.returnValue(availableLetters);
            const result = service.disableExchange();
            expect(result).toEqual(false);
        });
    });

    describe('hideExchangeButton', () => {
        it('should return true if there is no selected letter for exchange', () => {
            exchangeSelectionServiceSpy.selectedIndexes = [];
            const result = service.hideExchangeButton();

            expect(result).toEqual(true);
        });

        it('should return false if there are letters selected for exchange', () => {
            exchangeSelectionServiceSpy.selectedIndexes = [0];
            const result = service.hideExchangeButton();

            expect(result).toEqual(false);
        });
    });
    describe('onCancelExchange', () => {
        it('should update selection type and cancel exchange', () => {
            service.selectionType = SelectionType.Rack;
            service.onCancelExchange(SelectionType.Grid);

            expect(service.selectionType).toEqual(1);
            expect(exchangeSelectionServiceSpy.cancelExchange).toHaveBeenCalled();
        });
    });

    describe('onSubmitExchange', () => {
        it('should update selection type and build command', () => {
            service.selectionType = SelectionType.Rack;
            service.onSubmitExchange(SelectionType.Grid);

            expect(service.selectionType).toEqual(1);
            expect(exchangeSelectionServiceSpy.buildExchangeCommand).toHaveBeenCalled();
        });

        it('should send command through chat', () => {
            const submitSpy = spyOn(service.chatboxComponent, 'onSubmit').and.returnValue(Promise.resolve(void ''));
            exchangeSelectionServiceSpy.buildExchangeCommand.and.returnValue('!echanger');
            service.onSubmitExchange(SelectionType.Grid);

            expect(service.command).toEqual('!echanger');
            expect(service.chatboxComponent.inputBox).toEqual('!echanger');
            expect(service.chatboxComponent.fromSelection).toEqual(true);
            expect(submitSpy).toHaveBeenCalled();
        });
    });
    describe('onSubmitPlacement', () => {
        it('should update selection type', () => {
            service.selectionType = SelectionType.Rack;
            service.onSubmitPlacement(SelectionType.Grid);

            expect(service.selectionType).toEqual(1);
        });

        it('should call onKeyBoardClick', () => {
            const onKeyBoardClickSpy = spyOn(service, 'onKeyBoardClick').and.returnValue(void '');
            service.onSubmitPlacement(SelectionType.Grid);
            expect(onKeyBoardClickSpy).toHaveBeenCalled();
        });
    });

    describe('onCancelPlacement', () => {
        it('should update selection type', () => {
            service.selectionType = SelectionType.Chat;
            service.onCancelPlacement(SelectionType.Rack);

            expect(service.selectionType).toEqual(2);
        });

        it('should call onKeyBoardClick', () => {
            const onKeyBoardClickSpy = spyOn(service, 'onKeyBoardClick').and.returnValue(void '');
            service.onCancelPlacement(SelectionType.Grid);
            expect(onKeyBoardClickSpy).toHaveBeenCalled();
        });
    });

    describe('activePlacement', () => {
        it('should send command through chat', () => {
            const submitSpy = spyOn(service.chatboxComponent, 'onSubmit').and.returnValue(Promise.resolve(void ''));
            placeSelectionServiceSpy.command = '!placer';
            // activePlacement is private
            // eslint-disable-next-line dot-notation
            service['activePlacement']();

            expect(service.command).toEqual('!placer');
            expect(service.chatboxComponent.inputBox).toEqual('!placer');
            expect(service.chatboxComponent.fromSelection).toEqual(true);
            expect(submitSpy).toHaveBeenCalled();
        });

        it('should not send command through chat if it is empty', () => {
            const submitSpy = spyOn(service.chatboxComponent, 'onSubmit').and.returnValue(Promise.resolve(void ''));
            placeSelectionServiceSpy.command = '';
            // activePlacement is private
            // eslint-disable-next-line dot-notation
            service['activePlacement']();

            expect(service.command).toEqual('');
            expect(service.chatboxComponent.inputBox).toEqual('');
            expect(service.chatboxComponent.fromSelection).toEqual(false);
            expect(submitSpy).not.toHaveBeenCalled();
        });
    });
    describe('hideOperation', () => {
        let flagToCheck: string;

        beforeEach(() => {
            service = TestBed.inject(SelectionManagerService);
            flagToCheck = 'NOT_FOUND';

            exchangeSelectionServiceSpy.hideOperation.and.callFake(() => {
                flagToCheck = 'exchangeSelectionServiceSpy';
                return false;
            });

            placeSelectionServiceSpy.hideOperation.and.callFake(() => {
                flagToCheck = 'placeSelectionServiceSpy';
                return false;
            });
        });

        it('hideOperation should call placeSelectionServiceSpy.hideOperation', () => {
            flagToCheck = 'NOT_FOUND';
            const operationType = OperationType.Place;
            const result = service.hideOperation(operationType);

            expect(result).toEqual(false);
            expect(flagToCheck).toEqual('placeSelectionServiceSpy');
            expect(placeSelectionServiceSpy.hideOperation).toHaveBeenCalled();
            expect(exchangeSelectionServiceSpy.hideOperation).not.toHaveBeenCalled();
        });

        it('hideOperation should call exchangeSelectionServiceSpy.hideOperation', () => {
            flagToCheck = 'NOT_FOUND';
            const operationType = OperationType.Exchange;
            const result = service.hideOperation(operationType);

            expect(result).toEqual(false);
            expect(flagToCheck).toEqual('exchangeSelectionServiceSpy');
            expect(placeSelectionServiceSpy.hideOperation).not.toHaveBeenCalled();
            expect(exchangeSelectionServiceSpy.hideOperation).toHaveBeenCalled();
        });

        it('hideOperation should not get a function and return true', () => {
            flagToCheck = 'NOT_FOUND';
            const operationType = OperationType.CancelExchange;
            const result = service.hideOperation(operationType);

            expect(result).toEqual(true);
            expect(flagToCheck).toEqual('NOT_FOUND');
            expect(placeSelectionServiceSpy.hideOperation).not.toHaveBeenCalled();
            expect(exchangeSelectionServiceSpy.hideOperation).not.toHaveBeenCalled();
        });
    });

    describe('isLetterClickAlreadySelectedForExchange', () => {
        it('isLetterClickAlreadySelectedForExchange should return false without calling exchangeSelectionService.isLetterAlreadySelected', () => {
            const coord = { x: -7, y: 7 };
            const event = {
                button: MouseButton.Left,
                offsetX: coord.x * SQUARE_WIDTH,
                offsetY: coord.y * SQUARE_WIDTH,
            } as MouseEvent;
            selectionUtilsServiceSpy.getMouseClickIndex.and.returnValue(NOT_FOUND);

            // isLetterClickAlreadySelectedForExchange is private
            // eslint-disable-next-line dot-notation
            const result = service['isLetterClickAlreadySelectedForExchange'](event);

            expect(result).toEqual(false);
            expect(exchangeSelectionServiceSpy.isLetterAlreadySelected).not.toHaveBeenCalled();
        });

        it('isLetterClickAlreadySelectedForExchange should return  exchangeSelectionService.isLetterAlreadySelected', () => {
            const coord = { x: 7, y: 7 };
            const event = {
                button: MouseButton.Left,
                offsetX: coord.x * SQUARE_WIDTH,
                offsetY: coord.y * SQUARE_WIDTH,
            } as MouseEvent;
            selectionUtilsServiceSpy.getMouseClickIndex.and.returnValue(coord.x);
            exchangeSelectionServiceSpy.isLetterAlreadySelected.and.returnValue(true);

            // isLetterClickAlreadySelectedForExchange is private
            // eslint-disable-next-line dot-notation
            const result = service['isLetterClickAlreadySelectedForExchange'](event);

            expect(result).toEqual(true);
            expect(exchangeSelectionServiceSpy.isLetterAlreadySelected).toHaveBeenCalled();
        });
    });

    describe('isLetterKeyAlreadySelectedForExchange', () => {
        it('should return false without calling exchangeSelectionService.isLetterAlreadySelected', () => {
            const keyEvent = {
                key: 'b',
                preventDefault: () => void '',
            } as KeyboardEvent;
            rackLettersManipulationServiceSpy.getIndexFromKey.and.returnValue(NOT_FOUND);

            // isLetterClickAlreadySelectedForExchange is private
            // eslint-disable-next-line dot-notation
            const result = service['isLetterKeyAlreadySelectedForExchange'](keyEvent);

            expect(result).toEqual(false);
            expect(exchangeSelectionServiceSpy.isLetterAlreadySelected).not.toHaveBeenCalled();
        });

        it('should return exchangeSelectionService.isLetterAlreadySelected', () => {
            const keyEvent = {
                key: 'b',
                preventDefault: () => void '',
            } as KeyboardEvent;
            rackLettersManipulationServiceSpy.getIndexFromKey.and.returnValue(1);
            exchangeSelectionServiceSpy.isLetterAlreadySelected.and.returnValue(true);

            // isLetterClickAlreadySelectedForExchange is private
            // eslint-disable-next-line dot-notation
            const result = service['isLetterKeyAlreadySelectedForExchange'](keyEvent);

            expect(result).toEqual(true);
            expect(exchangeSelectionServiceSpy.isLetterAlreadySelected).toHaveBeenCalled();
        });
    });
});
