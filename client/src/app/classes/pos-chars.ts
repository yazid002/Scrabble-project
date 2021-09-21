import { Point } from './point';

export class PosChars {
    lettre?: string;
    position?: Point;
    constructor(lettre: string, position: Point) {
        this.lettre = lettre;
        this.position = position;
    }
}
