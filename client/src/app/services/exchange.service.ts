import { Injectable } from '@angular/core';
import { InexistentLettersOnRack } from '@app/classes/command-errors/exchange-errors/inexistent-letters-on-rack';
import { InvalidArgumentsLength } from '@app/classes/command-errors/exchange-errors/invalid-argument-length';
import { NotEnoughOccurrences } from '@app/classes/command-errors/exchange-errors/not-enough-occurrences';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command';
import { ICaracter } from '@app/models/lettre.model';
import { RackService } from '@app/services/rack.service';

const EXCHANGE_LIMIT = 7;
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
        const invalidArgumentsLength = lettersToChange.length < ExchangeLimits.Min || lettersToChange.length > ExchangeLimits.Max;
        const incoherentOccurrences: string[] = [
            ...new Set(lettersToChange.filter((letter: string) => this.checkLetterOccurrencesMatch(letter, lettersToChange) === false)),
        ];
        const inexistentLettersOnRack = lettersToChange.filter((letter: string) => this.findLetterToChangeOnRack(letter) === false);

        if (!this.rackService.checkLettersAvailability(EXCHANGE_LIMIT)) {
            throw new ImpossibleCommand("Il n'y a plus assez de lettres dans la réserve.");
        }
        if (invalidArgumentsLength) {
            throw new InvalidArgumentsLength('');
        }
        if (inexistentLettersOnRack.length) {
            throw new InexistentLettersOnRack(`${inexistentLettersOnRack.join(', ')}.`);
        }
        if (incoherentOccurrences.length) {
            throw new NotEnoughOccurrences(`${incoherentOccurrences.join(', ')}.`);
        }

        for (const letter of lettersToChange) {
            this.rackService.replaceLetter(letter);
        }
    }

    private findLetterToChangeOnRack(letterToCheck: string): boolean {
        const notFound = -1;
        return this.rackService.findLetterPosition(letterToCheck) !== notFound;
    }

    private checkLetterOccurrencesMatch(letter: string, letters: string[]): boolean {
        const rackLetters = this.rackService.rackLetters as ICaracter[];
        const rackLettersToStrings = rackLetters.map((rackLetter) => rackLetter.name);
        return this.rackService.countLetterOccurrences(letter, letters) <= this.rackService.countLetterOccurrences(letter, rackLettersToStrings);
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
