import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/play-area-constants';
import { ExchangeService } from '@app/services/exchange.service';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) gridCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('rackCanvas', { static: false }) rackCanvas!: ElementRef<HTMLCanvasElement>;

    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private readonly rackService: RackService,
        public exchangeService: ExchangeService, //   private commandExecutionService: CommandExecutionService,
    ) {}

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
        this.rackService.rackContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.rackService.displayRack();

        this.rackCanvas.nativeElement.focus();
    }

    // onRackRightClick(event: MouseEvent) {
    //     console.log('{ x, y} :', event.offsetX, event.offsetY, event.target);
    //     console.log(event.target === this.rackCanvas.nativeElement);

    //     event.preventDefault();

    //     this.exchangeService.onMouseRightClick(event, this.rackService.rackLetters);
    // }(contextmenu)="onRackRightClick($event)"

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
