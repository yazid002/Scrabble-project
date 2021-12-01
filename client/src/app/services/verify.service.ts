import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { IChat, SENDER } from '@app/classes/chat';
import { Dictionary } from '@app/classes/dictionary';
import { Vec2 } from '@app/classes/vec2';
import { BONUSES, SQUARE_NUMBER } from '@app/constants/board-constants';
import { SERVER_URL } from '@app/constants/url';
import { RackService } from '@app/services/rack.service';
import { Observable } from 'rxjs';
import { DictionaryService } from './admin/dictionary.service';
import { UserSettingsService } from './user-settings.service';

@Injectable({
    providedIn: 'root',
})
export class VerifyService {
    urlString: string;
    dictionary: Dictionary;
    invalidSymbols: string[];
    success: boolean;
    lettersUsedOnBoard: { letter: string; coord: Vec2 }[];
    formedWords: string[];
    constructor(
        private rackService: RackService,
        private http: HttpClient,
        private dictionaryService: DictionaryService,
        private userSettingsService: UserSettingsService,
    ) {
        this.urlString = SERVER_URL + '/api/validate';

        this.invalidSymbols = ['-', "'"];
        this.success = true;
        this.lettersUsedOnBoard = [];
        this.formedWords = [];
    }
    assignDictionary() {
        this.dictionaryService.fetchDictionary(this.userSettingsService.selectedDictionary.title).then((dict) => (this.dictionary = dict));
    }
    isFitting(coord: Vec2, direction: string, word: string): { error: boolean; message: IChat } {
        const result: IChat = { from: SENDER.computer, body: '' };
        const response = { error: false, message: result };
        const remainingCases = direction === 'h' || direction === 'horizontal' ? tiles.length - coord.x : tiles.length - coord.y;
        if (word.length > remainingCases) {
            this.success = false;
            response.error = true;
            response.message.body = "Commande impossible à réaliser : Il n'y a pas assez de place pour écrire ce mot.";
            return response;
        }
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];
        for (let i = 0; i < word.length; i++) {
            const computedCoord = this.computeCoordByDirection(direction, coord, i);
            const x = computedCoord.x;
            const y = computedCoord.y;
            const charInBox = tiles[y][x].letter;
            const letter = word.charAt(i) === word.charAt(i).toUpperCase() ? '*' : word.charAt(i);
            if (!this.isCaseEmpty(charInBox)) {
                if (!this.isLetterOnBoardTheSame(charInBox.toLowerCase(), word.charAt(i).toLowerCase())) {
                    this.success = false;
                    response.error = true;
                    response.message.body = "Commande impossible à réaliser : Il y a déjà une lettre dans l'une des cases ciblées.";
                    return response;
                }
                lettersUsedOnBoard.push({ letter, coord: { y, x } });
            } else if (!this.rackService.isLetterOnRack(letter)) {
                this.success = false;
                response.error = true;
                response.message.body =
                    'Commande impossible à réaliser : Il y a des lettres qui ne sont ni sur le plateau de jeu, ni sur le chevalet.';
                return response;
            }
        }
        this.lettersUsedOnBoard = lettersUsedOnBoard;
        return response;
    }

    getLettersUsedOnBoardFromPlacement(coord: Vec2, direction: string, word: string): { letter: string; coord: Vec2 }[] {
        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];
        for (let i = 0; i < word.length; i++) {
            const computedCoord = this.computeCoordByDirection(direction, coord, i);
            const x = computedCoord.x;
            const y = computedCoord.y;
            if (!this.areCoordValid({ x, y })) {
                return lettersUsedOnBoard;
            }
            const charInBox = tiles[y][x].letter;
            const letter = word.charAt(i) === word.charAt(i).toUpperCase() ? '*' : word.charAt(i);
            if (this.isCaseEmpty(charInBox)) {
                continue;
            }
            if (this.isLetterOnBoardTheSame(charInBox.toLowerCase(), word.charAt(i).toLowerCase())) {
                lettersUsedOnBoard.push({ letter, coord: { y, x } });
            }
        }
        return lettersUsedOnBoard;
    }
    normalizeWord(wordToProcess: string): string {
        const word = wordToProcess.normalize('NFD').replace(/\p{Diacritic}/gu, '');
        return word;
    }
    async checkAllWordsExist(word: string, coord: Vec2): Promise<{ wordExists: boolean; errorMessage: string }> {
        if (this.isFirstMove()) {
            if (word.length < 2) {
                return {
                    wordExists: false,
                    errorMessage: `il vous faut former des mots d'une longueur minimale de 2, mais le mot ${word} a une longueur de 1.`,
                };
            }
        }
        this.formedWords = this.getAllFormedWords(word, coord);
        const promise = new Promise<{ wordExists: boolean; errorMessage: string }>((resolve) => {
            this.validateWords(this.formedWords)
                .toPromise()
                .then((res) => {
                    resolve(res);
                });
        });
        return promise;
    }
    getAllFormedWords(word: string, coord: Vec2): string[] {
        let wordFound = '';
        let i = 0;
        const wordsFound: string[] = [];
        while (i < word.length && coord.y + i < SQUARE_NUMBER) {
            const newCords = { x: coord.x, y: coord.y + i };
            const isLetterNewlyPlaced =
                word[i].toLowerCase() === tiles[newCords.y][newCords.x].text.toLowerCase() &&
                tiles[newCords.y][newCords.x].letter.toLowerCase() === '';
            if (isLetterNewlyPlaced) {
                wordFound = this.findHorizontalAdjacentWord({ x: coord.x, y: coord.y + i });
                if (wordFound.length >= 2) {
                    wordsFound.push(wordFound);
                }
            }
            i++;
        }
        i = 0;
        while (i < word.length && coord.x + i < SQUARE_NUMBER) {
            const newCords = { x: coord.x + i, y: coord.y };
            const isLetterNewlyPlaced =
                word[i].toLowerCase() === tiles[newCords.y][newCords.x].text.toLowerCase() &&
                tiles[newCords.y][newCords.x].letter.toLowerCase() === '';
            if (isLetterNewlyPlaced) {
                wordFound = this.findVerticalAdjacentWord({ x: coord.x + i, y: coord.y });
                if (wordFound.length >= 2) {
                    wordsFound.push(wordFound);
                }
            }
            i++;
        }
        return wordsFound;
    }

    computeCoordByDirection(direction: string, coord: Vec2, step: number): Vec2 {
        const x = direction === 'h' || direction === 'horizontal' ? coord.x + step : coord.x;
        const y = direction === 'v' || direction === 'vertical' ? coord.y + step : coord.y;

        return { y, x };
    }

    areCoordValid(coord: Vec2): boolean {
        return coord.y < SQUARE_NUMBER && coord.x < SQUARE_NUMBER && coord.x >= 0 && coord.y >= 0;
    }

    validatePlaceFeasibility(word: string, coord: Vec2, direction: string): { error: boolean; message: IChat } {
        const result: IChat = { from: SENDER.computer, body: '' };
        const response = { error: false, message: result };
        if (!this.areCoordValid(coord)) {
            response.error = true;
            response.message.body = 'Commande impossible à réaliser : Les coordonnées ne sont pas valides';
            return response;
        }
        const isFitting = this.isFitting(coord, direction, word);
        if (isFitting.error) {
            return isFitting;
        }
        if (this.isFirstMove()) {
            const isFirstMoveValid = this.validateFirstMove(word, direction, coord);
            if (isFirstMoveValid.error) {
                return isFirstMoveValid;
            }
        } else {
            if (!this.hasAdjacent(word, coord, direction)) {
                this.success = false;
                response.error = true;
                response.message.body =
                    'Commande impossible à réaliser : Vous devez placer un mot ayant au moins une lettre adjacente aux lettres du plateau de jeu.';
                return response;
            }
        }

        const numberOfJokersIsValid = this.validateJokersOccurrencesMatch(word, this.lettersUsedOnBoard);
        if (numberOfJokersIsValid.error) {
            return numberOfJokersIsValid;
        }

        const containsInvalidSymbols = this.validateInvalidSymbols(word);
        if (containsInvalidSymbols) {
            return containsInvalidSymbols;
        }

        return response;
    }
    isFirstMove(): boolean {
        const h8Coord: Vec2 = { x: 7, y: 7 };
        return tiles[h8Coord.x][h8Coord.y].letter === '';
    }

    validateFirstMove(word: string, direction: string, coord: Vec2): { error: boolean; message: IChat } {
        const result: IChat = { from: SENDER.computer, body: '' };
        const response = { error: false, message: result };
        const h8Coord: Vec2 = { x: 7, y: 7 };
        const valid =
            direction === 'h'
                ? coord.y === h8Coord.y && coord.x <= h8Coord.x && coord.x + word.length > h8Coord.x
                : coord.x === h8Coord.x && coord.y <= h8Coord.y && coord.y + word.length > h8Coord.y;
        if (!valid) {
            this.success = false;
            response.error = true;
            response.message.body =
                'Commande impossible à réaliser : Ceci est votre premier tour, au moins une de vos lettres doit être placée sur la case H8.';
            return response;
        }
        return response;
    }

    hasAdjacent(word: string, coord: Vec2, direction: string): boolean {
        for (let i = 0; i < word.length; i++) {
            const computedCoord = this.computeCoordByDirection(direction, coord, i);
            const x = computedCoord.x;
            const y = computedCoord.y;
            if (
                !this.isCaseEmpty(tiles[coord.y][coord.x].letter) ||
                this.findAdjacentUp({ y, x }) ||
                this.findAdjacentLeft({ y, x }) ||
                this.findAdjacentRight({ y, x }) ||
                this.findAdjacentDown({ y, x })
            ) {
                return true;
            }
        }
        return false;
    }
    private findVerticalAdjacentWord(coord: Vec2): string {
        let up = coord.y;
        let down = coord.y;
        let wordFound = '';
        if (BONUSES.includes(tiles[coord.y][coord.x].text)) {
            return wordFound;
        }
        while (up > 0 && tiles[up - 1][coord.x].text !== '' && !BONUSES.includes(tiles[up - 1][coord.x].text)) {
            up--;
        }
        while (down < SQUARE_NUMBER - 1 && tiles[down + 1][coord.x].text !== '' && !BONUSES.includes(tiles[down + 1][coord.x].text)) {
            down++;
        }
        for (let i = up; i <= down; i++) {
            wordFound += tiles[i][coord.x].text;
        }
        if (BONUSES.includes(wordFound)) {
            wordFound = '';
        }
        return wordFound;
    }
    private findHorizontalAdjacentWord(coord: Vec2): string {
        let right = coord.x;
        let left = coord.x;
        let wordFound = '';
        if (BONUSES.includes(tiles[coord.y][coord.x].text)) {
            return wordFound;
        }
        while (left > 0 && tiles[coord.y][left - 1].text !== '' && !BONUSES.includes(tiles[coord.y][left - 1].text)) {
            left--;
        }
        while (right < SQUARE_NUMBER - 1 && tiles[coord.y][right + 1].text !== '' && !BONUSES.includes(tiles[coord.y][right + 1].text)) {
            right++;
        }

        for (let i = left; i <= right; i++) {
            wordFound += tiles[coord.y][i].text;
        }
        if (BONUSES.includes(wordFound)) {
            wordFound = '';
        }
        return wordFound;
    }
    private findAdjacentUp(coord: Vec2): boolean {
        if (coord.y > 0) {
            return tiles[coord.y - 1][coord.x].letter !== '';
        }
        return false;
    }
    private findAdjacentDown(coord: Vec2) {
        if (coord.y < SQUARE_NUMBER - 1) {
            return tiles[coord.y + 1][coord.x].letter !== '';
        }
        return false;
    }
    private findAdjacentRight(coord: Vec2) {
        if (coord.x < SQUARE_NUMBER - 1) {
            return tiles[coord.y][coord.x + 1].letter !== '';
        }
        return false;
    }
    private findAdjacentLeft(coord: Vec2) {
        if (coord.x > 0) {
            return tiles[coord.y][coord.x - 1].letter !== '';
        }
        return false;
    }
    private isCaseEmpty(letterOnBoard: string): boolean {
        return letterOnBoard === '';
    }
    private isLetterOnBoardTheSame(letterOnBoard: string, letterToPlace: string): boolean {
        return letterOnBoard === letterToPlace;
    }
    private validateJokersOccurrencesMatch(word: string, lettersUsedOnBoard: { letter: string; coord: Vec2 }[]): { error: boolean; message: IChat } {
        const result: IChat = { from: SENDER.computer, body: '' };
        const response = { error: false, message: result };
        const wordToChange = word.split('') as string[];
        const upperLettersInWord: string[] = wordToChange.filter((letter) => letter === letter.toUpperCase());
        const numberOfJokersOnBoard = lettersUsedOnBoard.filter((letter) => letter.letter === letter.letter.toUpperCase());
        const jokersNumb = this.rackService.findJokersNumberOnRack() + numberOfJokersOnBoard.length;
        if (upperLettersInWord.length > jokersNumb) {
            this.success = false;
            response.error = true;
            response.message.body =
                "Erreur de syntaxe : Il n'y a pas assez d'occurrences sur le chevalet pour les lettres: " +
                ` * (lettres blanches) représentant les lettres "${upperLettersInWord.join('", "')}" demandées.`;
        }
        return response;
    }
    private validateInvalidSymbols(word: string): { error: boolean; message: IChat } {
        const result: IChat = { from: SENDER.computer, body: '' };
        const response = { error: false, message: result };
        const invalid = this.invalidSymbols.some((symbol) => word.includes(symbol));
        if (invalid) {
            this.success = false;
            response.error = true;
            response.message.body = "Erreur de syntaxe : Les symboles (-) et (') sont invalides.";
        }
        return response;
    }
    private validateWords(words: string[]): Observable<{ wordExists: boolean; errorMessage: string }> {
        const params: { words: string[]; dict: string } = { words, dict: this.dictionaryService.currentDictionary.title };
        console.log('about to send to server', params);
        return this.http.post<{ wordExists: boolean; errorMessage: string }>(this.urlString, params);
    }
}
