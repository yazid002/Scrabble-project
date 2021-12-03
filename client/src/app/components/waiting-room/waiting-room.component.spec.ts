import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { IOptionList, NAME_OPTION } from '@app/classes/game-options';
import { AppMaterialModule } from '@app/modules/material.module';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { RoomService } from '@app/services/room.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { of } from 'rxjs';
import { WaitingRoomComponent } from './waiting-room.component';

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
        { key: '120', value: '2m' },
        { key: '150', value: '2m30s' },
        { key: '180', value: '3m' },
        { key: '210', value: '3m30' },
        { key: '240', value: '4m' },
        { key: '270', value: '4m30' },
        { key: '300', value: '5m' },
    ],
};

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
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;

    beforeEach(async () => {
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playClickOnButtonAudio']);
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['validateName', 'getComputerName', 'getDictionaries']);
        userSettingsServiceSpy.settings = {
            mode: { setting: MODE, currentChoiceKey: 'classic' },
            numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'solo' },
            computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
            timer: { setting: TIMER, currentChoiceKey: '60' },
        };
        userSettingsServiceSpy.nameOption = NAME_OPTION;
        userSettingsServiceSpy.nameOption.userChoice = 'un nom';
        userSettingsServiceSpy.dictionnaires = [{ title: 'Espagnol', description: 'Langue espagnole' }];
        userSettingsServiceSpy.selectedDictionary = { title: 'Espagnol', description: 'Langue espagnole' };
        userSettingsServiceSpy.getDictionaries.and.returnValue(undefined);
        await TestBed.configureTestingModule({
            declarations: [WaitingRoomComponent],
            imports: [
                FormsModule,
                AppMaterialModule,
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
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        spyOn(component.roomService, 'createRoom').and.returnValue('created');
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
