/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/play-area-constants';
import { MouseButton } from '@app/enums/mouse-enums';
import { SelectionType } from '@app/enums/selection-enum';
import { AppMaterialModule } from '@app/modules/material.module';
import { ExchangeService } from '@app/services/exchange.service';
import { GameService } from '@app/services/game.service';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { RandomModeService } from '@app/services/random-mode.service';
import { SelectionManagerService } from '@app/services/selection-manager.service';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let selectionManagerServiceSpy: jasmine.SpyObj<SelectionManagerService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let randomModeServiceSpy: jasmine.SpyObj<RandomModeService>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let ctxStub: CanvasRenderingContext2D;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let exchangeServiceSpy: jasmine.SpyObj<ExchangeService>;

    beforeEach(async () => {
        randomModeServiceSpy = jasmine.createSpyObj('RandomModeService', ['randomizeBonus']);

        gameServiceSpy = jasmine.createSpyObj('GameService', ['randomTurnSelect']);
        selectionManagerServiceSpy = jasmine.createSpyObj('SelectionManagerService', ['updateSelectionType']);

        gridServiceSpy = jasmine.createSpyObj('GridService', ['drawGrid']);
        ctxStub = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridServiceSpy.gridContext = ctxStub;
        gridServiceSpy.letterStyle = { color: 'NavajoWhite', font: '15px serif' };
        gridServiceSpy.pointStyle = { color: 'NavajoWhite', font: '10px serif' };
        gridServiceSpy.drawGrid.and.returnValue(void '');
        rackServiceSpy = jasmine.createSpyObj('RackService', ['displayRack']);
        rackServiceSpy.displayRack.and.returnValue(void '');

        exchangeServiceSpy = jasmine.createSpyObj('ExchangeService', ['exchangeLetters']);

        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            imports: [FormsModule, AppMaterialModule, MatButtonModule, HttpClientModule],
            providers: [
                { provide: SelectionManagerService, useValue: selectionManagerServiceSpy },
                { provide: RandomModeService, useValue: randomModeServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: GridService, useValue: gridServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
                { provide: ExchangeService, useValue: exchangeServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onRightClick should update selection type with rack', () => {
        const event = {
            button: MouseButton.Right,
            offsetX: 10,
            offsetY: 10,
            target: component['rackCanvas'].nativeElement,
        } as unknown as MouseEvent;

        component.onRightClick(event);
        expect(selectionManagerServiceSpy.updateSelectionType).toHaveBeenCalledWith(SelectionType.Rack);
    });

    it('onRightClick should update selection type with none', () => {
        const event = {
            button: MouseButton.Right,
            offsetX: 10,
            offsetY: 10,
            target: component['gridCanvas'].nativeElement,
        } as unknown as MouseEvent;

        component.onRightClick(event);
        expect(selectionManagerServiceSpy.updateSelectionType).toHaveBeenCalledWith(SelectionType.None);
    });

    it('onLeftClick should update selection type with none', () => {
        const nativeElement = {} as HTMLCanvasElement;
        const event = {
            button: MouseButton.Right,
            offsetX: 10,
            offsetY: 10,
            target: nativeElement,
        } as unknown as MouseEvent;

        component.onLeftClick(event);
        expect(selectionManagerServiceSpy.updateSelectionType).toHaveBeenCalledWith(SelectionType.None);
    });

    it('onLeftClick should update selection type with rack', () => {
        const event = {
            button: MouseButton.Right,
            offsetX: 10,
            offsetY: 10,
            target: component['rackCanvas'].nativeElement,
        } as unknown as MouseEvent;

        component.onLeftClick(event);
        expect(selectionManagerServiceSpy.updateSelectionType).toHaveBeenCalledWith(SelectionType.Rack);
    });

    it('onLeftClick should update selection type with rack', () => {
        const event = {
            button: MouseButton.Right,
            offsetX: 10,
            offsetY: 10,
            target: component['gridCanvas'].nativeElement,
        } as unknown as MouseEvent;

        component.onLeftClick(event);
        expect(selectionManagerServiceSpy.updateSelectionType).toHaveBeenCalledWith(SelectionType.Grid);
    });

    it('should return SelectionType', () => {
        expect(component.selectionType).toEqual(SelectionType);
    });
});
