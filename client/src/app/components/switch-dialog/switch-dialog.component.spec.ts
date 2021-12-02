import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IOptionList } from '@app/classes/game-options';
import { UserSettingsService } from '@app/services/user-settings.service';
import { of } from 'rxjs';
import { GamePageComponent } from './../../pages/game-page/game-page.component';
import { RoomService } from './../../services/room.service';
import { SwitchDialogComponent } from './switch-dialog.component';

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

describe('SwitchDialogComponent', () => {
    let component: SwitchDialogComponent;
    let fixture: ComponentFixture<SwitchDialogComponent>;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
    let roomServiceSpy: jasmine.SpyObj<RoomService>;

    beforeEach(async () => {
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['validateName']);
        roomServiceSpy = jasmine.createSpyObj('RoomService', ['quitRoom']);
        userSettingsServiceSpy.settings = {
            mode: { setting: MODE, currentChoiceKey: 'classic' },
            numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'log2990' },
            computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
            timer: { setting: TIMER, currentChoiceKey: '60' },
        };

        await TestBed.configureTestingModule({
            declarations: [SwitchDialogComponent],
            providers: [
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
                { provide: RoomService, useValue: roomServiceSpy },
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: RouterModule },
            ],
            imports: [
                // RouterTestingModule.withRoutes([{ path: 'home', component: GamePageComponent }]),
                BrowserAnimationsModule,
                MatRadioModule,
                HttpClientModule,
                MatCardModule,
                FormsModule,
                MatInputModule,
                MatDialogModule,
                RouterModule,
                RouterTestingModule.withRoutes([{ path: 'game', component: GamePageComponent }]),
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SwitchDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should assign solo to ', () => {
        component.assignSolo();
        expect(userSettingsServiceSpy.settings.numPlayers.currentChoiceKey).toEqual('solo');
    });
});
