import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { RoomService } from '@app/services/room.service';
import { QuitMultiplayerDialogComponent } from './quit-multiplayer-dialog.component';

describe('QuitMultiplayerDialogComponent', () => {
    let component: QuitMultiplayerDialogComponent;
    let fixture: ComponentFixture<QuitMultiplayerDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QuitMultiplayerDialogComponent],
            imports: [RouterTestingModule.withRoutes([{ path: 'game', component: GamePageComponent }])],
            providers: [{ provide: RoomService }],
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
        // eslint-disable-next-line dot-notation
        const quitRoomSpy = spyOn(component['roomService'], 'quitRoom');
        component.quitRoom();
        expect(quitRoomSpy).toHaveBeenCalled();
    });
});
