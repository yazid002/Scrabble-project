import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Vec2 } from '@app/classes/vec2';
import { ICaracter } from '@app/models/lettre.model';
import { ReserveService } from './reserve.service';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;
const SQUARE_NUMBER = 15;
const SQUARE_WIDTH = DEFAULT_WIDTH / SQUARE_NUMBER;
const SQUARE_HEIGHT = DEFAULT_HEIGHT / SQUARE_NUMBER;
const TW_COLOR = 'rgba(200, 0, 0, 0.75)';
const DL_COLOR = 'rgba(0, 0, 200, 0.45)';
const DW_COLOR = 'rgba(0, 0, 200, 0.75)';
const TL_COLOR = 'rgba(200, 0, 0, 0.45)';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;

    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(public res: ReserveService) {}

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */

    fillGrid(xPos: number, yPos: number, text: string): void {
        this.gridContext.fillRect(xPos * SQUARE_WIDTH, yPos * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
        this.gridContext.fillStyle = 'rgb(200,200,200)';
        this.gridContext.font = '15px serif';
        this.gridContext.strokeText(text, SQUARE_WIDTH * xPos + 7, SQUARE_HEIGHT * yPos + 22);
    }

    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 1;
        this.gridContext.fillStyle = 'rgb(245, 241, 222)';
        this.gridContext.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                switch (tiles[y][x].bonus) {
                    case 'TW':
                        this.gridContext.fillStyle = TW_COLOR;
                        this.fillGrid(x, y, 'TW');
                        break;
                    case 'DL':
                        this.gridContext.fillStyle = DL_COLOR;
                        this.fillGrid(x, y, 'DL');

                        break;
                    case 'DW':
                        this.gridContext.fillStyle = DW_COLOR;
                        this.fillGrid(x, y, 'DW');

                        break;
                    case 'TL':
                        this.gridContext.fillStyle = TL_COLOR;
                        this.fillGrid(x, y, 'TL');

                        break;
                    default:
                        break;
                }
                this.gridContext.strokeRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
            }
        }
        this.gridContext.fillStyle = 'rgb(0,0,0)';
        this.gridContext.font = '30px serif';
        this.gridContext.fillText(tiles[0][0].letter, (DEFAULT_WIDTH / SQUARE_NUMBER) * 0 + 5, (DEFAULT_HEIGHT / SQUARE_NUMBER) * 0 + 25);
    }

    drawWord(word: string) {
        const startPosition: Vec2 = { x: 175, y: 100 };

        const step = 20;
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }

    fillRackPortion(line: number, colone: number, letter: ICaracter) {
        this.gridContext.clearRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * line,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * colone,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.gridContext.fillText(letter.affiche, (DEFAULT_WIDTH / SQUARE_NUMBER) * line + 6, (DEFAULT_WIDTH / SQUARE_NUMBER) * (colone + 1) - 3.33);
        this.gridContext.stroke();

        // this.gridContext.rect(33.33 * 4, 33.33 * 0, 33.33, 33.33);

        this.gridContext.stroke();
        this.gridContext.fillStyle = 'rgb(0,0,0)';
        this.gridContext.font = '30px serif';

        console.log(letter.affiche);
        console.log(line, colone);

        // this.gridContext.font = '10px serif';

        // tiles[colone][line].letter = letter.affiche;
    }

    WriteWordH(word: string, x: number, y: number) {
        // maison

        for (let i = 0; i < word.length; i++) {
            const caractere = this.res.findLetter(word[i]);
            this.fillRackPortion(x + i, y, caractere);
        }
    }

    WriteWordV(word: string, x: number, y: number) {
        // maison

        for (let i = 0; i < word.length; i++) {
            const caractere = this.res.findLetter(word[i]);
            this.fillRackPortion(x , y+i, caractere);
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
