import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NAME_OPTION } from '@app/classes/game-options';
import { UserSettingsService } from '@app/services/user-settings.service';
import { GameModeDialogComponent } from './game-mode-dialog.component';

describe('GameModeDialogComponent', () => {
    let component: GameModeDialogComponent;
    let fixture: ComponentFixture<GameModeDialogComponent>;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;

    beforeEach(async () => {
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['validateName']);
        userSettingsServiceSpy.nameOption = NAME_OPTION;

        await TestBed.configureTestingModule({
            declarations: [GameModeDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
            ],
            imports: [BrowserAnimationsModule, MatRadioModule, MatCardModule, FormsModule, MatInputModule],
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
});
