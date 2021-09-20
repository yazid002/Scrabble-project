import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { CommandSyntaxError } from '@app/classes/command-errors/command-syntax-error';
import { GridService } from '../grid.service';

const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 15;

@Injectable({
    providedIn: 'root',
})
export class PlaceExecutionService {
    constructor(public grid: GridService) {}

    execute(parameters: string[]): IChat {
        const POSITION_INDEX = 1;
        const WORD_INDEX = 2;

        const result: IChat = {
            from: SENDER.computer,
            body: 'Went through the place execution service',
        };

        const position: string = parameters[POSITION_INDEX];
        this.checkPlacementPosition(position, result);

        const word: string = parameters[WORD_INDEX];

        this.checkWordValidity(word, result);
        // À ce point, on devrait appeler la fonction
        //const VERTICAL = 'v';
        //const HORIZONTAL = 'h';
        const DIRECTION_CHAR_POSITION = -1;
        const VALEUR_A: number = 'a'.charCodeAt(0); // Pour avoir le code ASCII de a

        const direction: string = position.slice(DIRECTION_CHAR_POSITION);
        const ligne: number = position.charCodeAt(0) - VALEUR_A;
        const colone = Number(position.replace(/\D/g, ''));
        this.grid.placeWord(word, direction, ligne, colone);

        return result;
    }

    private checkPlacementPosition(position: string, result: IChat): IChat {
        // Decomposer la position (ex: 'g15v)' en paramètres compréhensible
        const VERTICAL = 'v';
        const HORIZONTAL = 'h';
        const DIRECTION_CHAR_POSITION = -1;
        const VALEUR_A: number = 'a'.charCodeAt(0); // Pour avoir le code ASCII de a

        const direction: string = position.slice(DIRECTION_CHAR_POSITION);
        const ligne: number = position.charCodeAt(0) - VALEUR_A;
        const colone = Number(position.replace(/\D/g, '')); /* Removes all non numeric characters from string, then converts is to a number
        Taken from: 
        https://stackoverflow.com/questions/1862130/strip-all-non-numeric-characters-from-string-in-javascript
        */
        // Vérifier si les entrées sont valides
        if (ligne >= BOARD_HEIGHT || colone >= BOARD_WIDTH || ligne < 0 || colone < 0) {
            throw new CommandSyntaxError("Line index must be between 1 and 15. Column index must be between 'a' and .'o'");
        }
        if (direction !== VERTICAL && direction !== HORIZONTAL) {
            throw new CommandSyntaxError("word direction must be horizontal 'h' of vertical 'v'");
        }
        return result;
    }
    private checkWordValidity(word: string, result: IChat): IChat {
        if (word.length > BOARD_HEIGHT || word.length > BOARD_WIDTH) {
            throw new CommandSyntaxError(
                `Word is ${word.length} letters long, but maximum allowed length is ${Math.max(BOARD_HEIGHT, BOARD_WIDTH)} letters`,
            );
        }

        return result;
    }
}
