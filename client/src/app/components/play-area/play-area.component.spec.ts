/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            imports: [MatButtonModule],
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

    it('should call the grid when left mouse click is on grid native element', () => {
        const event = {} as MouseEvent;
        const getSelectionTypeSpy = spyOn(component['selectionManager'], 'getSelectionType');
        component.onLeftClick(event);
        expect(getSelectionTypeSpy).toHaveBeenCalled();
    });

    it('should call the rack when on right mouse click is on the rack native element', () => {
        const event = {} as MouseEvent;
        const getSelectionTypeSpy = spyOn(component['selectionManager'], 'getSelectionType');
        component.onRightClick(event);
        expect(getSelectionTypeSpy).toHaveBeenCalled();
    });

    it('should call execute when skipTurn is called', () => {
        const passExecutionExecuteSpy = spyOn(component['passExecutionService'], 'execute');
        component.skipTurn();
        expect(passExecutionExecuteSpy).toHaveBeenCalled();
    });
});
