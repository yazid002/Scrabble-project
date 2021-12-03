// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { AppMaterialModule } from '@app/modules/material.module';
// import { GameService } from '@app/services/game.service';
// import { SoundManagerService } from '@app/services/sound-manager.service';
// import { QuitConfirmationDialogComponent } from './quit-confirmation-dialog.component';

// describe('QuitConfirmationDialogComponent', () => {
//     let component: QuitConfirmationDialogComponent;
//     let fixture: ComponentFixture<QuitConfirmationDialogComponent>;
//     let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;
//     let gameServiceSpy: jasmine.SpyObj<GameService>;

//     beforeEach(async () => {
//         soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playQuitGameAudio']);
//         gameServiceSpy = jasmine.createSpyObj('GameService', ['quitGame']);
//         await TestBed.configureTestingModule({
//             declarations: [QuitConfirmationDialogComponent],
//             providers: [
//                 { provide: SoundManagerService, useValue: soundManagerServiceSpy },
//                 { provide: GameService, useValue: gameServiceSpy },
//             ],
//             imports: [FormsModule, AppMaterialModule, HttpClientTestingModule],
//         }).compileComponents();
//         gameServiceSpy.quitGame.and.returnValue(void '');
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(QuitConfirmationDialogComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should quit game', () => {
//         component.quitGame();
//         expect(gameServiceSpy.quitGame).toHaveBeenCalled();
//     });
// });
