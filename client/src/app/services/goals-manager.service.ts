import { Injectable, Output } from '@angular/core';
import { Goal } from '@app/classes/goal';
import { Player } from '@app/classes/player';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GameService } from './game.service';
import { GoalService } from './goal.service';
import { TimerService } from './timer.service';

@Injectable({
    providedIn: 'root',
})
export class GoalsManagerService {
    @Output() updateGoalProgress: BehaviorSubject<boolean>;
    isEnabled: boolean;
    resetTurnCounter: Subscription;

    constructor(private gameService: GameService, private goalService: GoalService, private timerService: TimerService) {
        this.isEnabled = false;
        this.updateGoalProgress = new BehaviorSubject<boolean>(false);
        this.resetTurnCounter = this.timerService.resetTurnCounter.subscribe((shouldResetTurnCounter: boolean | Player) => {
            console.log('shou ', shouldResetTurnCounter);
            if (shouldResetTurnCounter) {
                if (typeof shouldResetTurnCounter === 'boolean') {
                    console.log('should reset ', this.gameService.players[this.gameService.currentTurn]);
                    this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter = 0;
                    this.gameService.players[this.gameService.currentTurn].placeInTenSecondsGoalCounter = 0;
                } else {
                    console.log('should reset as player ', this.gameService.players[this.gameService.currentTurn], shouldResetTurnCounter);
                    (shouldResetTurnCounter as Player).turnWithoutSkipAndExchangeCounter = 0;
                    (shouldResetTurnCounter as Player).placeInTenSecondsGoalCounter = 0;
                }
            }
        });
    }
    setWordsFormedNumber(player: Player, words: string[]): void {
        // const wordsFormedMapping = new Map<string, number>();

        if (!player.wordsMapping) {
            player.wordsMapping = new Map<string, number>();
        }
        for (const w of words) {
            if (player.wordsMapping?.has(w.toLowerCase())) {
                const numberOfW = player.wordsMapping?.get(w.toLowerCase()) as number;
                player.wordsMapping?.set(w.toLowerCase(), numberOfW + 1);
                // if (numberOfW + 1 === 3) {
                //     return true;
                // }
            } else {
                player.wordsMapping?.set(w.toLowerCase(), 1);
            }
        }
        console.log(player.wordsMapping);
        // return false;
    }

    applyAllGoalsBonus(wordsFormed: string[], player: Player): void {
        if (player) {
            console.log('all', player);
        }
        this.goalService.incrementPlayerCounters(player);
        if (!this.isEnabled) {
            return;
        }
        this.applyPrivateGoalsBonus(wordsFormed, player);
        this.applyPublicGoalsBonus(wordsFormed, player);
    }

    private applyPrivateGoalsBonus(wordsFormed: string[], player: Player): void {
        if (player) {
            console.log('priv', player);
        }
        const index = player.id;
        const goal = this.goalService.privateGoals[index];
        const check = this.checkFormedWordRespectGoals(wordsFormed, goal, player);
        console.log(goal.description, check);
        if (check) {
            this.gameService.players[index].points += goal.bonus;
        }
    }

    private applyPublicGoalsBonus(wordsFormed: string[], player: Player): void {
        if (player) {
            console.log('pub', player);
        }
        const index = player.id;
        for (const goal of this.goalService.publicGoals) {
            const check = this.checkFormedWordRespectGoals(wordsFormed, goal, player);
            if (check) {
                this.gameService.players[index].points += goal.bonus;
            }
        }
    }

    private checkFormedWordRespectGoals(wordsFormed: string[], goal: Goal, player: Player): boolean {
        if (goal.complete) {
            return false;
        }
        const index = player.id;
        for (const word of wordsFormed) {
            const isGoalRespected = goal.usesWord
                ? this.goalService.goalsFunctions[goal.goalType](word)
                : this.goalService.goalsFunctions[goal.goalType](this.gameService.players[index]);
            if (isGoalRespected) {
                goal.complete = true;
                goal.completedBy = this.gameService.players[index];
                this.goalService.completeGoalSound();
                return true;
            }
        }
        return false;
    }
}
