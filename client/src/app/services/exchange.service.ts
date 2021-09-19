import { Injectable } from '@angular/core';
import { InexistentLettersOnRack } from '@app/classes/command-errors/exchange-errors/inexistent-letters-on-rack';
import { InvalidArgumentsLength } from '@app/classes/command-errors/exchange-errors/invalid-argument-length';
import { NotEnoughOccurrences } from '@app/classes/command-errors/exchange-errors/not-enough-occurrences';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command';
import { ICaracter } from '@app/models/lettre.model';
import { RackService } from '@app/services/rack.service';

export enum ExchangeLimits {
    Min = 1,
    Max = 7,
}
@Injectable({
    providedIn: 'root',
})
export class ExchangeService {
    constructor(private rackService: RackService) {}

    exchangeLetters(lettersToChange: string[]): void {
        this.validateExchangeFeasibility(lettersToChange);

        for (const letter of lettersToChange) {
            this.rackService.replaceLetter(letter);
        }
    }

    private validateExchangeFeasibility(lettersToChange: string[]): void {
        const validArgumentsLength = this.validateArgumentLength(lettersToChange, ExchangeLimits.Min, ExchangeLimits.Max);
        const inexistentLettersOnRack: string[] = this.findInexistentLettersOnRack(lettersToChange);
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
            throw new NotEnoughOccurrences(`${incoherentOccurrences.join(', ')}.`);
        }
    }

    private findLetterToChangeOnRack(letterToCheck: string): boolean {
        const notFound = -1;
        return this.rackService.findLetterPosition(letterToCheck) !== notFound;
    }

    private validateLetterOccurrencesMatch(letter: string, letters: string[]): boolean {
        const rackLetters = this.rackService.rackLetters as ICaracter[];
        const rackLettersToStrings: string[] = rackLetters.map((rackLetter) => rackLetter.name);
        return this.rackService.countLetterOccurrences(letter, letters) <= this.rackService.countLetterOccurrences(letter, rackLettersToStrings);
    }

    private validateArgumentLength(lettersToChange: string[], min: number, max: number): boolean {
        return lettersToChange.length >= min && lettersToChange.length <= max;
    }

    private findIncoherentOccurrencesMatch(lettersToChange: string[]): string[] {
        return [...new Set(lettersToChange.filter((letter: string) => this.validateLetterOccurrencesMatch(letter, lettersToChange) === false))];
    }

    private findInexistentLettersOnRack(lettersToChange: string[]): string[] {
        return [...new Set(lettersToChange.filter((letter: string) => this.findLetterToChangeOnRack(letter) === false))];
    }

    // private countLetterOccurrences(letterToCheck: string, letters: string[]): number {
    //     const count = letters.reduce((n, letter) => n + Number(letter === letterToCheck), 0);
    //     return count;
    // }

    // private checkLettersRackOccurrence(letterToCheck: string): ICaracter[] {
    //     const occurences = this.rackService.findLetterOccurrence(letterToCheck);
    //     console.log(occurences);
    //     return occurences;
    // }

    // private checkLetterToChangeOccurrence(letters: string[], letterToCheck: string): string[] {
    //     return letters.filter((letter) => letter.toUpperCase() === letterToCheck.toUpperCase());
    // }

    // checkLettersTo(letter: string, letters: string[]): boolean {
    //     return this.findOccurrences(letter, letters) >= 1 && this.findOccurrences(letter, letters) <= EXCHANGE_LIMIT;
    // }

    // if (invalidOccurrences || inexistantLettersOnRack || invalidArgumentsLength) {
    //     // throw new SyntaxError('blabla');
    //     //  throw new 'blabla'();
    //     // return ExchangeStatus.SyntaxError;
    // }
    //  console.log('invalidOccurrences: ', incoherentOccurrences);
    //  console.log('inexistentLettersOnRack: ', inexistentLettersOnRack);
    //  console.log('length: ', invalidArgumentsLength);
    // switch (key) {
    //     case value:
    //         break;

    //     default:
    //         break;
    // }
    // return ExchangeStatus.Success;
}
