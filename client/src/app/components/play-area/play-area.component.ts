import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/play-area-constants';
import { SelectionType } from '@app/enums/selection-enum';
import { ExchangeService } from '@app/services/exchange.service';
import { GridService } from '@app/services/grid.service';
import { RackService } from '@app/services/rack.service';
import { SelectionManagerService } from '@app/services/selection-manager.service';
@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) gridCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('rackCanvas', { static: false }) rackCanvas!: ElementRef<HTMLCanvasElement>;
    // selectionType: typeof SelectionType;

    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private readonly rackService: RackService,
        public exchangeService: ExchangeService, //   private commandExecutionService: CommandExecutionService,
        public selectionManager: SelectionManagerService,
    ) {}
    @HostListener('click', ['$event'])
    onLeftClick(event: MouseEvent) {
        if (event.target === this.gridCanvas.nativeElement) {
            this.selectionManager.getSelectionType(SelectionType.Grid);
        } else if (event.target === this.rackCanvas.nativeElement) {
            this.selectionManager.getSelectionType(SelectionType.Rack);
            console.log('play ', this.selectionManager.selectionType);
        } else {
            this.selectionManager.getSelectionType(SelectionType.None);
        }
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
        if (event.target === this.rackCanvas.nativeElement) {
            this.selectionManager.getSelectionType(SelectionType.Rack);
            console.log('play ', this.selectionManager.selectionType);
        } else {
            this.selectionManager.getSelectionType(SelectionType.None);
        }
    }

    // (click)="this.selectionManager.getSelectionType(selectionType.Rack)"
    //      (click)="this.selectionManager.getSelectionType(selectionType.Grid)"
    ngAfterViewInit(): void {
        const min = 0;
        const max = 3;
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
        this.rackService.rackContext = this.rackCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.rackService.displayRack();

        this.rackCanvas.nativeElement.focus();
        this.gridService.randomizeBonus(min, max);
    }

    // onRackRightClick(event: MouseEvent) {
    //     console.log('{ x, y} :', event.offsetX, event.offsetY, event.target);
    //     console.log(event.target === this.rackCanvas.nativeElement);

    //     event.preventDefault();

    //     this.exchangeService.onMouseRightClick(event, this.rackService.rackLetters);
    // }(contextmenu)="onRackRightClick($event)"
    get selectionType(): typeof SelectionType {
        return SelectionType;
    }
    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
