import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { ICharacter } from '@app/classes/letter';
import { EXCHANGE_MAX_LIMIT, EXCHANGE_MIN_LIMIT } from '@app/constants/exchange-constants';
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

    exchangeLetters(lettersToChange: string[], isCalledThroughChat: boolean): { error: boolean; message: IChat } {
        const isExchangeValid = this.validateExchangeFeasibility(lettersToChange);
        if (isExchangeValid.error) {
            return isExchangeValid;
        }

        if (isCalledThroughChat) {
            this.exchangeLettersViaCommand(lettersToChange);
        } else {
            this.exchangeLettersViaClick(lettersToChange);
        }

        const result: IChat = {
            from: SENDER.computer,
            body: 'Échange de lettres réussi !',
        };
        this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter = 0;
        this.timerService.resetTimer();
        return { error: false, message: result };
    }

    exchangeLettersViaCommand(lettersToChange: string[]): void {
        for (const letter of lettersToChange) {
            this.rackService.replaceLetter(letter, false);
        }
    }

    exchangeLettersViaClick(lettersToChange: string[]): void {
        for (let i = 0; i < lettersToChange.length; i++) {
            this.rackService.replaceLetter(lettersToChange[i], false, this.exchangeSelectionService.selectedIndexes[i]);
        }
        this.exchangeSelectionService.selectedIndexes = [];
    }

    private validateExchangeFeasibility(lettersToChange: string[]): { error: boolean; message: IChat } {
        const validArgumentsLength = this.validateArgumentLength(lettersToChange, EXCHANGE_MIN_LIMIT, EXCHANGE_MAX_LIMIT);
        const inexistentLettersOnRack: string[] = this.rackService.findInexistentLettersOnRack(lettersToChange);
        const incoherentOccurrences: string[] = this.findIncoherentOccurrencesMatch(lettersToChange);
        const result: IChat = {
            from: SENDER.computer,
            body: '',
        };
        const response = { error: false, message: result };

        if (!this.rackService.checkLettersAvailability(EXCHANGE_MAX_LIMIT)) {
            response.error = true;
            response.message.body = "Commande impossible à réaliser : Il n'y a plus assez de lettres dans la réserve.";
            return response;
        }
        if (!validArgumentsLength) {
            response.error = true;
            response.message.body = 'Erreur de syntaxe : Vous avez spécifié soit 0 lettre, soit plus de 7 lettres à échanger. ';
            return response;
        }
        if (inexistentLettersOnRack.length) {
            response.error = true;
            response.message.body =
                "Erreur de syntaxe : Vous n'avez aucune occurrence disponible sur le chevalet pour les lettres: " +
                `${inexistentLettersOnRack.join(', ')}.`;
            return response;
        }
        if (incoherentOccurrences.length) {
            response.error = true;
            response.message.body =
                "Erreur de syntaxe : Il n'y a pas assez d'occurrences sur le chevalet pour les lettres: " +
                `${incoherentOccurrences.join(', ')} à échanger.`;
            return response;
        }
        return response;
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
