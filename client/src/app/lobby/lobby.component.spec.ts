import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { RoomService } from '@app/services/room.service';
import { of } from 'rxjs';
import { LobbyComponent } from './lobby.component';

class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}
describe('LobbyComponent', () => {
    let component: LobbyComponent;
    let fixture: ComponentFixture<LobbyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LobbyComponent],
            imports: [
                MatListModule,
                MatProgressBarModule,
                MatDividerModule,
                MatProgressSpinnerModule,
                MatCardModule,
                MatDialogModule,
                RouterTestingModule.withRoutes([{ path: 'game', component: GamePageComponent }]),
            ],
            providers: [
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
                { provide: RoomService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LobbyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    describe('openQuitMultiplayerDialog', () => {
        it('should open a MatDialog box on', () => {
            // eslint-disable-next-line -- matDialog is private and we need access for the test
            const spy = spyOn(component['matDialog'], 'open');
            component.openQuitMultiplayerDialog();
            expect(spy).toHaveBeenCalled();
        });
    });
    describe('goInRoom', () => {
        it('should call "roomService.createRoom" if no id was provided', () => {
            const spy = spyOn(component.roomService, 'createRoom');
            component.goInRoom();
            expect(spy).toHaveBeenCalled();
        });
        it('should call "roomService.joinRoom" if an id was provided', () => {
            const spy = spyOn(component.roomService, 'joinRoom');
            component.goInRoom('someId');
            expect(spy).toHaveBeenCalled();
        });
    });
});
