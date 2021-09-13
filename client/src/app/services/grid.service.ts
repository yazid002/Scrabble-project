import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;

    tiles: string[][] = [
        ['TW', 'xx', 'xx', 'DL', 'xx', 'xx', 'xx', 'TW', 'xx', 'xx', 'xx', 'DL', 'xx', 'xx', 'TW'],
        ['xx', 'DW', 'xx', 'xx', 'xx', 'TL', 'xx', 'xx', 'xx', 'TL', 'xx', 'xx', 'xx', 'DW', 'xx'],
        ['xx', 'xx', 'DW', 'xx', 'xx', 'xx', 'DL', 'xx', 'DL', 'xx', 'xx', 'xx', 'DW', 'xx', 'xx'],
        ['DL', 'xx', 'xx', 'DW', 'xx', 'xx', 'xx', 'DL', 'xx', 'xx', 'xx', 'DW', 'xx', 'xx', 'DL'],
        ['xx', 'xx', 'xx', 'xx', 'DW', 'xx', 'xx', 'xx', 'xx', 'xx', 'DW', 'xx', 'xx', 'xx', 'xx'],
        ['xx', 'TL', 'xx', 'xx', 'xx', 'TL', 'xx', 'xx', 'xx', 'TL', 'xx', 'xx', 'xx', 'TL', 'xx'],
        ['xx', 'xx', 'DL', 'xx', 'xx', 'xx', 'DL', 'xx', 'DL', 'xx', 'xx', 'xx', 'DL', 'xx', 'xx'],
        ['TW', 'xx', 'xx', 'DL', 'xx', 'xx', 'xx', 'DW', 'xx', 'xx', 'xx', 'DL', 'xx', 'xx', 'TW'],
        ['xx', 'xx', 'DL', 'xx', 'xx', 'xx', 'DL', 'xx', 'DL', 'xx', 'xx', 'xx', 'DL', 'xx', 'xx'],
        ['xx', 'TL', 'xx', 'xx', 'xx', 'TL', 'xx', 'xx', 'xx', 'TL', 'xx', 'xx', 'xx', 'TL', 'xx'],
        ['xx', 'xx', 'xx', 'xx', 'DW', 'xx', 'xx', 'xx', 'xx', 'xx', 'DW', 'xx', 'xx', 'xx', 'xx'],
        ['DL', 'xx', 'xx', 'DW', 'xx', 'xx', 'xx', 'DL', 'xx', 'xx', 'xx', 'DW', 'xx', 'xx', 'DL'],
        ['xx', 'xx', 'DW', 'xx', 'xx', 'xx', 'DL', 'xx', 'DL', 'xx', 'xx', 'xx', 'DW', 'xx', 'xx'],
        ['xx', 'DW', 'xx', 'xx', 'xx', 'TL', 'xx', 'xx', 'xx', 'TL', 'xx', 'xx', 'xx', 'DW', 'xx'],
        ['TW', 'xx', 'xx', 'DL', 'xx', 'xx', 'xx', 'TW', 'xx', 'xx', 'xx', 'DL', 'xx', 'xx', 'TW'],
    ];

    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;

        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                this.gridContext.moveTo((DEFAULT_WIDTH / 15) * x, (DEFAULT_HEIGHT / 15) * y);
                this.gridContext.lineTo((DEFAULT_WIDTH / 15) * x, DEFAULT_HEIGHT);
            }
        }

        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 16; y++) {
                this.gridContext.moveTo((DEFAULT_WIDTH / 15) * x, (DEFAULT_HEIGHT / 15) * y);
                this.gridContext.lineTo(DEFAULT_WIDTH, (DEFAULT_HEIGHT / 15) * y);
            }
        }

        // this.gridContext.fillStyle = 'rgba(200, 0, 0, 0.5)';
        // this.gridContext.fillRect((DEFAULT_WIDTH / 15) * 0, (DEFAULT_HEIGHT / 15) * 0, (DEFAULT_WIDTH / 15) * 1, (DEFAULT_HEIGHT / 15) * 1);

        // this.gridContext.fillStyle = 'rgb(200,200,200)';
        // this.gridContext.font = '15px serif';
        // this.gridContext.fillText('TW', 5, 20);

        // this.gridContext.fillStyle = 'rgba(0, 0, 200, 0.5)';
        // this.gridContext.fillRect((DEFAULT_WIDTH / 15) * 3, (DEFAULT_HEIGHT / 15) * 0, (DEFAULT_WIDTH / 15) * 1, (DEFAULT_HEIGHT / 15) * 1);

        // this.gridContext.fillStyle = 'rgb(200,200,200)';
        // this.gridContext.font = '15px serif';
        // this.gridContext.fillText('DL', 107, 20);

        // this.gridContext.moveTo((this.width * 3) / 10, (this.height * 4) / 10);
        // this.gridContext.lineTo((this.width * 7) / 10, (this.height * 4) / 10);

        // this.gridContext.moveTo((this.width * 3) / 10, (this.height * 6) / 10);
        // this.gridContext.lineTo((this.width * 7) / 10, (this.height * 6) / 10);

        // this.gridContext.moveTo((this.width * 4) / 10, (this.height * 3) / 10);
        // this.gridContext.lineTo((this.width * 4) / 10, (this.height * 7) / 10);

        // this.gridContext.moveTo((this.width * 6) / 10, (this.height * 3) / 10);
        // this.gridContext.lineTo((this.width * 6) / 10, (this.height * 7) / 10);

        this.gridContext.stroke();
    }

    fillSquare() {
        this.gridContext.fillStyle = 'rgb(245, 241, 222)';
        this.gridContext.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        for (let x = 0; x < 15; x++) {
            for (let y = 0; y < 15; y++) {
                switch (this.tiles[x][y]) {
                    case 'TW':
                        this.gridContext.fillStyle = 'rgba(200, 0, 0, 0.75)';
                        this.gridContext.fillRect((DEFAULT_WIDTH / 15) * x, (DEFAULT_HEIGHT / 15) * y, DEFAULT_WIDTH / 15, DEFAULT_HEIGHT / 15);
                        this.gridContext.fillStyle = 'rgb(200,200,200)';
                        this.gridContext.font = '15px serif';
                        this.gridContext.fillText('TW', (DEFAULT_WIDTH / 15) * x + 5, (DEFAULT_HEIGHT / 15) * y + 20);
                        break;
                    case 'DL':
                        this.gridContext.fillStyle = 'rgba(0, 0, 200, 0.45)';
                        this.gridContext.fillRect((DEFAULT_WIDTH / 15) * x, (DEFAULT_HEIGHT / 15) * y, DEFAULT_WIDTH / 15, DEFAULT_HEIGHT / 15);
                        this.gridContext.fillStyle = 'rgb(200,200,200)';
                        this.gridContext.font = '15px serif';
                        this.gridContext.fillText('DL', (DEFAULT_WIDTH / 15) * x + 7, (DEFAULT_HEIGHT / 15) * y + 22);
                        break;
                    case 'DW':
                        this.gridContext.fillStyle = 'rgba(0, 0, 200, 0.75)';
                        this.gridContext.fillRect((DEFAULT_WIDTH / 15) * x, (DEFAULT_HEIGHT / 15) * y, DEFAULT_WIDTH / 15, DEFAULT_HEIGHT / 15);
                        this.gridContext.fillStyle = 'rgb(200,200,200)';
                        this.gridContext.font = '15px serif';
                        this.gridContext.fillText('DW', (DEFAULT_WIDTH / 15) * x + 5, (DEFAULT_HEIGHT / 15) * y + 22);
                        break;
                    case 'TL':
                        this.gridContext.fillStyle = 'rgba(200, 0, 0, 0.45)';
                        this.gridContext.fillRect((DEFAULT_WIDTH / 15) * x, (DEFAULT_HEIGHT / 15) * y, DEFAULT_WIDTH / 15, DEFAULT_HEIGHT / 15);
                        this.gridContext.fillStyle = 'rgb(200,200,200)';
                        this.gridContext.font = '15px serif';
                        this.gridContext.fillText('TL', (DEFAULT_WIDTH / 15) * x + 7, (DEFAULT_HEIGHT / 15) * y + 20);
                        break;
                    default:
                        break;
                }
            }
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

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
