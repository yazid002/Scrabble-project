import { Component, Input, OnInit } from '@angular/core';
import { Goal } from '@app/classes/goal';
import { Player } from '@app/classes/player';
import { GoalsManagerService } from '@app/services/goals-manager.service';
import { TimerService } from '@app/services/timer.service';

@Component({
    selector: 'app-goal-progress-bar',
    templateUrl: './goal-progress-bar.component.html',
    styleUrls: ['./goal-progress-bar.component.scss'],
})
export class GoalProgressBarComponent implements OnInit {
    @Input() goal: Goal;
    @Input() player: Player;

    value: number;
    private alreadyUpdated: boolean;

    constructor(private timerService: TimerService, private goalsManagerService: GoalsManagerService) {
        this.value = 0;
        this.alreadyUpdated = false;
    }

    ngOnInit(): void {
        this.timerService.timerDone.subscribe(() => {
            this.value = this.goalsManagerService.getUpdatedProgress(this.goal, this.player);
            this.alreadyUpdated = true;
        });
        this.goalsManagerService.updateGoalProgress.subscribe(() => {
            if (!this.alreadyUpdated) {
                this.value = this.goalsManagerService.getUpdatedProgress(this.goal, this.player);
                this.alreadyUpdated = false;
            }
        });
    }
}
