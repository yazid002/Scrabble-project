import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { WaitingRoomComponent } from './waiting-room.component';
import { RouterTestingModule } from '@angular/router/testing';
import { RoomService } from '@app/services/room.service';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';

class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}
describe('WaitingRoomComponent', () => {
    let component: WaitingRoomComponent;
    let fixture: ComponentFixture<WaitingRoomComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WaitingRoomComponent],
            imports: [MatDialogModule, RouterTestingModule.withRoutes([{ path: 'game', component: GamePageComponent }])],
            providers: [
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: RoomService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should open a MatDialog box on "openSwitchToSoloDialog"', () => {
        // eslint-disable-next-line -- matDialog is private and we need access for the test
        const spy = spyOn(component['matDialog'], 'open');
        component.openSwitchToSoloDialog();
        expect(spy).toHaveBeenCalled();
    });
    it('should open a MatDialog box on "openQuitMultiplayerDialog"', () => {
        // eslint-disable-next-line -- matDialog is private and we need access for the test
        const spy = spyOn(component['matDialog'], 'open');
        component.openQuitMultiplayerDialog();
        expect(spy).toHaveBeenCalled();
    });
    it('should only assign values to setitngs when they are defined', () => {
        const initName = 'initial name';
        component.name = initName;
        let undefString: undefined;
        let undefIoption: undefined;
        // eslint-disable-next-line dot-notation
        component['assignValues'](undefString, undefIoption, undefIoption);
        expect(component.name).toEqual(initName);

        const newName = 'New Name';
        const newOption = { key: 'a key', value: 'a value' };
        // eslint-disable-next-line dot-notation
        component['assignValues'](newName, newOption, newOption);
        expect(component.name).toEqual(newName);
    });
});
