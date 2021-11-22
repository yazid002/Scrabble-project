import { Component, Input, OnInit } from '@angular/core';
import { Goal } from '@app/classes/goal';
import { Player } from '@app/classes/player';
import { GoalService } from '@app/services/goal.service';
import { GoalsManagerService } from '@app/services/goals-manager.service';
import { TimerService } from '@app/services/timer.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-goal-progress-bar',
    templateUrl: './goal-progress-bar.component.html',
    styleUrls: ['./goal-progress-bar.component.scss'],
})
export class GoalProgressBarComponent implements OnInit {
    @Input() goal: Goal;
    @Input() player: Player;

    value: number;

    timerDone: Subscription;
    updateGoalProgress: Subscription;
    constructor(private goalService: GoalService, private timerService: TimerService, private goalsManagerService: GoalsManagerService) {
        this.value = 0;
    }
    ngOnInit(): void {
        const maxProgressValue = 100;
        this.timerDone = this.timerService.timerDone.subscribe(() => {
            this.value = this.goal ? this.goalService.getProgress(this.goal, this.player) * maxProgressValue : 0;
        });
        this.updateGoalProgress = this.goalsManagerService.updateGoalProgress.subscribe(() => {
            this.value = this.goal ? this.goalService.getProgress(this.goal, this.player) * maxProgressValue : 0;
        });
    }
}
