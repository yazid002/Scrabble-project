import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
// import { ICaracter } from '@app/models/lettre.model';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';

// TODO : Avoir un fichier séparé pour les constantes!
export const DEFAULT_WIDTH = 533;
export const DEFAULT_HEIGHT = 533;

// TODO : Déplacer ça dans un fichier séparé accessible par tous
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('rackCanvas', { static: false }) private rackCanvas!: ElementRef<HTMLCanvasElement>;

    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(private readonly gridService: GridService, private readonly rackService: RackService) {}
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
        // this.gridService.fillRackPortion(7, 7, { name: 'A', quantity: 9, points: 1, affiche: 'A' } as ICaracter);
        this.gridService.writeWordH('M', 7, 7);
        this.gridService.writeWordV('M', 4, 4);

        // eslint-disable-next-line no-console
        console.log(this.buttonPressed);
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
        this.rackService.rackContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.rackService.fillRack();

        this.rackCanvas.nativeElement.focus();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    // TODO : déplacer ceci dans un service de gestion de la souris!
    mouseHitDetect(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
        }
    }
}
