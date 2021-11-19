import { Injectable } from '@angular/core';
import { Goal } from '@app/classes/goal';
import { GameService } from './game.service';
import { GoalService } from './goal.service';

@Injectable({
    providedIn: 'root',
})
export class GoalsManagerService {
    constructor(private gameService: GameService, private goalService: GoalService) {}

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
