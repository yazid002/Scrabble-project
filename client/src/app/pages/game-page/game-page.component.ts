import { Component, HostListener, ViewChild } from '@angular/core';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { GridService } from '@app/services/grid.service';
import { RackSelectionService } from '@app/services/rack-selection.service';
import { RackService } from '@app/services/rack.service';
import { TileSelectionService } from '@app/services/tile-selection.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    @ViewChild(ChatboxComponent) chatboxComponent: ChatboxComponent;
    @ViewChild(PlayAreaComponent) playAreaComponent: PlayAreaComponent;

    command: string = '';
    receptor: HTMLElement;

    constructor(
        public gridService: GridService,
        public rackSelectionService: RackSelectionService,
        public rackService: RackService,
        private tileSelectionService: TileSelectionService,
    ) {}

    @HostListener('keyup', ['$event'])
    onKeyBoardClick(event: KeyboardEvent) {
        event.preventDefault();
        console.log('{ x, y} :', event.target);
        console.log('this.playArea.nativeElement : ', this.playAreaComponent.gridCanvas.nativeElement);

        if (event.key === 'Enter') {
            if (!this.disablePlacement()) {
                this.onSubmitPlacement();
            }
        } else if (this.receptor === this.playAreaComponent.gridCanvas.nativeElement) {
            this.rackSelectionService.onKeyBoardClick(event, this.rackService.rackLetters, false);
        }
    }

    @HostListener('click', ['$event'])
    onGridClick(event: MouseEvent) {
        event.preventDefault();
        console.log('{ x, y} :', event.target);
        console.log('this.playArea.nativeElement : ', this.playAreaComponent.gridCanvas.nativeElement);
        if (event.target !== this.playAreaComponent.gridCanvas.nativeElement) {
            this.receptor = {} as HTMLElement;
            this.rackSelectionService.cancelAllPlacement();
        } else {
            this.receptor = this.playAreaComponent.gridCanvas.nativeElement;
            this.tileSelectionService.onTileClick(event, true, this.rackSelectionService.selectedIndexesForPlacement);
        }
    }

    onSubmitPlacement() {
        this.command = this.rackSelectionService.buildPlacementCommand(this.rackService.rackLetters);
        console.log(this.command);
        this.chatboxComponent.inputBox = this.command;
        this.chatboxComponent.fromSelection = true;
        this.chatboxComponent.onSubmit();
    }

    disablePlacement() {
        return this.rackSelectionService.selectedIndexesForPlacement.length === 0;
    }

    onCancelPlacement() {
        this.rackSelectionService.cancelPlacement();
    }

    increaseSize(): void {
        const step = 1;
        const maxValue = 22;
        this.gridService.increaseTileSize(step, step, maxValue);
    }

    decreaseSize() {
        const step = -1;
        const maxValue = 13;
        this.gridService.decreaseTileSize(step, step, maxValue);
    }

    randomNumber() {
        this.gridService.randomizeBonus(0, 3);
    }
}
