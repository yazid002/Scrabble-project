import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IOptionList, NAME_OPTION } from '@app/classes/game-options';
import { PLAYER } from '@app/classes/player';
import { GameService } from '@app/services/game.service';
import { GoalsManagerService } from '@app/services/goals-manager.service';
import { RandomModeService } from '@app/services/random-mode.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
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
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let goalsManagerServiceSpy: jasmine.SpyObj<GoalsManagerService>;
    let randomModeServiceSpy: jasmine.SpyObj<RandomModeService>;
    let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;

    beforeEach(async () => {
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playClickOnButtonAudio']);
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['validateName']);
        userSettingsServiceSpy.settings = {
            mode: { setting: MODE, currentChoiceKey: 'classic' },
            numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'solo' },
            computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
            timer: { setting: TIMER, currentChoiceKey: '60' },
        };
        userSettingsServiceSpy.dictionaryControl = new FormControl('', Validators.required);
        userSettingsServiceSpy.dictionnaires = [{ title: 'Espagnol', description: 'Langue espagnole', words: [] }];
        userSettingsServiceSpy.nameOption = NAME_OPTION;
        randomModeServiceSpy = jasmine.createSpyObj('RandomModeService', ['getRandomIntInclusive']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['initPlayers']);
        const player = {
            id: PLAYER.realPlayer,
            name: 'Random name',
            rack: [
                { name: 'A', quantity: 9, points: 1, display: 'A' },
                { name: 'B', quantity: 2, points: 3, display: 'B' },
                { name: 'C', quantity: 2, points: 3, display: 'C' },
                { name: 'D', quantity: 3, points: 2, display: 'D' },
                { name: 'E', quantity: 15, points: 1, display: 'E' },
            ],
            points: 0,
            turnWithoutSkipAndExchangeCounter: 0,
            placeInTenSecondsGoalCounter: 0,
            wordsMapping: new Map<string, number>(),
            words: [],
        };
        gameServiceSpy.players = [player];

        goalsManagerServiceSpy = jasmine.createSpyObj('GoalsManagerService', ['initPlayers']);

        userSettingsServiceSpy.computerName = '';
        await TestBed.configureTestingModule({
            declarations: [GameModeDialogComponent],
            providers: [
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
                { provide: RandomModeService, useValue: randomModeServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: GoalsManagerService, useValue: goalsManagerServiceSpy },
                { provide: SoundManagerService, useValue: soundManagerServiceSpy },
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

    describe('configureGame()', () => {
        it('should set well game service parameters', () => {
            gameServiceSpy.players[PLAYER.realPlayer].name = '';
            gameServiceSpy.numPlayers = 'solo';

            userSettingsServiceSpy.nameOption.userChoice = 'un nom';
            userSettingsServiceSpy.settings.numPlayers.currentChoiceKey = 'multiplayer';

            component.configureGame();

            expect(gameServiceSpy.players[PLAYER.realPlayer].name).toEqual('un nom');

            expect(gameServiceSpy.numPlayers).toEqual('multiplayer');
        });

        it('should set well goalsManager service enabled/disabled parameter', () => {
            goalsManagerServiceSpy.isEnabled = false;
            userSettingsServiceSpy.settings.mode.currentChoiceKey = 'log2990';

            component.configureGame();

            expect(goalsManagerServiceSpy.isEnabled).toEqual(true);
        });
    });
    it('completeGoalSound should play an audio', () => {
        soundManagerServiceSpy.playClickOnButtonAudio.and.returnValue(void '');
        component.playClickOnButtonAudio();
        expect(soundManagerServiceSpy.playClickOnButtonAudio).toHaveBeenCalled();
    });

    describe('applyRandomMode()', () => {
        it('should set right randomService checked parameter and that the mode is activated', () => {
            component.message = 'rien';
            randomModeServiceSpy.isChecked = false;

            const event: MatCheckboxChange = {
                checked: true,
            } as MatCheckboxChange;

            component.applyRandomMode(event);

            expect(component.message).toEqual('MODE BONUS ALEATOIRE ACTIVÉ');
            expect(randomModeServiceSpy.isChecked).toEqual(true);
        });

        it('should set right randomService checked parameter and that the mode is deactivated', () => {
            component.message = 'rien';
            randomModeServiceSpy.isChecked = true;

            const event: MatCheckboxChange = {
                checked: false,
            } as MatCheckboxChange;

            component.applyRandomMode(event);

            expect(component.message).toEqual('MODE BONUS ALEATOIRE DESACTIVÉ');
            expect(randomModeServiceSpy.isChecked).toEqual(false);
        });
    });
});
