import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { RoomService } from '@app/services/room.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { of } from 'rxjs';
import { LobbyComponent } from './lobby.component';

class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}
describe('LobbyComponent', () => {
    let component: LobbyComponent;
    let fixture: ComponentFixture<LobbyComponent>;
    let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;

    beforeEach(async () => {
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playClickOnButtonAudio']);
        await TestBed.configureTestingModule({
            declarations: [LobbyComponent],
            imports: [
                MatListModule,
                MatProgressBarModule,
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
        fixture = TestBed.createComponent(LobbyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('openQuitMultiplayerDialog', () => {
        it('should open a MatDialog box on', () => {
            // eslint-disable-next-line -- matDialog is private and we need access for the test
            const spy = spyOn(component['matDialog'], 'open');
            component.openQuitMultiplayerDialog();
            expect(spy).toHaveBeenCalled();
        });
    });
    describe('goInRoom', () => {
        it('should call "roomService.createRoom" if no id was provided', () => {
            const spy = spyOn(component.roomService, 'createRoom');
            component.goInRoom();
            expect(spy).toHaveBeenCalled();
        });
        it('should call "roomService.joinRoom" if an id was provided', () => {
            const spy = spyOn(component.roomService, 'joinRoom');
            component.goInRoom('someId');
            expect(spy).toHaveBeenCalled();
        });
    });
    it('should only assign values to settings when they are defined', () => {
        const initName = 'initial name';
        component.name = initName;
        let undefString: undefined;
        let undefIoption: undefined;
        // eslint-disable-next-line dot-notation
        component['assignValues'](undefString, undefIoption);
        expect(component.name).toEqual(initName);

        const newName = 'New Name';
        const newOption = { key: 'a key', value: 'a value' };
        // eslint-disable-next-line dot-notation
        component['assignValues'](newName, newOption);
        expect(component.name).toEqual(newName);
    });
    it('completeGoalSound should play an audio', () => {
        soundManagerServiceSpy.playClickOnButtonAudio.and.returnValue(void '');
        component.playClickOnButtonAudio();
        expect(soundManagerServiceSpy.playClickOnButtonAudio).toHaveBeenCalled();
    });
});
