import { Injectable, Output } from '@angular/core';
import { Goal } from '@app/classes/goal';
import { Player } from '@app/classes/player';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GameService } from './game.service';
import { GoalService } from './goal.service';
import { TimerService } from './timer.service';
import { UserSettingsService } from './user-settings.service';

@Injectable({
    providedIn: 'root',
})
export class GoalsManagerService {
    @Output() updateGoalProgress: BehaviorSubject<boolean>;
    isEnabled: boolean;
    resetTurnCounter: Subscription;

    constructor(
        private gameService: GameService,
        private goalService: GoalService,
        private timerService: TimerService,
        private userSettingsService: UserSettingsService,
    ) {
        this.isEnabled = this.userSettingsService.settings.mode.currentChoiceKey === 'log2990';
        this.updateGoalProgress = new BehaviorSubject<boolean>(false);
        this.resetTurnCounter = this.timerService.resetTurnCounter.subscribe((shouldResetTurnCounter: boolean | Player) => {
            if (shouldResetTurnCounter) {
                if (typeof shouldResetTurnCounter === 'boolean') {
                    this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter = 0;
                    this.gameService.players[this.gameService.currentTurn].placeInTenSecondsGoalCounter = 0;
                } else {
                    (shouldResetTurnCounter as Player).turnWithoutSkipAndExchangeCounter = 0;
                    (shouldResetTurnCounter as Player).placeInTenSecondsGoalCounter = 0;
                }
            }
        });
    }

    getUpdatedProgress(goal: Goal, player: Player): number {
        const maxProgressValue = 100;
        const minProgressValue = 0;
        if (!goal) {
            return minProgressValue;
        }
        if (!goal.complete) {
            return this.goalService.getProgress(goal, player) * maxProgressValue;
        } else if (goal.completedBy?.id !== player.id) {
            return minProgressValue;
        }
        return maxProgressValue;
    }

    setWordsFormedNumber(player: Player, words: string[]): void {
        player.words.push(...words);
        if (!(player.wordsMapping instanceof Map)) {
            player.wordsMapping = this.goalService.processWordsArrayInMap(player.words);
        }
        for (const word of words) {
            if (player.wordsMapping.has(word.toLowerCase())) {
                const numberOfWord = player.wordsMapping.get(word.toLowerCase()) as number;
                player.wordsMapping.set(word.toLowerCase(), numberOfWord + 1);
            } else {
                player.wordsMapping.set(word.toLowerCase(), 1);
            }
        }
    }
    applyAllGoalsBonus(wordsFormed: string[], player: Player): void {
        this.goalService.incrementPlayerCounters(player);
        if (!this.isEnabled) {
            return;
        }
        this.applyPrivateGoalsBonus(wordsFormed, player);
        this.applyPublicGoalsBonus(wordsFormed, player);
    }

    private applyPrivateGoalsBonus(wordsFormed: string[], player: Player): void {
        const index = player.id;
        const goal = this.goalService.privateGoals[index];
        const check = this.checkFormedWordRespectGoals(wordsFormed, goal, player);
        if (check) {
            this.gameService.players[index].points += goal.bonus;
        }
    }

    private applyPublicGoalsBonus(wordsFormed: string[], player: Player): void {
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
