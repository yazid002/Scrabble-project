import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ABANDON_SIGNAL } from '@app/classes/signal';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { GameOverviewComponent } from '@app/components/game-overview/game-overview.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { KeyboardKeys } from '@app/enums/keyboard-enum';
import { OperationType, SelectionType } from '@app/enums/selection-enum';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { GridService } from '@app/services/grid.service';
import { RandomModeService } from '@app/services/random-mode.service';
import { RoomService } from '@app/services/room.service';
import { SelectionManagerService } from '@app/services/selection-manager.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { of } from 'rxjs';
import { GamePageComponent } from './game-page.component';

class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}

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

    beforeEach(async () => {
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries']);
        userSettingsServiceSpy.getDictionaries.and.returnValue(undefined);

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

        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent, ChatboxComponent, GameOverviewComponent],
            imports: [
                MatInputModule,
                FormsModule,
                MatIconModule,
                BrowserAnimationsModule,
                NoopAnimationsModule,
                MatCardModule,
                MatDialogModule,
                MatButtonModule,
                AppRoutingModule,
                RouterModule,
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
        // eslint-disable-next-line dot-notation
        const passExecutionExecuteSpy = spyOn(component['passExecutionService'], 'execute');
        component.skipTurn();
        expect(passExecutionExecuteSpy).toHaveBeenCalled();
    });

    it('should call execute when skipTurn is called', () => {
        // eslint-disable-next-line dot-notation
        const passExecutionExecuteSpy = spyOn(component['passExecutionService'], 'execute');
        component.skipTurn();
        expect(passExecutionExecuteSpy).toHaveBeenCalled();
    });
});
