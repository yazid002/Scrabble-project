// import { HttpClientModule } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { RouterTestingModule } from '@angular/router/testing';
// import { IOption, IOptionList, NAME_OPTION } from '@app/classes/game-options';
// import { Goal } from '@app/classes/goal';
// import { AppRoutingModule } from '@app/modules/app-routing.module';
// import { AppMaterialModule } from '@app/modules/material.module';
// import { MainPageComponent } from '@app/pages/main-page/main-page.component';
// import { GameService } from '@app/services/game.service';
// import { GoalService } from '@app/services/goal.service';
// import { PlaceService } from '@app/services/place.service';
// import { ReserveService } from '@app/services/reserve.service';
// import { TimerService } from '@app/services/timer.service';
// import { UserSettingsService } from '@app/services/user-settings.service';
// import { BehaviorSubject, of } from 'rxjs';
// import { GameOverviewComponent } from './game-overview.component';

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
//     availableChoices: [{ key: '30', value: '30s' }],
// };

// describe('GameOverviewComponent', () => {
//     let component: GameOverviewComponent;
//     let fixture: ComponentFixture<GameOverviewComponent>;
//     let goalServiceSpy: jasmine.SpyObj<GoalService>;
//     let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
//     let timerServiceSpy: jasmine.SpyObj<TimerService>;
//     let gameServiceSpy: jasmine.SpyObj<GameService>;
//     let placeServiceSpy: jasmine.SpyObj<PlaceService>;
//     beforeEach(async () => {
//         placeServiceSpy = jasmine.createSpyObj('PlaceService', ['placeWord']);
//         gameServiceSpy = jasmine.createSpyObj('GameService', ['initPlayers']);
//         timerServiceSpy = jasmine.createSpyObj('TimerService', ['resetTimerDelay']);
//         timerServiceSpy.counter = {
//             min: 0,
//             seconds: 0,
//             resetValue: 0,
//             totalTimer: 0,
//         };
//         timerServiceSpy.timerDone = new BehaviorSubject<boolean>(false);
//         userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries', 'getComputerName']);
//         userSettingsServiceSpy.getDictionaries.and.callFake(() => undefined);
//         userSettingsServiceSpy.settings = {
//             mode: { setting: MODE, currentChoiceKey: 'classic' },
//             numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'solo' },
//             computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
//             timer: { setting: TIMER, currentChoiceKey: '60' },
//         };
//         userSettingsServiceSpy.dictionnaires = [{ title: 'Espagnol', description: 'Langue espagnole' }];
//         userSettingsServiceSpy.nameOption = NAME_OPTION;
//         userSettingsServiceSpy.nameOption.userChoice = 'un nom';

//         userSettingsServiceSpy.computerName = '';
//         userSettingsServiceSpy.selectedDictionary = { title: 'Mon Dictionnaire', description: 'a description' };
//         goalServiceSpy = jasmine.createSpyObj('GoalService', ['getAUniqueGoal']);
//         goalServiceSpy.initializedSignal = new BehaviorSubject<boolean>(false);
//         await TestBed.configureTestingModule({
//             declarations: [GameOverviewComponent],
//             imports: [
//                 FormsModule,
//                 AppMaterialModule,
//                 MatDialogModule,
//                 MatButtonModule,
//                 AppRoutingModule,
//                 RouterTestingModule,
//                 MatCardModule,
//                 MatCardModule,
//                 HttpClientModule,
//                 RouterTestingModule.withRoutes([{ path: 'home', component: MainPageComponent }]),
//             ],
//             providers: [
//                 { provide: UserSettingsService, useValue: userSettingsServiceSpy },
//                 { provide: TimerService, useValue: timerServiceSpy },
//                 { provide: GameService, useValue: gameServiceSpy },
//                 ReserveService,
//                 { provide: GoalService, useValue: goalServiceSpy },
//                 { provide: PlaceService, useValue: placeServiceSpy },
//                 {
//                     provide: MatDialog,
//                     useClass: MatDialogMock,
//                 },
//             ],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(GameOverviewComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
//     it('should let settings unchanged when it cannot find it in the userSettingsService', () => {
//         let undefinedOption: undefined;

//         const INITIAL_VALUE = 'Une valeur sans importance';

//         component.computerLevel = INITIAL_VALUE;
//         // assignValues is private
//         // eslint-disable-next-line dot-notation
//         component['assignValues'](undefinedOption, undefinedOption, undefinedOption, undefinedOption);
//         expect(component.computerLevel).toEqual(INITIAL_VALUE);
//     });

//     it('should assign the right values', () => {
//         const mode: IOption = { value: 'Classic' } as IOption;
//         const numPlayers: IOption = { value: 'Solo' } as IOption;
//         const computerLevel: IOption = { value: 'Expert' } as IOption;
//         const timer: IOption = { value: '30' } as IOption;

//         const INITIAL_VALUE = 'Une valeur sans importance';

//         component.computerLevel = INITIAL_VALUE;
//         component.mode = INITIAL_VALUE;
//         component.numPlayers = INITIAL_VALUE;
//         component.timer = INITIAL_VALUE;
//         // assignValues is private
//         // eslint-disable-next-line dot-notation
//         component['assignValues'](mode, numPlayers, computerLevel, timer);
//         expect(component.computerLevel).toEqual(computerLevel.value);
//         expect(component.mode).toEqual(mode.value);
//         expect(component.numPlayers).toEqual(numPlayers.value);
//         expect(component.timer).toEqual(timer.value);
//     });

//     it("initializeGoals should initialize goal with goal service's goals", () => {
//         goalServiceSpy.publicGoals = [
//             { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: false },
//             { description: 'second goal', goalType: 1, bonus: 20, usesWord: true, complete: false },
//         ];

//         goalServiceSpy.privateGoals = [{ description: 'third goal', goalType: 2, bonus: 30, usesWord: true, complete: false }];

//         // scrollDown is private
//         // eslint-disable-next-line dot-notation
//         component['initializeGoals'](true);
//         expect(component.publicGoals).toEqual(goalServiceSpy.publicGoals);
//         expect(component.privateGoals).toEqual(goalServiceSpy.privateGoals);
//     });

//     it('initializeGoals should initialize with  getAUniqueGoal', () => {
//         goalServiceSpy.publicGoals = undefined as unknown as Goal[];
//         goalServiceSpy.privateGoals = undefined as unknown as Goal[];

//         const publicGoals = [
//             { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: false },
//             { description: 'second goal', goalType: 1, bonus: 20, usesWord: true, complete: false },
//         ];
//         const privateGoals = [
//             { description: 'third goal', goalType: 2, bonus: 30, usesWord: true, complete: false },
//             { description: 'fourth goal', goalType: 3, bonus: 40, usesWord: true, complete: false },
//         ];

//         goalServiceSpy.getAUniqueGoal.and.returnValues(
//             ...[
//                 { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: false },
//                 { description: 'second goal', goalType: 1, bonus: 20, usesWord: true, complete: false },
//                 { description: 'third goal', goalType: 2, bonus: 30, usesWord: true, complete: false },
//                 { description: 'fourth goal', goalType: 3, bonus: 40, usesWord: true, complete: false },
//             ],
//         );

//         // scrollDown is private
//         // eslint-disable-next-line dot-notation
//         component['initializeGoals'](true);
//         expect(component.publicGoals).toEqual(publicGoals);
//         expect(component.privateGoals).toEqual(privateGoals);
//     });

//     it('should open a MatDialog box on "openQuitConfirmationDialog"', () => {
//         // eslint-disable-next-line -- matDialog is private and we need access for the test
//         const spy = spyOn(component['matDialog'], 'open');
//         component.openQuitConfirmationDialog();
//         expect(spy).toHaveBeenCalled();
//     });
// });
