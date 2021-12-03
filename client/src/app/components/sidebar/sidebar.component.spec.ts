import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { IOptionList, NAME_OPTION } from '@app/classes/game-options';
import { GameOverviewComponent } from '@app/components/game-overview/game-overview.component';
import { QuitConfirmationDialogComponent } from '@app/components/quit-confirmation-dialog/quit-confirmation-dialog.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameService } from '@app/services/game.service';
import { GoalService } from '@app/services/goal.service';
import { PlaceService } from '@app/services/place.service';
import { ReserveService } from '@app/services/reserve.service';
import { TimerService } from '@app/services/timer.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { BehaviorSubject, of } from 'rxjs';

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
    availableChoices: [{ key: '30', value: '30s' }],
};
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let goalServiceSpy: jasmine.SpyObj<GoalService>;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
    let timerServiceSpy: jasmine.SpyObj<TimerService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let placeServiceSpy: jasmine.SpyObj<PlaceService>;

    beforeEach(async () => {
        placeServiceSpy = jasmine.createSpyObj('PlaceService', ['placeWord']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['initPlayers']);
        timerServiceSpy = jasmine.createSpyObj('TimerService', ['resetTimerDelay']);
        timerServiceSpy.counter = {
            min: 0,
            seconds: 0,
            resetValue: 0,
            totalTimer: 0,
        };
        timerServiceSpy.timerDone = new BehaviorSubject<boolean>(false);
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries', 'getComputerName']);
        userSettingsServiceSpy.getDictionaries.and.callFake(() => undefined);
        userSettingsServiceSpy.settings = {
            mode: { setting: MODE, currentChoiceKey: 'classic' },
            numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'solo' },
            computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
            timer: { setting: TIMER, currentChoiceKey: '60' },
        };
        userSettingsServiceSpy.dictionnaires = [{ title: 'Espagnol', description: 'Langue espagnole' }];
        userSettingsServiceSpy.nameOption = NAME_OPTION;
        userSettingsServiceSpy.nameOption.userChoice = 'un nom';

        userSettingsServiceSpy.computerName = '';
        userSettingsServiceSpy.selectedDictionary = { title: 'Mon Dictionnaire', description: 'a description' };
        goalServiceSpy = jasmine.createSpyObj('GoalService', ['getAUniqueGoal']);
        goalServiceSpy.initializedSignal = new BehaviorSubject<boolean>(false);
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                AppMaterialModule,
                MatDialogModule,
                MatButtonModule,
                AppRoutingModule,
                RouterTestingModule,
                MatCardModule,
                HttpClientModule,
            ],
            declarations: [SidebarComponent, QuitConfirmationDialogComponent, GameOverviewComponent],
            providers: [
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
                { provide: TimerService, useValue: timerServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                ReserveService,
                { provide: GoalService, useValue: goalServiceSpy },
                { provide: PlaceService, useValue: placeServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open a MatDialog box on "openQuitConfirmationDialog"', () => {
        // eslint-disable-next-line -- matDialog is private and we need access for the test
        const spy = spyOn(component['matDialog'], 'open');
        component.openQuitConfirmationDialog();
        expect(spy).toHaveBeenCalled();
    });
});
