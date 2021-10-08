import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/play-area-constants';
import { GridService } from '@app/services/grid.service';
import { RackSelectionService } from '@app/services/rack-selection.service';
import { RackService } from '@app/services/rack.service';
import { TileSelectionService } from '@app/services/tile-selection.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('rackCanvas', { static: false }) private rackCanvas!: ElementRef<HTMLCanvasElement>;

    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private readonly rackService: RackService,
        private tileSelectionService: TileSelectionService,
        public rackSelectionService: RackSelectionService,
    ) {}

    @HostListener('keyup', ['$event'])
    onKeyBoardClick(event: KeyboardEvent) {
        console.log(event);
        event.preventDefault();
        this.rackSelectionService.onKeyBoardClick(event, this.rackService.rackLetters);
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
        this.rackService.rackContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.rackService.fillRack();

        this.rackCanvas.nativeElement.focus();
    }

    onGridClick(event: MouseEvent) {
        event.preventDefault();

        this.tileSelectionService.onTileClick(event);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
