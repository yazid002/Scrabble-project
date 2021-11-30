/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { MouseButton } from '@app/enums/mouse-enums';
import { SelectionType } from '@app/enums/selection-enum';
import { SelectionManagerService } from '@app/services/selection-manager.service';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let selectionManagerServiceSpy: SelectionManagerService;

    beforeEach(async () => {
        selectionManagerServiceSpy = jasmine.createSpyObj('SelectionManagerService', ['updateSelectionType']);

        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            imports: [MatButtonModule, HttpClientModule],
            providers: [{ provide: SelectionManagerService, useValue: selectionManagerServiceSpy }],
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
