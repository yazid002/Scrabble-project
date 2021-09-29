import { Point } from './point';

export class PosChars {
    letter?: string;
    position?: Point;
    constructor(letter: string, position: Point) {
        this.letter = letter;
        this.position = position;
    }
}
