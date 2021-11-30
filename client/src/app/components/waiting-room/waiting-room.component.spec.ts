import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { RoomService } from '@app/services/room.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { of } from 'rxjs';
import { WaitingRoomComponent } from './waiting-room.component';

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
    let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;

    beforeEach(async () => {
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playClickOnButtonAudio']);
        await TestBed.configureTestingModule({
            declarations: [WaitingRoomComponent],
            imports: [
                MatDividerModule,
                MatProgressSpinnerModule,
                MatCardModule,
                MatDialogModule,
                HttpClientModule,
                RouterTestingModule.withRoutes([{ path: 'game', component: GamePageComponent }]),
            ],
            providers: [
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: RoomService },
                { provide: SoundManagerService, useValue: soundManagerServiceSpy },
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
    it('should only assign values to settings when they are defined', () => {
        const initName = 'initial name';
        component.name = initName;
        let undefString: undefined;
        let undefIoption: undefined;
        let undefDictionary: undefined;
        // eslint-disable-next-line dot-notation
        component['assignValues'](undefString, undefIoption, undefIoption, undefDictionary);
        expect(component.name).toEqual(initName);

        const newName = 'New Name';
        const newOption = { key: 'a key', value: 'a value' };
        const newDictionary = { title: 'a value ', description: 'a value', words: [] };
        // eslint-disable-next-line dot-notation
        component['assignValues'](newName, newOption, newOption, newDictionary);
        expect(component.name).toEqual(newName);
    });
    it('completeGoalSound should play an audio', () => {
        soundManagerServiceSpy.playClickOnButtonAudio.and.returnValue(void '');
        component.playClickOnButtonAudio();
        expect(soundManagerServiceSpy.playClickOnButtonAudio).toHaveBeenCalled();
    });
});
