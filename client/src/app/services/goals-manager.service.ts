import { Injectable } from '@angular/core';
import { Goal } from '@app/classes/goal';
import { Subscription } from 'rxjs';
import { GameService } from './game.service';
import { GoalService } from './goal.service';
import { TimerService } from './timer.service';

@Injectable({
    providedIn: 'root',
})
export class GoalsManagerService {
    isEnabled: boolean;
    resetTurnCounter: Subscription;
    constructor(private gameService: GameService, private goalService: GoalService, private timerService: TimerService) {
        this.isEnabled = false;
        this.resetTurnCounter = this.timerService.resetTurnCounter.subscribe((shouldResetTurnCounter: boolean) => {
            if (shouldResetTurnCounter) {
                this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter = 0;
                this.gameService.players[this.gameService.currentTurn].placeInTenSecondsGoalCounter = 0;
            }
        });
    }

    applyAllGoalsBonus(wordsFormed: string[]): void {
        if (!this.isEnabled) {
            return;
        }
        this.applyPrivateGoalsBonus(wordsFormed);
        this.applyPublicGoalsBonus(wordsFormed);
    }

    private applyPrivateGoalsBonus(wordsFormed: string[]): void {
        const goal = this.goalService.privateGoals[this.gameService.currentTurn];
        const check = this.checkFormedWordRespectGoals(wordsFormed, goal);
        if (check) {
            this.gameService.players[this.gameService.currentTurn].points += goal.bonus;
        }
    }

    private applyPublicGoalsBonus(wordsFormed: string[]): void {
        for (const goal of this.goalService.publicGoals) {
            const check = this.checkFormedWordRespectGoals(wordsFormed, goal);
            if (check) {
                this.gameService.players[this.gameService.currentTurn].points += goal.bonus;
            }
        }
    }

    private checkFormedWordRespectGoals(wordsFormed: string[], goal: Goal): boolean {
        if (goal.complete) {
            return false;
        }
        for (const word of wordsFormed) {
            const isGoalRespected = goal.usesWord
                ? this.goalService.goalsFunctions[goal.goalType](word)
                : this.goalService.goalsFunctions[goal.goalType](this.gameService.players[this.gameService.currentTurn]);
            if (isGoalRespected) {
                goal.complete = true;
                goal.completedBy = this.gameService.players[this.gameService.currentTurn];
                this.goalService.completeGoalSound();
                return true;
            }
        }
        return false;
    }
}
