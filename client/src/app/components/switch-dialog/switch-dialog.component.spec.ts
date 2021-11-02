import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NAME_OPTION } from '@app/classes/game-options';
import { UserSettingsService } from '@app/services/user-settings.service';
import { SwitchDialogComponent } from './switch-dialog.component';

describe('SwitchDialogComponent', () => {
    let component: SwitchDialogComponent;
    let fixture: ComponentFixture<SwitchDialogComponent>;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;

    beforeEach(async () => {
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['validateName']);
        userSettingsServiceSpy.nameOption = NAME_OPTION;

        await TestBed.configureTestingModule({
            declarations: [SwitchDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
            ],
            imports: [BrowserAnimationsModule, MatRadioModule, MatCardModule, FormsModule, MatInputModule],
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
});
