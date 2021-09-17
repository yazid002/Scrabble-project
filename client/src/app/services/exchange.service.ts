import { Injectable } from '@angular/core';
import { ICaracter } from '@app/models/lettre.model';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';

const EXCHANGE_LIMIT = 7;
export enum ExchangeStatus {
    SyntaxError = 0,
    Impossible = 1,
    InvalidInput = 2,
    Success = 3,
}

@Injectable({
    providedIn: 'root',
})
export class ExchangeService extends ReserveService {
    // parametres: reserve(nombre d'éléments dispo, )
    // je dois pouvoir cliquer sur une lettre du chevalet,
    constructor(private reserveService: ReserveService, private rackService: RackService) {
        super();
    }

    checkExchangeIsPossible(): boolean {
        return this.reserveService.getNbreOfAvailableLetter() > EXCHANGE_LIMIT;
    }

    checkLettersRackOccurrence(letterToCheck: string): ICaracter[] {
        const occurences = this.rackService.findLetterOccurrence(letterToCheck);
        console.log(occurences);
        return occurences;
    }

    checkLetterToChangeOccurrence(letters: string[], letterToCheck: string): string[] {
        return letters.filter((letter) => letter.toUpperCase() === letterToCheck.toUpperCase());
    }

    findLetterToChangeOnRack(letterToCheck: string): boolean {
        return this.rackService.findLetterPosition(letterToCheck) !== -1;
    }

    findOccurrences(letterToCheck: string, letters: string[]): number {
        const count = letters.reduce((n, letter) => n + Number(letter === letterToCheck), 0);
        return count;
    }

    checkLetterOccurencesMatch(letter: string, letters: string[]): boolean {
        return this.findOccurrences(letter, letters) <= this.rackService.findOccurrences(letter, this.rackService.rackLetters as ICaracter[]);
    }

    // checkLettersTo(letter: string, letters: string[]): boolean {
    //     return this.findOccurrences(letter, letters) >= 1 && this.findOccurrences(letter, letters) <= EXCHANGE_LIMIT;
    // }

    exchangeLetters(lettersToChange: string[]): ExchangeStatus {
        const invalidArgumentsLength = lettersToChange.length < 1 || lettersToChange.length > EXCHANGE_LIMIT;
        console.log('length: ', invalidArgumentsLength);
        const invalidOccurrences = lettersToChange.find((letter: string) => this.checkLetterOccurencesMatch(letter, lettersToChange) === false);
        console.log('invalidOccurrences: ', invalidOccurrences);
        const inexistantLettersOnRack = lettersToChange.find((letter: string) => this.findLetterToChangeOnRack(letter) === false);
        console.log('inexistantLettersOnRack: ', inexistantLettersOnRack);
        if (invalidOccurrences || inexistantLettersOnRack || invalidArgumentsLength) {
            return ExchangeStatus.SyntaxError;
        }
        if (!this.checkExchangeIsPossible()) {
            return ExchangeStatus.Impossible;
        }

        for (const letter of lettersToChange) {
            this.rackService.replaceLetter(letter);
        }
        return ExchangeStatus.Success;
    }
}
