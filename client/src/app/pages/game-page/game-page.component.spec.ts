/* eslint-disable max-lines */
/* eslint-disable max-lines */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { IChat } from '@app/classes/chat';
import { IOptionList, NAME_OPTION } from '@app/classes/game-options';
import { Player, PLAYER } from '@app/classes/player';
import { ABANDON_SIGNAL } from '@app/classes/signal';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { GameOverviewComponent } from '@app/components/game-overview/game-overview.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { KeyboardKeys } from '@app/enums/keyboard-enum';
import { OperationType, SelectionType } from '@app/enums/selection-enum';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { NamesService } from '@app/services/admin/names.service';
import { ChatService } from '@app/services/chat.service';
import { CommandExecutionService } from '@app/services/command-execution/command-execution.service';
import { PassExecutionService } from '@app/services/command-execution/pass-execution.service';
import { ExchangeService } from '@app/services/exchange.service';
import { GameSyncService } from '@app/services/game-sync.service';
import { GameService } from '@app/services/game.service';
import { GoalService } from '@app/services/goal.service';
import { GridService } from '@app/services/grid.service';
import { PlaceService } from '@app/services/place.service';
import { RackService } from '@app/services/rack.service';
import { RandomModeService } from '@app/services/random-mode.service';
import { RoomService } from '@app/services/room.service';
import { SelectionManagerService } from '@app/services/selection-manager.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { TimerService } from '@app/services/timer.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { BehaviorSubject, of } from 'rxjs';
import { GamePageComponent } from './game-page.component';
const message: IChat = { from: 'ME', body: 'a message' };

class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}

const MODE: IOptionList = {
    settingName: 'Mode de jeux',
    availableChoices: [
        { key: 'classic', value: 'Classique' },
        { key: 'log2990', value: 'LOG2990', disabled: true },
    ],
};
const NUM_PLAYERS: IOptionList = {
    settingName: 'Nombre de joueurs',
    availableChoices: [
        { key: 'solo', value: 'Solo' },
        { key: 'multiplayer', value: 'Multijoueurs', disabled: false },
    ],
};
const COMPUTER_LEVEL: IOptionList = {
    settingName: "Niveau de l'ordinateur",
    availableChoices: [{ key: 'beginner', value: 'Débutant' }],
};

const TIMER: IOptionList = {
    settingName: 'Temps maximal par tour',
    availableChoices: [
        { key: '30', value: '30s' },
        { key: '60', value: '1m' },
        { key: '90', value: '1m30s' },
    ],
};

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let ctxStub: CanvasRenderingContext2D;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManagerService>;
    let roomServiceSpy: jasmine.SpyObj<RoomService>;
    let randomModeServiceSpy: jasmine.SpyObj<RandomModeService>;
    let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;
    let virtualPlayerServiceSpy: jasmine.SpyObj<VirtualPlayerService>;
    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
    let gameSyncServiceSpy: jasmine.SpyObj<GameSyncService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let timerServiceSpy: jasmine.SpyObj<TimerService>;
    let passExecutionServiceSpy: jasmine.SpyObj<PassExecutionService>;
    let namesServiceSpy: jasmine.SpyObj<NamesService>;
    let goalServiceSpy: jasmine.SpyObj<GoalService>;
    let placeServiceSpy: jasmine.SpyObj<PlaceService>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let exchangeServiceSpy: jasmine.SpyObj<ExchangeService>;
    let commandExecutionServiceSpy: jasmine.SpyObj<CommandExecutionService>;
    let chatServiceSpy: jasmine.SpyObj<ChatService>;

    beforeEach(async () => {
        placeServiceSpy = jasmine.createSpyObj('PlaceService', ['placeWord']);
        namesServiceSpy = jasmine.createSpyObj('NamesService', ['getRandomName']);
        namesServiceSpy.getRandomName.and.resolveTo('a name');
        passExecutionServiceSpy = jasmine.createSpyObj('PassExecutionService', ['execute']);
        passExecutionServiceSpy.execute.and.callFake(() => message);

        gameSyncServiceSpy = jasmine.createSpyObj('GameSyncService', ['initialize']);
        gameSyncServiceSpy.initialize.and.returnValue(void '');
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries', 'getComputerName']);
        userSettingsServiceSpy.getDictionaries.and.callFake(() => undefined);
        userSettingsServiceSpy.settings = {
            mode: { setting: MODE, currentChoiceKey: 'classic' },
            numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'solo' },
            computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
            timer: { setting: TIMER, currentChoiceKey: '60' },
        };
        userSettingsServiceSpy.nameOption = NAME_OPTION;
        userSettingsServiceSpy.nameOption.userChoice = 'un nom';
        userSettingsServiceSpy.selectedDictionary = { title: 'Mon Dictionnaire', description: 'a description' };

        virtualPlayerServiceSpy = jasmine.createSpyObj('VirtualPlayerService', ['initialize']);
        virtualPlayerServiceSpy.initialize.and.returnValue(undefined);
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playClickOnButtonAudio', 'stopMainPageAudio']);
        gridServiceSpy = jasmine.createSpyObj('GridService', ['increaseTileSize', 'decreaseTileSize', 'drawGrid']);
        selectionManagerSpy = jasmine.createSpyObj('SelectionManagerService', [
            'onSubmitExchange',
            'onCancelManipulation',
            'onCancelExchange',
            'hideExchangeButton',
            'disableExchange',
            'disableManipulation',
            'onCancelPlacement',
            'onSubmitPlacement',
            'onKeyBoardClick',
            'onLeftClick',
            'onRightClick',
            'onMouseWheel',
            'hideOperation',
            'disableManipulation',
            'disableExchange',
            'updateSelectionType',
        ]);
        randomModeServiceSpy = jasmine.createSpyObj('RandomModeService', ['randomizeBonus']);
        roomServiceSpy = jasmine.createSpyObj('RoomService', ['createRoom', 'joinRoom']);

        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridServiceSpy.gridContext = ctxStub;
        gridServiceSpy.letterStyle = { color: 'NavajoWhite', font: '15px serif' };
        gridServiceSpy.pointStyle = { color: 'NavajoWhite', font: '10px serif' };

        rackServiceSpy = jasmine.createSpyObj('RackService', ['displayRack']);
        rackServiceSpy.displayRack.and.returnValue(void '');

        exchangeServiceSpy = jasmine.createSpyObj('ExchangeService', ['exchangeLetters']);

        gameServiceSpy = jasmine.createSpyObj('GameService', ['didGameEnd']);
        gameServiceSpy.convertToSoloSignal = new BehaviorSubject<string>('solo');
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
            {
                id: PLAYER.otherPlayer,
                name: 'Other Random name',
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

        timerServiceSpy = jasmine.createSpyObj('TimerService', ['startTimer']);
        timerServiceSpy.startTimer.and.returnValue(void '');
        timerServiceSpy.counter = {
            min: 0,
            seconds: 0,
            resetValue: 0,
            totalTimer: 0,
        };
        timerServiceSpy.timerDone = new BehaviorSubject<boolean>(false);
        timerServiceSpy.resetTurnCounter = new BehaviorSubject<boolean | Player>(false);

        goalServiceSpy = jasmine.createSpyObj('GoalService', ['getAUniqueGoal']);
        goalServiceSpy.initializedSignal = new BehaviorSubject<boolean>(false);

        commandExecutionServiceSpy = jasmine.createSpyObj('CommandExecutionService', ['interpretCommand', 'executeCommand', 'addLetterInReserve']);

        chatServiceSpy = jasmine.createSpyObj('ChatService', ['addMessage', 'getMessages']);
        chatServiceSpy.messages = [];
        chatServiceSpy.getMessages.and.returnValue(of(chatServiceSpy.messages));
        chatServiceSpy.addMessage.and.callFake((newMessage) => chatServiceSpy.messages.push(newMessage));

        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent, ChatboxComponent, GameOverviewComponent],
            imports: [
                FormsModule,
                AppMaterialModule,
                MatInputModule,
                FormsModule,
                MatIconModule,
                BrowserAnimationsModule,
                NoopAnimationsModule,
                MatCardModule,
                MatDialogModule,
                MatButtonModule,
                AppRoutingModule,
                RouterTestingModule,
                HttpClientModule,
            ],
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: SelectionManagerService, useValue: selectionManagerSpy },
                { provide: RandomModeService, useValue: randomModeServiceSpy },
                { provide: RoomService, useValue: roomServiceSpy },
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: SoundManagerService, useValue: soundManagerServiceSpy },
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
                { provide: VirtualPlayerService, useValue: virtualPlayerServiceSpy },
                { provide: GameSyncService, useValue: gameSyncServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: TimerService, useValue: timerServiceSpy },
                { provide: PassExecutionService, useValue: passExecutionServiceSpy },
                { provide: NamesService, useValue: namesServiceSpy },
                { provide: GoalService, useValue: goalServiceSpy },
                { provide: PlaceService, useValue: placeServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
                { provide: ExchangeService, useValue: exchangeServiceSpy },
                { provide: CommandExecutionService, useValue: commandExecutionServiceSpy },
                { provide: ChatService, useValue: chatServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('increaseSize should call increaseSize of gridService', () => {
        component.increaseSize();
        expect(gridServiceSpy.increaseTileSize).toHaveBeenCalled();
    });

    it('increaseSize should call increaseSize of gridService', () => {
        component.increaseSize();
        expect(selectionManagerSpy.updateSelectionType).toHaveBeenCalled();
    });

    it('decreaseSize should call decreaseSize of gridService', () => {
        component.decreaseSize();

        expect(gridServiceSpy.decreaseTileSize).toHaveBeenCalled();
    });

    it('decreaseSize should call update the selection type', () => {
        component.decreaseSize();
        expect(selectionManagerSpy.updateSelectionType).toHaveBeenCalled();
    });

    it('onKeyBoardClick should call onKeyBoardClick of SelectionManager', () => {
        const keyEvent = {
            key: KeyboardKeys.ArrowRight,
        } as KeyboardEvent;

        component.onKeyBoardClick(keyEvent);
        expect(selectionManagerSpy.onKeyBoardClick).toHaveBeenCalled();
    });

    it('onLeftClick should call onLeftClick of SelectionManager', () => {
        const xValue = 15;
        const yValue = 15;
        const keyEvent = {
            button: 0,
            offsetX: xValue,
            offsetY: yValue,
        } as MouseEvent;

        component.onLeftClick(keyEvent);
        expect(selectionManagerSpy.onLeftClick).toHaveBeenCalled();
    });

    it('onRightClick should call onRightClick of SelectionManager', () => {
        const xValue = 15;
        const yValue = 15;
        const keyEvent = {
            button: 0,
            offsetX: xValue,
            offsetY: yValue,
        } as MouseEvent;

        component.onRightClick(keyEvent);
        expect(selectionManagerSpy.onRightClick).toHaveBeenCalled();
    });

    it('onWheelMouse should call onWheelMouse of SelectionManger', () => {
        const xValue = 15;
        const yValue = 15;
        const keyEvent = {
            button: 0,
            offsetX: xValue,
            offsetY: yValue,
        } as WheelEvent;

        component.onMouseWheel(keyEvent);
        expect(selectionManagerSpy.onMouseWheel).toHaveBeenCalled();
    });

    it('onSubmitPlacement Should call onSubmitPlacement of SelectionManager', () => {
        const selectionTypeTest: SelectionType = 1;
        component.onSubmitPlacement(selectionTypeTest);
        expect(selectionManagerSpy.onSubmitPlacement).toHaveBeenCalled();
    });

    it('onCancelPlacement Should call onCancelPlacement of SelectionManager', () => {
        const selectionTypeTest: SelectionType = 1;
        component.onCancelPlacement(selectionTypeTest);
        expect(selectionManagerSpy.onCancelPlacement).toHaveBeenCalled();
    });

    it('disableManipulation Should call disableManipulation of SelectionManager', () => {
        component.disableManipulation();
        expect(selectionManagerSpy.disableManipulation).toHaveBeenCalled();
    });

    it('disableExchange Should call disableExchange of  SelectionManager', () => {
        component.disableExchange();
        expect(selectionManagerSpy.disableExchange).toHaveBeenCalled();
    });

    it('hideExchangeButton Should call hideExchangeButton of  SelectionManager ', () => {
        component.hideExchangeButton();
        expect(selectionManagerSpy.hideExchangeButton).toHaveBeenCalled();
    });

    it('onCancelExchange Should call onCancelExchange of  SelectionManager ', () => {
        const selectionTypeTest: SelectionType = 1;
        component.onCancelExchange(selectionTypeTest);
        expect(selectionManagerSpy.onCancelExchange).toHaveBeenCalled();
    });

    it('onCancelManipulation Should call onCancelManipulation of  SelectionManager ', () => {
        const selectionTypeTest: SelectionType = 1;

        component.onCancelManipulation(selectionTypeTest);
        expect(selectionManagerSpy.onCancelManipulation).toHaveBeenCalled();
    });

    it('onSubmitExchange Should call onSubmitExchange of  SelectionManager ', () => {
        const selectionTypeTest: SelectionType = 1;

        component.onSubmitExchange(selectionTypeTest);
        expect(selectionManagerSpy.onSubmitExchange).toHaveBeenCalled();
    });

    describe('ahowAbandonDialog', () => {
        it('should open a dialog if the received signal is the ABANDON SIGNAL', () => {
            // eslint-disable-next-line dot-notation
            const matDialogSpy = spyOn(component['matDialog'], 'open');
            const aRandomSignal = 'some signal';
            // eslint-disable-next-line dot-notation
            component['showAbandonDIalog'](aRandomSignal);
            expect(matDialogSpy).not.toHaveBeenCalled();

            // eslint-disable-next-line dot-notation
            component['showAbandonDIalog'](ABANDON_SIGNAL);
            expect(matDialogSpy).toHaveBeenCalled();
        });
    });

    it('should return SelectionType', () => {
        expect(component.selectionType).toEqual(SelectionType);
    });

    it('should return OperationType', () => {
        expect(component.operationType).toEqual(OperationType);
    });

    it('should call execute when skipTurn is called', () => {
        component.skipTurn();
        expect(passExecutionServiceSpy.execute).toHaveBeenCalled();
    });

    it('should call execute when skipTurn is called', () => {
        component.skipTurn();
        expect(passExecutionServiceSpy.execute).toHaveBeenCalled();
    });
});
