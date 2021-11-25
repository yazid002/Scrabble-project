import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NAME_OPTION } from '@app/classes/game-options';
import { UserSettingsService } from '@app/services/user-settings.service';
import { of } from 'rxjs';
import { SwitchDialogComponent } from './switch-dialog.component';
// import { RouterTestingModule } from '@angular/router/testing';
// import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { HttpClientModule } from '@angular/common/http';
import { RoomService } from './../../services/room.service';

class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}
describe('SwitchDialogComponent', () => {
    let component: SwitchDialogComponent;
    let fixture: ComponentFixture<SwitchDialogComponent>;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;

    beforeEach(async () => {
        // userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['validateName']);
        // userSettingsServiceSpy.nameOption = NAME_OPTION;

        await TestBed.configureTestingModule({
            declarations: [SwitchDialogComponent],
            providers: [
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
                { provide: RoomService },
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

    it('should quit Room', () => {
        // eslint-disable-next-line dot-notation
        const quitRoomSpy = spyOn(component['roomService'], 'quitRoom');
        component.quitRoom();
        expect(quitRoomSpy).toHaveBeenCalled();
    });
});
