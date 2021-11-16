import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { RoomService } from '@app/services/room.service';
import { of } from 'rxjs';
import { QuitMultiplayerDialogComponent } from './quit-multiplayer-dialog.component';

class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}

describe('QuitMultiplayerDialogComponent', () => {
    let component: QuitMultiplayerDialogComponent;
    let fixture: ComponentFixture<QuitMultiplayerDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatButtonModule,
                MatDialogModule,
                HttpClientModule,
                RouterTestingModule.withRoutes([{ path: 'home', component: MainPageComponent }]),
            ],
            declarations: [QuitMultiplayerDialogComponent],
            providers: [{ provide: MatDialog, useClass: MatDialogMock }, { provide: RoomService }],
        }).compileComponents();
        // RoomService -> GameSyncService -> PlaceSelectionService -> VerifyService -> HttpClient -> HttpClient
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QuitMultiplayerDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(QuitMultiplayerDialogComponent);
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
