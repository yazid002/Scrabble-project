// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { RouterTestingModule } from '@angular/router/testing';
// import { IOptionList, NAME_OPTION } from '@app/classes/game-options';
// import { AppRoutingModule } from '@app/modules/app-routing.module';
// import { AppMaterialModule } from '@app/modules/material.module';
// import { MainPageComponent } from '@app/pages/main-page/main-page.component';
// import { SoundManagerService } from '@app/services/sound-manager.service';
// import { UserSettingsService } from '@app/services/user-settings.service';
// import { of } from 'rxjs';

// class MatDialogMock {
//     open() {
//         return {
//             afterClosed: () => of({}),
//         };
//     }
// }

// const MODE: IOptionList = {
//     settingName: 'Mode de jeux',
//     availableChoices: [
//         { key: 'classic', value: 'Classique' },
//         { key: 'log2990', value: 'LOG2990', disabled: true },
//     ],
// };
// const NUM_PLAYERS: IOptionList = {
//     settingName: 'Nombre de joueurs',
//     availableChoices: [
//         { key: 'solo', value: 'Solo' },
//         { key: 'multiplayer', value: 'Multijoueurs', disabled: false },
//     ],
// };
// const COMPUTER_LEVEL: IOptionList = {
//     settingName: "Niveau de l'ordinateur",
//     availableChoices: [{ key: 'beginner', value: 'Débutant' }],
// };

// const TIMER: IOptionList = {
//     settingName: 'Temps maximal par tour',
//     availableChoices: [
//         { key: '30', value: '30s' },
//         { key: '60', value: '1m' },
//         { key: '90', value: '1m30s' },
//     ],
// };
// describe('MainPageComponent', () => {
//     let component: MainPageComponent;
//     let fixture: ComponentFixture<MainPageComponent>;
//     let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;
//     let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;

//     beforeEach(async () => {
//         userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries', 'getComputerName']);
//         userSettingsServiceSpy.getDictionaries.and.callFake(() => undefined);
//         userSettingsServiceSpy.settings = {
//             mode: { setting: MODE, currentChoiceKey: 'classic' },
//             numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'solo' },
//             computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
//             timer: { setting: TIMER, currentChoiceKey: '60' },
//         };
//         userSettingsServiceSpy.nameOption = NAME_OPTION;
//         userSettingsServiceSpy.nameOption.userChoice = 'un nom';
//         userSettingsServiceSpy.selectedDictionary = { title: 'Mon Dictionnaire', description: 'a description' };
//         soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playClickOnButtonAudio']);
//         await TestBed.configureTestingModule({
//             imports: [
//                 FormsModule,
//                 AppMaterialModule,
//                 AppMaterialModule,
//                 FormsModule,
//                 MatDialogModule,
//                 MatButtonModule,
//                 AppRoutingModule,
//                 RouterTestingModule,
//                 HttpClientTestingModule,
//             ],
//             declarations: [MainPageComponent],
//             providers: [
//                 {
//                     provide: MatDialog,
//                     useClass: MatDialogMock,
//                 },
//                 { provide: SoundManagerService, useValue: soundManagerServiceSpy },
//                 { provide: UserSettingsService, useValue: userSettingsServiceSpy },
//             ],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(MainPageComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should open a MatDialog box asking for the settings of the game we want to create', () => {
//         // eslint-disable-next-line -- matDialog is private and we need access for the test
//         const spy = spyOn(component['matDialog'], 'open');
//         component.openCreateRoomDialog();
//         expect(spy).toHaveBeenCalled();
//     });
//     it('should open a MatDialog box asking for the mode of the game we want to join', () => {
//         // eslint-disable-next-line -- matDialog is private and we need access for the test
//         const spy = spyOn(component['matDialog'], 'open');
//         component.openJoinRoomDialog();
//         expect(spy).toHaveBeenCalled();
//     });
// });
