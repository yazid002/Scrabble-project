import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { PLAYER } from '@app/classes/player';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/play-area-constants';
import { SelectionType } from '@app/enums/selection-enum';
import { PassExecutionService } from '@app/services/command-execution/pass-execution.service';
import { ExchangeService } from '@app/services/exchange.service';
import { GameService } from '@app/services/game.service';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { RandomModeService } from '@app/services/random-mode.service';
import { SelectionManagerService } from '@app/services/selection-manager.service';
@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('rackCanvas', { static: false }) private rackCanvas!: ElementRef<HTMLCanvasElement>;
    // @ViewChild('logoCanvas', { static: false }) private logoCanvas!: ElementRef<HTMLCanvasElement>;

    player = PLAYER;
    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private readonly rackService: RackService,
        public exchangeService: ExchangeService, //   private commandExecutionService: CommandExecutionService,
        public selectionManager: SelectionManagerService,
        public randomMode: RandomModeService,
        public gameService: GameService,
        private passExecutionService: PassExecutionService,
    ) {}

    @HostListener('click', ['$event'])
    onLeftClick(event: MouseEvent) {
        if (event.target === this.gridCanvas.nativeElement) {
            this.selectionManager.updateSelectionType(SelectionType.Grid);
        } else if (event.target === this.rackCanvas.nativeElement) {
            this.selectionManager.updateSelectionType(SelectionType.Rack);
        } else {
            this.selectionManager.updateSelectionType(SelectionType.None);
        }
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
        if (event.target === this.rackCanvas.nativeElement) {
            this.selectionManager.updateSelectionType(SelectionType.Rack);
        } else {
            this.selectionManager.updateSelectionType(SelectionType.None);
        }
    }

    ngAfterViewInit(): void {
        const min = 0;
        const max = 3;
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
        this.rackService.rackContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.rackService.displayRack();

        this.rackCanvas.nativeElement.focus();
        this.randomMode.randomizeBonus(min, max);
    }

    get selectionType(): typeof SelectionType {
        return SelectionType;
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
