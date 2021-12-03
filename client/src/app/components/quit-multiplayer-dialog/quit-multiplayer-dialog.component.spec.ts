import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { RoomService } from '@app/services/room.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
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
    let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;
    let roomServiceSpy: jasmine.SpyObj<RoomService>;

    beforeEach(async () => {
        roomServiceSpy = jasmine.createSpyObj('RoomService', ['quitRoom']);
        roomServiceSpy.quitRoom.and.returnValue(void '');
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playClickOnButtonAudio']);
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                AppMaterialModule,
                MatButtonModule,
                MatDialogModule,
                HttpClientModule,
                RouterTestingModule,
                RouterTestingModule.withRoutes([{ path: 'home', component: MainPageComponent }]),
            ],
            declarations: [QuitMultiplayerDialogComponent],
            providers: [
                { provide: SoundManagerService, useValue: soundManagerServiceSpy },
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: RoomService, useValue: roomServiceSpy },
            ],
        }).compileComponents();
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
        component.quitRoom();
        expect(roomServiceSpy.quitRoom).toHaveBeenCalled();
    });

    it('completeGoalSound should play an audio', () => {
        soundManagerServiceSpy.playClickOnButtonAudio.and.returnValue(void '');
        component.playClickOnButtonAudio();
        expect(soundManagerServiceSpy.playClickOnButtonAudio).toHaveBeenCalled();
    });
});
