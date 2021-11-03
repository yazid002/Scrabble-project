import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IOptionList, NAME_OPTION } from '@app/classes/game-options';
import { UserSettingsService } from '@app/services/user-settings.service';
import { of } from 'rxjs';
import { GameModeDialogComponent } from './game-mode-dialog.component';

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
        { key: '120', value: '2m' },
        { key: '150', value: '2m30s' },
        { key: '180', value: '3m' },
        { key: '210', value: '3m30' },
        { key: '240', value: '4m' },
        { key: '270', value: '4m30' },
        { key: '300', value: '5m' },
    ],
};

describe('GameModeDialogComponent', () => {
    let component: GameModeDialogComponent;
    let fixture: ComponentFixture<GameModeDialogComponent>;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;

    beforeEach(async () => {
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['validateName']);
        userSettingsServiceSpy.settings = {
            mode: { setting: MODE, currentChoiceKey: 'classic' },
            numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'solo' },
            computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
            timer: { setting: TIMER, currentChoiceKey: '60' },
        };
        userSettingsServiceSpy.nameOption = NAME_OPTION;
        userSettingsServiceSpy.computerName = '';
        await TestBed.configureTestingModule({
            declarations: [GameModeDialogComponent],
            providers: [
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
            ],
            imports: [BrowserAnimationsModule, MatRadioModule, MatCardModule, FormsModule, MatInputModule, MatDialogModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameModeDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('validateName should call validateName of UserSettingsService', () => {
        userSettingsServiceSpy.validateName.and.returnValue({ error: true, errorMessage: 'Une erreur de test' });
        component.validateName();
        expect(userSettingsServiceSpy.validateName).toHaveBeenCalled();
    });

    it('validateName should change error and errorMessage', () => {
        const expectedResult = { error: true, errorMessage: 'Une erreur de test' };
        userSettingsServiceSpy.validateName.and.returnValue(expectedResult);

        component.validateName();

        expect(component.error).toEqual(expectedResult.error);
        expect(component.errorMessage).toEqual(expectedResult.errorMessage);
    });
    describe('numPlayerChoice()', () => {
        it('should return true if namPlayer===multiplayer and return false when numPlayers===solo', () => {
            userSettingsServiceSpy.settings.numPlayers.currentChoiceKey = 'multiplayer';
            expect(component.numPlayerChoice()).toEqual(true);
            userSettingsServiceSpy.settings.numPlayers.currentChoiceKey = 'solo';
            expect(component.numPlayerChoice()).toEqual(false);
        });
    });
});
