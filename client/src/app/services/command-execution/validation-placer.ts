const NUM_PARAMETERS = 3; // parameters should have format ['placer',position, word]
const POSITION_INDEX = 1;
const WORD_INDEX = 2;
const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 15;

const VERTICAL = 'v';
const HORIZONTAL = 'h';

const DIRECTION_CHAR_POSITION = -1;
export const place = (parameters: string[]): boolean => {
    if (parameters.length !== NUM_PARAMETERS) {
        return false;
    }
    const position: string = parameters[POSITION_INDEX];
    const word: string = parameters[WORD_INDEX];

    // Decomposer la position (ex: 'g15v)' en paramètres compréhensible
    const valeurA: number = 'a'.charCodeAt(0);
    const ligne: number = position.charCodeAt(0) - valeurA;

    const colone = Number(position.replace(/\d/g, '')); /* Removes all non numeric characters from string, then converts is to a number
        Taken from: 
        https://stackoverflow.com/questions/10003683/how-can-i-extract-a-number-from-a-string-in-javascript
        */
    
    const direction: string = position.slice(DIRECTION_CHAR_POSITION);

    // Vérifier si les entrées sont valides
    if (ligne >= BOARD_HEIGHT || colone >= BOARD_WIDTH ||
        ligne < 0 || colone < 10) {
        return false;
    }
    if (direction !== VERTICAL && direction !== HORIZONTAL) {
        return false;
    }
    if (word.length >= Math.min(BOARD_HEIGHT, BOARD_WIDTH)) {
        return false;
    }
    // À ce point, on devrait appeler la fonction
    return true;
};
