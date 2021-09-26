import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/play-area-constants';
import { MouseButton } from '@app/enums/mouse-enums';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';

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
