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
    resetTurnCounter: Subscription;
    constructor(private gameService: GameService, private goalService: GoalService, private timerService: TimerService) {
        this.resetTurnCounter = this.timerService.resetTurnCounter.subscribe((shouldResetTurnCounter: boolean) => {
            console.log(this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter);
            if (shouldResetTurnCounter) {
                this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter = 0;
            }
        });
    }

    applyPrivateGoalsBonus(wordsFormed: string[]): void {
        //   const goal = this.gameService.players[this.gameService.currentTurn].privateGoal;
        const goal = this.goalService.privateGoals[this.gameService.currentTurn];
        console.log('apply bonus, ', goal.description, goal.bonus);
        const check = this.checkFormedWordRespectGoals(wordsFormed, goal);
        console.log('check ', check);
        if (check) {
            this.gameService.players[this.gameService.currentTurn].points += goal.bonus;
        }
    }

    applyPublicGoalsBonus(wordsFormed: string[]): void {
        for (const goal of this.goalService.publicGoals) {
            console.log('apply bonus, ', goal.description, goal.bonus);
            const check = this.checkFormedWordRespectGoals(wordsFormed, goal);
            console.log('check ', check);
            if (check) {
                this.gameService.players[this.gameService.currentTurn].points += goal.bonus;
            }
        }
    }

    checkFormedWordRespectGoals(wordsFormed: string[], goal: Goal): boolean {
        console.log('goal complete ', goal.complete);
        if (goal.complete) {
            return false;
        }
        for (const word of wordsFormed) {
            console.log('goal complete 3', word, goal, this.gameService.players[this.gameService.currentTurn]);

            const isGoalRespected = goal.usesWord
                ? this.goalService.goalsFunctions[goal.goalType](word)
                : this.goalService.goalsFunctions[goal.goalType](this.gameService.players[this.gameService.currentTurn]);
            console.log('word ', word, isGoalRespected, goal.description);
            if (isGoalRespected) {
                goal.complete = true;
                goal.completedBy = this.gameService.players[this.gameService.currentTurn];
                this.goalService.completeGoalSound();
                return true;
            }
        }
        return false;
    }

    applyAllGoalsBonus(wordsFormed: string[]): void {
        this.applyPrivateGoalsBonus(wordsFormed);
        this.applyPublicGoalsBonus(wordsFormed);
    }
}
