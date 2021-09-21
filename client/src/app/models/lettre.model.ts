// eslint-disable-next-line max-classes-per-file
export interface IParams {
    quantity: number;
    points: number;
    affiche: string;
}
export interface ICaracter {
    name: string;
    params: IParams;
}
export class Point {
    row: number;
    column: number;
    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
    }
}
export enum Direction {
    BOTTOM,
    RIGHT,
}

export class PosChars {
    lettre?: string;
    position?: Point;
    constructor(lettre: string, position: Point) {
        this.lettre = lettre;
        this.position = position;
    }
}
