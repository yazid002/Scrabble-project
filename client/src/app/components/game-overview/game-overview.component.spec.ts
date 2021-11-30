import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { IOption } from '@app/classes/game-options';
import { Goal } from '@app/classes/goal';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { GoalService } from '@app/services/goal.service';
import { ReserveService } from '@app/services/reserve.service';
import { TimerService } from '@app/services/timer.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { of } from 'rxjs';
import { GameOverviewComponent } from './game-overview.component';

class MatDialogMock {
    open() {
        return {
            afterClosed: () => of({}),
        };
    }
}

describe('GameOverviewComponent', () => {
    let component: GameOverviewComponent;
    let fixture: ComponentFixture<GameOverviewComponent>;
    let goalServiceSpy: jasmine.SpyObj<GoalService>;

    beforeEach(async () => {
        goalServiceSpy = jasmine.createSpyObj('GoalService', ['getAUniqueGoal']);
        await TestBed.configureTestingModule({
            declarations: [GameOverviewComponent],
            imports: [MatDialogModule, MatButtonModule, AppRoutingModule, RouterModule, MatCardModule, MatCardModule, HttpClientModule],
            providers: [
                UserSettingsService,
                ReserveService,
                TimerService,
                { provide: GoalService, useValue: goalServiceSpy },
                {
                    provide: MatDialog,
                    useClass: MatDialogMock,
                },
            ],
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
        // assignValues is private
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
        // assignValues is private
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

        // scrollDown is private
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

        // scrollDown is private
        // eslint-disable-next-line dot-notation
        component['initializeGoals']();
        expect(component.publicGoals).toEqual(publicGoals);
        expect(component.privateGoals).toEqual(privateGoals);
    });

    it('should open a MatDialog box on "openQuitConfirmationDialog"', () => {
        // eslint-disable-next-line -- matDialog is private and we need access for the test
        const spy = spyOn(component['matDialog'], 'open');
        component.openQuitConfirmationDialog();
        expect(spy).toHaveBeenCalled();
    });
});
