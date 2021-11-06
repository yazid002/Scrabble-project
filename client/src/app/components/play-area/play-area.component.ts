import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PLAYER } from '@app/classes/player';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/play-area-constants';
import { PassExecutionService } from '@app/services/command-execution/pass-execution.service';
import { GameService } from '@app/services/game.service';
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
    player = PLAYER;
    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private readonly rackService: RackService,
        private passExecutionService: PassExecutionService,
        public gameService: GameService,
    ) {}

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
        this.rackService.rackContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.rackService.displayRack();

        this.rackCanvas.nativeElement.focus();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    skipTurn(): void {
        this.passExecutionService.execute();
    }
}
