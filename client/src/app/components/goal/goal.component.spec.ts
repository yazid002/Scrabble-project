import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Goal } from '@app/classes/goal';
import { PLAYER } from '@app/classes/player';
import { GoalProgressBarComponent } from '@app/components/goal-progress-bar/goal-progress-bar.component';
import { GoalType } from '@app/enums/goals-enum';
import { GoalComponent } from './goal.component';

describe('GoalComponent', () => {
    let component: GoalComponent;
    let fixture: ComponentFixture<GoalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatProgressBarModule, HttpClientTestingModule, NoopAnimationsModule],
            declarations: [GoalComponent, GoalProgressBarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GoalComponent);
        component = fixture.componentInstance;
        const goal: Goal = {
            description: 'first goal',
            goalType: GoalType.PlayInTenSeconds,
            bonus: 10,
            usesWord: false,
            complete: false,
        };

        const player = {
            id: PLAYER.realPlayer,
            name: 'Random name',
            rack: [
                { name: 'A', quantity: 9, points: 1, display: 'A' },
                { name: 'B', quantity: 2, points: 3, display: 'B' },
                { name: 'C', quantity: 2, points: 3, display: 'C' },
                { name: 'D', quantity: 3, points: 2, display: 'D' },
                { name: 'E', quantity: 15, points: 1, display: 'E' },
            ],
            points: 0,
            turnWithoutSkipAndExchangeCounter: 0,
            placeInTenSecondsGoalCounter: 0,
            wordsMapping: new Map<string, number>(),
            words: [],
        };

        component.goal = goal;
        component.player = player;
        component.isPublic = false;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
