import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { IOption } from '@app/classes/game-options';
import { Goal } from '@app/classes/goal';
import { GoalService } from '@app/services/goal.service';
import { ReserveService } from '@app/services/reserve.service';
import { TimerService } from '@app/services/timer.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { GameOverviewComponent } from './game-overview.component';

describe('GameOverviewComponent', () => {
    let component: GameOverviewComponent;
    let fixture: ComponentFixture<GameOverviewComponent>;
    let goalServiceSpy: jasmine.SpyObj<GoalService>;

    beforeEach(async () => {
        goalServiceSpy = jasmine.createSpyObj('GoalService', ['getAUniqueGoal']);
        await TestBed.configureTestingModule({
            declarations: [GameOverviewComponent],
            imports: [MatCardModule, HttpClientModule],
            providers: [UserSettingsService, ReserveService, TimerService, { provide: GoalService, useValue: goalServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should let settings unchanged when it cannot find it in the userSettingsService', () => {
        let undefinedOption: undefined;

        const INITIAL_VALUE = 'Une valeur sans importance';

        component.computerLevel = INITIAL_VALUE;
        // Car assignValues est privée
        // eslint-disable-next-line dot-notation
        component['assignValues'](undefinedOption, undefinedOption, undefinedOption, undefinedOption);
        expect(component.computerLevel).toEqual(INITIAL_VALUE);
    });

    it('should assign the right values', () => {
        const mode: IOption = { value: 'Classic' } as IOption;
        const numPlayers: IOption = { value: 'Solo' } as IOption;
        const computerLevel: IOption = { value: 'Expert' } as IOption;
        const timer: IOption = { value: '30' } as IOption;

        const INITIAL_VALUE = 'Une valeur sans importance';

        component.computerLevel = INITIAL_VALUE;
        component.mode = INITIAL_VALUE;
        component.numPlayers = INITIAL_VALUE;
        component.timer = INITIAL_VALUE;
        // Car assignValues est privée
        // eslint-disable-next-line dot-notation
        component['assignValues'](mode, numPlayers, computerLevel, timer);
        expect(component.computerLevel).toEqual(computerLevel.value);
        expect(component.mode).toEqual(mode.value);
        expect(component.numPlayers).toEqual(numPlayers.value);
        expect(component.timer).toEqual(timer.value);
    });

    it("initializeGoals should initialize goal with goal service's goals", () => {
        goalServiceSpy.publicGoals = [
            { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: false },
            { description: 'second goal', goalType: 1, bonus: 20, usesWord: true, complete: false },
        ];

        goalServiceSpy.privateGoals = [{ description: 'third goal', goalType: 2, bonus: 30, usesWord: true, complete: false }];

        // Car scrollDown est privée
        // eslint-disable-next-line dot-notation
        component['initializeGoals']();
        expect(component.publicGoals).toEqual(goalServiceSpy.publicGoals);
        expect(component.privateGoals).toEqual(goalServiceSpy.privateGoals);
    });

    it('initializeGoals should initialize with  getAUniqueGoal', () => {
        goalServiceSpy.publicGoals = undefined as unknown as Goal[];
        goalServiceSpy.privateGoals = undefined as unknown as Goal[];

        const publicGoals = [
            { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: false },
            { description: 'second goal', goalType: 1, bonus: 20, usesWord: true, complete: false },
        ];
        const privateGoals = [
            { description: 'third goal', goalType: 2, bonus: 30, usesWord: true, complete: false },
            { description: 'fourth goal', goalType: 3, bonus: 40, usesWord: true, complete: false },
        ];

        goalServiceSpy.getAUniqueGoal.and.returnValues(
            ...[
                { description: 'first goal', goalType: 0, bonus: 10, usesWord: true, complete: false },
                { description: 'second goal', goalType: 1, bonus: 20, usesWord: true, complete: false },
                { description: 'third goal', goalType: 2, bonus: 30, usesWord: true, complete: false },
                { description: 'fourth goal', goalType: 3, bonus: 40, usesWord: true, complete: false },
            ],
        );

        // Car scrollDown est privée
        // eslint-disable-next-line dot-notation
        component['initializeGoals']();
        expect(component.publicGoals).toEqual(publicGoals);
        expect(component.privateGoals).toEqual(privateGoals);
    });
});
