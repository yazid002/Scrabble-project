import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { Vec2 } from '@app/classes/vec2';
import { GridService } from '@app/services/grid.service';
import { PlaceService } from '@app/services/place.service';

// const BOARD_WIDTH = 15;
// const BOARD_HEIGHT = 15;

@Injectable({
    providedIn: 'root',
})
export class PlaceExecutionService {
    constructor(public grid: GridService, private placeService: PlaceService) {}

    async execute(parameters: string[]): Promise<IChat> {
        const POSITION_INDEX = 1;
        const WORD_INDEX = 2;

        const result: IChat = {
            from: SENDER.computer,
            body: 'Placement de lettres réussi !',
        };

        const position: string = parameters[POSITION_INDEX];

        // TODO Commenté car les vérifications sont faites dans le pattern dans le fichier command-execution.service.ts
        //   this.checkPlacementPosition(position, result);

        const word: string = parameters[WORD_INDEX];

        // TODO Commenté car les vérifications sont faites dans le pattern dans le fichier command-execution.service.ts
        // this.checkWordValidity(word, result);

        const extractedParameters = this.extractParameters(position);

        const errorBody = (await this.placeService.placeWord(word, extractedParameters.coord, extractedParameters.direction).catch((error: Error) => {
            return error.message;
        })) as string;

        if (errorBody) {
            result.body = errorBody;
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
        return { direction, coord: { x: line, y: column } };
    }

    // TODO Commenté car les vérifications sont faites dans le pattern dans le fichier command-execution.service.ts
    // private checkPlacementPosition(position: string, result: IChat): IChat {
    //     const VERTICAL = 'v';
    //     const HORIZONTAL = 'h';

    //     const parameters = this.extractParameters(position);

    //     const direction = parameters.direction;
    //     const line = parameters.coord.x;
    //     const column = parameters.coord.y;

    //     // Vérifier si les entrées sont valides
    //     if (line > BOARD_HEIGHT || column > BOARD_WIDTH || line < 0 || column < 0) {
    //         throw new CommandSyntaxError("Line index must be between 1 and 15. Column index must be between 'a' and .'o'");
    //     }
    //     if (direction !== VERTICAL && direction !== HORIZONTAL) {
    //         throw new CommandSyntaxError("word direction must be horizontal 'h' of vertical 'v'");
    //     }
    //     return result;
    // }

    // TODO Commenté car les vérifications sont faites dans le pattern dans le fichier command-execution.service.ts
    // private checkWordValidity(word: string, result: IChat): IChat {
    //     if (word.length > BOARD_HEIGHT || word.length > BOARD_WIDTH) {
    //         throw new CommandSyntaxError(
    //             `Word is ${word.length} letters long, but maximum allowed length is ${Math.max(BOARD_HEIGHT, BOARD_WIDTH)} letters`,
    //         );
    //     }

    //     return result;
    // }
}
