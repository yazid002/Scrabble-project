import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Vec2 } from '@app/classes/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;
const SQUARE_NUMBER = 15;
const SQUARE_WIDTH = DEFAULT_WIDTH / SQUARE_NUMBER;
const SQUARE_HEIGHT = DEFAULT_HEIGHT / SQUARE_NUMBER;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;

    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;

        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                this.gridContext.moveTo(SQUARE_WIDTH * x, SQUARE_HEIGHT * y);
                this.gridContext.lineTo(SQUARE_WIDTH * x, DEFAULT_HEIGHT);
            }
        }

        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                this.gridContext.moveTo(SQUARE_WIDTH * x, SQUARE_HEIGHT * y);
                this.gridContext.lineTo(DEFAULT_WIDTH, SQUARE_HEIGHT * y);
            }
        }

        this.gridContext.stroke();
    }

    fillSquare() {
        this.gridContext.fillStyle = 'rgb(245, 241, 222)';
        this.gridContext.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                switch (tiles[y][x].bonus) {
                    case 'TW':
                        this.gridContext.fillStyle = 'rgba(200, 0, 0, 0.75)';
                        this.gridContext.fillRect(SQUARE_WIDTH * x, SQUARE_HEIGHT * y, SQUARE_WIDTH, SQUARE_HEIGHT);
                        this.gridContext.fillStyle = 'rgb(200,200,200)';
                        this.gridContext.font = '10px serif';
                        this.gridContext.fillText('Triple', (DEFAULT_WIDTH / SQUARE_NUMBER) * x + 5, (DEFAULT_HEIGHT / SQUARE_NUMBER) * y + 12);
                        this.gridContext.fillText('Word', (DEFAULT_WIDTH / SQUARE_NUMBER) * x + 5, (DEFAULT_HEIGHT / SQUARE_NUMBER) * y + 25);
                        break;
                    case 'DL':
                        this.gridContext.fillStyle = 'rgba(0, 0, 200, 0.45)';
                        this.gridContext.fillRect(SQUARE_WIDTH * x, SQUARE_HEIGHT * y, SQUARE_WIDTH, SQUARE_HEIGHT);
                        this.gridContext.fillStyle = 'rgb(200,200,200)';
                        this.gridContext.font = '15px serif';
                        this.gridContext.fillText('DL', (DEFAULT_WIDTH / SQUARE_NUMBER) * x + 7, (DEFAULT_HEIGHT / SQUARE_NUMBER) * y + 22);
                        break;
                    case 'DW':
                        this.gridContext.fillStyle = 'rgba(0, 0, 200, 0.75)';
                        this.gridContext.fillRect(SQUARE_WIDTH * x, SQUARE_HEIGHT * y, SQUARE_WIDTH, SQUARE_HEIGHT);
                        this.gridContext.fillStyle = 'rgb(200,200,200)';
                        this.gridContext.font = '15px serif';
                        this.gridContext.fillText('DW', (DEFAULT_WIDTH / SQUARE_NUMBER) * x + 5, (DEFAULT_HEIGHT / SQUARE_NUMBER) * y + 22);
                        break;
                    case 'TL':
                        this.gridContext.fillStyle = 'rgba(200, 0, 0, 0.45)';
                        this.gridContext.fillRect(SQUARE_WIDTH * x, SQUARE_HEIGHT * y, SQUARE_WIDTH, SQUARE_HEIGHT);
                        this.gridContext.fillStyle = 'rgb(200,200,200)';
                        this.gridContext.font = '15px serif';
                        this.gridContext.fillText('TL', (DEFAULT_WIDTH / SQUARE_NUMBER) * x + 7, (DEFAULT_HEIGHT / SQUARE_NUMBER) * y + 20);
                        break;
                    default:
                        break;
                }
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

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
