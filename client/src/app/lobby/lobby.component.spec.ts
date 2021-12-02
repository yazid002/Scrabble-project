import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { IOptionList, NAME_OPTION } from '@app/classes/game-options';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { RoomService } from '@app/services/room.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { of } from 'rxjs';
import { LobbyComponent } from './lobby.component';

class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}
const NUM_PLAYERS: IOptionList = {
    settingName: 'Nombre de joueurs',
    availableChoices: [
        { key: 'solo', value: 'Solo' },
        { key: 'multiplayer', value: 'Multijoueurs', disabled: false },
    ],
};

const COMPUTER_LEVEL: IOptionList = {
    settingName: "Niveau de l'ordinateur",
    availableChoices: [
        { key: 'beginner', value: 'Débutant' },
        { key: 'advanced', value: 'Avancé' },
    ],
};
const MODE: IOptionList = {
    settingName: 'Mode de jeux',
    availableChoices: [
        { key: 'classic', value: 'Classique' },
        { key: 'log2990', value: 'LOG2990', disabled: true },
    ],
};

const TIMER: IOptionList = {
    settingName: 'Temps maximal par tour',
    availableChoices: [
        { key: '30', value: '30s' },
        { key: '60', value: '1m' },
        { key: '90', value: '1m30s' },
        { key: '120', value: '2m' },
        { key: '150', value: '2m30s' },
        { key: '180', value: '3m' },
        { key: '210', value: '3m30' },
        { key: '240', value: '4m' },
        { key: '270', value: '4m30' },
        { key: '300', value: '5m' },
    ],
};
describe('LobbyComponent', () => {
    let component: LobbyComponent;
    let fixture: ComponentFixture<LobbyComponent>;
    let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
    let roomServiceSpy: jasmine.SpyObj<RoomService>;

    beforeEach(async () => {
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playClickOnButtonAudio']);
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getComputerName']);
        userSettingsServiceSpy.nameOption = NAME_OPTION;
        roomServiceSpy = jasmine.createSpyObj('RoomService', ['joinRoom', 'createRoom']);
        userSettingsServiceSpy.settings = {
            mode: { setting: MODE, currentChoiceKey: 'classic' },
            numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'solo' },
            computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
            timer: { setting: TIMER, currentChoiceKey: '60' },
        };
        userSettingsServiceSpy.selectedDictionary = { title: 'Mon Dictionnaire', description: 'a description' };

        roomServiceSpy.rooms = [{ name: 'a room test', id: 'an id', settings: { mode: 'classic', timer: '60' }, clients: ['a client'] }];
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
                { provide: RoomService, useValue: roomServiceSpy },
                { provide: SoundManagerService, useValue: soundManagerServiceSpy },
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
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
        it('should call "roomService.createRoom" if no id and index were provided', () => {
            component.goInRoom();
            expect(roomServiceSpy.createRoom).toHaveBeenCalled();
        });
        it('should call "roomService.joinRoom" if an id and index were provided', () => {
            component.goInRoom('someId', 0);
            expect(roomServiceSpy.joinRoom).toHaveBeenCalled();
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
