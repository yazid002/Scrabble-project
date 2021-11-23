import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GoalsManagerService } from '@app/services/goals-manager.service';
import { TimerService } from '@app/services/timer.service';
import { BehaviorSubject } from 'rxjs';
import { GoalProgressBarComponent } from './goal-progress-bar.component';

describe('GoalProgressBarComponent', () => {
    let component: GoalProgressBarComponent;
    let fixture: ComponentFixture<GoalProgressBarComponent>;
    let timerServiceSpy: jasmine.SpyObj<TimerService>;
    let goalsManagerServiceSpy: jasmine.SpyObj<GoalsManagerService>;

    beforeEach(async () => {
        timerServiceSpy = jasmine.createSpyObj('TimerService', ['resetTimerDelay']);
        timerServiceSpy.timerDone = new BehaviorSubject<boolean>(false);
        goalsManagerServiceSpy = jasmine.createSpyObj('GoalsManagerService', ['getUpdatedProgress']);
        goalsManagerServiceSpy.updateGoalProgress = new BehaviorSubject<boolean>(false);
        await TestBed.configureTestingModule({
            imports: [MatProgressBarModule],
            declarations: [GoalProgressBarComponent],
            providers: [
                { provide: TimerService, useValue: timerServiceSpy },
                { provide: GoalsManagerService, useValue: goalsManagerServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GoalProgressBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call update the value if the timer is done', () => {
        // alreadyUpdated is private
        // eslint-disable-next-line dot-notation
        component['alreadyUpdated'] = false;
        goalsManagerServiceSpy.getUpdatedProgress.and.returnValue(1);
        timerServiceSpy.timerDone.next(true);
        expect(goalsManagerServiceSpy.getUpdatedProgress).toHaveBeenCalledTimes(2);
        // alreadyUpdated is private
        // eslint-disable-next-line dot-notation
        expect(component['alreadyUpdated']).toEqual(true);
    });

    it('should update two times the value if updateGoalProgress is triggered and it is not already updated', () => {
        // alreadyUpdated is private
        // eslint-disable-next-line dot-notation
        component['alreadyUpdated'] = false;
        goalsManagerServiceSpy.getUpdatedProgress.and.returnValue(1);
        goalsManagerServiceSpy.updateGoalProgress.next(true);
        expect(goalsManagerServiceSpy.getUpdatedProgress).toHaveBeenCalledTimes(2);
    });

    it('should update only one time the value if updateGoalProgress is triggered but it is already updated', () => {
        // alreadyUpdated is private
        // eslint-disable-next-line dot-notation
        component['alreadyUpdated'] = true;
        goalsManagerServiceSpy.getUpdatedProgress.and.returnValue(1);
        goalsManagerServiceSpy.updateGoalProgress.next(true);
        expect(goalsManagerServiceSpy.getUpdatedProgress).toHaveBeenCalledTimes(1);
    });
});
