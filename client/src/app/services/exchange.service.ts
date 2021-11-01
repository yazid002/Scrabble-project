import { Injectable } from '@angular/core';
import { InexistentLettersOnRack } from '@app/classes/command-errors/command-syntax-errors/inexistent-letters-on-rack';
import { InvalidArgumentsLength } from '@app/classes/command-errors/command-syntax-errors/invalid-argument-length';
import { NotEnoughOccurrences } from '@app/classes/command-errors/command-syntax-errors/not-enough-occurrences';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { ICharacter } from '@app/classes/letter';
import { ExchangeLimits } from '@app/enums/exchange-enums';
import { RackService } from '@app/services/rack.service';
import { ExchangeSelectionService } from './exchange-selection.service';
import { GameService } from './game.service';
import { TimerService } from './timer.service';

@Injectable({
    providedIn: 'root',
})
export class ExchangeService {
    constructor(
        private rackService: RackService,
        private gameService: GameService,
        private timerService: TimerService,
        private exchangeSelectionService: ExchangeSelectionService,
    ) {}

    exchangeLetters(lettersToChange: string[], viaCommand: boolean): void {
        this.validateExchangeFeasibility(lettersToChange);

        if (viaCommand) {
            this.exchangeLettersViaCommand(lettersToChange);
        } else {
            this.exchangeLettersViaClick(lettersToChange);
        }
        this.timerService.resetTimer();
    }

    exchangeLettersViaCommand(lettersToChange: string[]): void {
        for (const letter of lettersToChange) {
            this.rackService.replaceLetter(letter, false);
        }
        //   this.timerService.resetTimer();
    }

    exchangeLettersViaClick(lettersToChange: string[]): void {
        for (let i = 0; i < lettersToChange.length; i++) {
            this.rackService.replaceLetter(lettersToChange[i], false, this.exchangeSelectionService.selectedIndexes[i]);
        }
        this.exchangeSelectionService.selectedIndexes = [];
    }

    private validateExchangeFeasibility(lettersToChange: string[]): void {
        const validArgumentsLength = this.validateArgumentLength(lettersToChange, ExchangeLimits.Min, ExchangeLimits.Max);
        const inexistentLettersOnRack: string[] = this.rackService.findInexistentLettersOnRack(lettersToChange);
        const incoherentOccurrences: string[] = this.findIncoherentOccurrencesMatch(lettersToChange);

        if (!this.rackService.checkLettersAvailability(ExchangeLimits.Max)) {
            throw new ImpossibleCommand("Il n'y a plus assez de lettres dans la réserve.");
        }
        if (!validArgumentsLength) {
            throw new InvalidArgumentsLength('');
        }
        if (inexistentLettersOnRack.length) {
            throw new InexistentLettersOnRack(`${inexistentLettersOnRack.join(', ')}.`);
        }
        if (incoherentOccurrences.length) {
            throw new NotEnoughOccurrences(`${incoherentOccurrences.join(', ')} à échanger.`);
        }
    }

    private validateLetterOccurrencesMatch(letter: string, letters: string[]): boolean {
        const rackLetters = this.gameService.players[this.gameService.currentTurn].rack as ICharacter[];
        const rackLettersToStrings: string[] = rackLetters.map((rackLetter) => rackLetter.name);
        return this.rackService.countLetterOccurrences(letter, letters) <= this.rackService.countLetterOccurrences(letter, rackLettersToStrings);
    }

    private validateArgumentLength(lettersToChange: string[], min: number, max: number): boolean {
        return lettersToChange.length >= min && lettersToChange.length <= max;
    }

    private findIncoherentOccurrencesMatch(lettersToChange: string[]): string[] {
        return [...new Set(lettersToChange.filter((letter: string) => this.validateLetterOccurrencesMatch(letter, lettersToChange) === false))];
    }
}
