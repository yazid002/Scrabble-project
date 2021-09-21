import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { InexistentLettersOnRack } from '@app/classes/command-errors/exchange-errors/inexistent-letters-on-rack';
import { Vec2 } from '@app/classes/vec2';
import { ICaracter } from '@app/models/lettre.model';
// import { ReserveService } from './reserve.service';
import { RackService } from './rack.service';

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

    constructor(private rack: RackService) {}

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
        this.gridContext.fillStyle = '#FFE4C4';
        this.gridContext.fillRect(0, DEFAULT_WIDTH, SQUARE_HEIGHT * 16, SQUARE_WIDTH * 16);
        this.gridContext.fillRect(DEFAULT_HEIGHT, 0, SQUARE_HEIGHT * 16, SQUARE_WIDTH * 16);

        this.gridContext.fillStyle = 'rgb(0,0,0)';
        this.gridContext.font = '30px serif';

        for (let i = 0; i < 15; i++) {
            const pas = i + 1;
            const pas2 = i + 65;

            if (pas < 10) {
                // this.gridContext.fillStyle = '#FFF0F5';
                //     this.gridContext.fillRect(0, DEFAULT_WIDTH, SQUARE_HEIGHT * 16, SQUARE_WIDTH * 16);
                // this.gridContext.fillRect(DEFAULT_HEIGHT, 0, SQUARE_HEIGHT * 16, SQUARE_WIDTH * 16);
                this.gridContext.fillText(pas.toString(), SQUARE_WIDTH * i + 10, SQUARE_HEIGHT * 16 - 6);
            } else {
                this.gridContext.fillText(pas.toString(), SQUARE_WIDTH * i, SQUARE_HEIGHT * 16 - 6);
            }
            this.gridContext.fillText(String.fromCharCode(pas2), SQUARE_WIDTH * 15 + 5, SQUARE_HEIGHT * i + 28);
        }
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
            (DEFAULT_WIDTH / SQUARE_NUMBER) * (colone - 1),
            (DEFAULT_WIDTH / SQUARE_NUMBER) * line,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.gridContext.fillText(
            letter.affiche,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * (colone - 1) + 6,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * (line + 1) - 3.33,
        );
        this.gridContext.stroke();

        // this.gridContext.rect(33.33 * 4, 33.33 * 0, 33.33, 33.33);

        this.gridContext.stroke();
        this.gridContext.fillStyle = 'rgb(0,0,0)';
        this.gridContext.font = '30px serif';

        // eslint-disable-next-line no-console
        // eslint-disable-next-line no-console

        // this.gridContext.font = '10px serif';

        // tiles[colone][line].letter = letter.affiche;
    }

    placeWord(word: string, positions: string, x: number, y: number) {
        this.validatePlaceFeasibility(word);
        if (positions === 'h') {
            this.writeWordH(word, x, y);
        } else {
            this.writeWordV(word, x, y);
        }

        this.rack.replaceWord(word);
    }

    writeWordH(word: string, x: number, y: number) {
        // maison

        for (let i = 0; i < word.length; i++) {
            const character = this.rack.findLetter(word[i]) as ICaracter;
            this.fillRackPortion(x, y + i, character);
        }
        // this.rack.replaceWord(word);
    }

    writeWordV(word: string, x: number, y: number) {
        // maison

        for (let i = 0; i < word.length; i++) {
            const character = this.rack.findLetter(word[i]) as ICaracter;
            this.fillRackPortion(x + i, y, character);
        }
        // this.rack.replaceWord(word);
    }

    private validatePlaceFeasibility(word: string): void {
        const wordToChange = word.split('');
        const inexistentLettersOnRack: string[] = this.rack.findInexistentLettersOnRack(wordToChange);
        if (inexistentLettersOnRack.length) {
            throw new InexistentLettersOnRack(`${inexistentLettersOnRack.join(', ')}.`);
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
