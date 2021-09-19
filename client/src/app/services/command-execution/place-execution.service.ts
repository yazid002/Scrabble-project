import { Injectable } from '@angular/core';
import { IChat, IComputerResponse, SENDER } from '@app/classes/chat';

const NUM_PARAMETERS = 3; // parameters should have format ['placer',position, word]
const POSITION_INDEX = 1;
const WORD_INDEX = 2;
const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 15;

const VERTICAL = 'v';
const HORIZONTAL = 'h';

const DIRECTION_CHAR_POSITION = -1;
@Injectable({
    providedIn: 'root',
})
export class PlaceExecutionService {
    execute(parameters: string[]): IComputerResponse {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Went through the place execution service',
        };
        const response: IComputerResponse = {
            success: true,
            response: result,
        };
        if (!this.checkCommandLength(parameters, response).success) return response;

        const position: string = parameters[POSITION_INDEX];
        if (!this.checkPlacementPosition(position, response).success) return response;

        const word: string = parameters[WORD_INDEX];

        this.checkWordValidity(word, response);
        // À ce point, on devrait appeler la fonction
        return response;
    }

    private checkCommandLength(parameters: string[], iComputerResponse: IComputerResponse): IComputerResponse {
        if (parameters.length !== NUM_PARAMETERS) {
            iComputerResponse.success = false;
            iComputerResponse.response.body = `ERROR: command 'placer' had ${parameters.length} words, but 'placer' requires ${NUM_PARAMETERS} words`;
        }
        return iComputerResponse;
    }
    private checkPlacementPosition(position: string, iComputerResponse: IComputerResponse): IComputerResponse {
        // Decomposer la position (ex: 'g15v)' en paramètres compréhensible
        const valeurA: number = 'a'.charCodeAt(0); // Pour avoir le code ASCII de a

        const direction: string = position.slice(DIRECTION_CHAR_POSITION);
        const ligne: number = position.charCodeAt(0) - valeurA;
        const colone = Number(position.replace(/\D/g, '')); /* Removes all non numeric characters from string, then converts is to a number
        Taken from: 
        https://stackoverflow.com/questions/1862130/strip-all-non-numeric-characters-from-string-in-javascript
        */
        // Vérifier si les entrées sont valides
        console.log('colone: ', colone);
        if (ligne >= BOARD_HEIGHT || colone >= BOARD_WIDTH || ligne < 0 || colone < 0) {
            iComputerResponse.success = false;
            iComputerResponse.response.body = "Line index must be between 1 and 15. Column index must be between 'a' and .'o'";
        }
        if (direction !== VERTICAL && direction !== HORIZONTAL) {
            iComputerResponse.success = false;
            iComputerResponse.response.body = "word direction must be horizontal 'h' of vertical 'v'";
        }
        return iComputerResponse;
    }
    private checkWordValidity(word: string, iComputerResponse: IComputerResponse): IComputerResponse {
        if (word.length > BOARD_HEIGHT || word.length > BOARD_WIDTH) {
            iComputerResponse.success = false;
            iComputerResponse.response.body = `Word is ${word.length} letters long, but maximum allowed length is ${Math.max(
                BOARD_HEIGHT,
                BOARD_WIDTH,
            )} letters`;
        }

        return iComputerResponse;
    }
}
