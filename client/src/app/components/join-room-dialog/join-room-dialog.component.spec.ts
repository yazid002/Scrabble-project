import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IOptionList, NAME_OPTION } from '@app/classes/game-options';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { of } from 'rxjs';
import { JoinRoomDialogComponent } from './join-room-dialog.component';

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
describe('JoinRoomDialogComponent', () => {
    let component: JoinRoomDialogComponent;
    let fixture: ComponentFixture<JoinRoomDialogComponent>;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
    let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;

    beforeEach(async () => {
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playClickOnButtonAudio']);
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['validateName']);
        userSettingsServiceSpy.joinSettings = {
            mode: { setting: MODE, currentChoiceKey: 'classic' },
        };
        userSettingsServiceSpy.nameOption = NAME_OPTION;
        userSettingsServiceSpy.computerName = '';
        await TestBed.configureTestingModule({
            declarations: [JoinRoomDialogComponent],
            providers: [
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
                { provide: SoundManagerService, useValue: soundManagerServiceSpy },
            ],
            imports: [BrowserAnimationsModule, MatRadioModule, MatCardModule, FormsModule, MatInputModule, MatDialogModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(JoinRoomDialogComponent);
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
});
