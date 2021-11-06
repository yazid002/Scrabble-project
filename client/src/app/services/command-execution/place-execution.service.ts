import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
import { PlaceService } from '@app/services/place.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceExecutionService {
    constructor(public grid: GridService, private placeService: PlaceService) {}

    async execute(parameters: string[], isCalledThoughtChat: boolean): Promise<IChat> {
        const POSITION_INDEX = 1;
        const WORD_INDEX = 2;

        const result: IChat = {
            from: SENDER.computer,
            body: 'Le mot a été placé avec succès !',
        };

        const position: string = parameters[POSITION_INDEX];
        const word: string = parameters[WORD_INDEX];

        const extractedParameters = this.extractParameters(position);
        const errorBody = (await this.placeService
            .placeWord(word, extractedParameters.coord, extractedParameters.direction, isCalledThoughtChat)
            .catch((error: { error: boolean; message: IChat }) => {
                return error;
            })) as { error: boolean; message: IChat };

        if (errorBody.error) {
            result.body = errorBody.message.body;
        }

        return result;
    }

    private extractParameters(position: string): { direction: string; coord: Vec2 } {
        // Décomposer la position (ex: 'g15v)' en paramètres compréhensibles
        const DIRECTION_CHAR_POSITION = -1;
        const A_VALUE: number = 'a'.charCodeAt(0); // Pour avoir le code ASCII de a

        const direction: string = position.slice(DIRECTION_CHAR_POSITION);
        const line: number = position.charCodeAt(0) - A_VALUE;
        const column = Number(position.replace(/\D/g, '')) - 1; /* Enlève tous les caractères non numériques du string, puis le converti en nombre
        Pris sur:
        https://stackoverflow.com/questions/1862130/strip-all-non-numeric-characters-from-string-in-javascript
        */
        return { direction, coord: { y: line, x: column } };
    }
}
