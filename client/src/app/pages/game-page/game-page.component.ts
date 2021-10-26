import { Component, ViewChild } from '@angular/core';
import { ChatboxComponent } from '@app/components/chatbox/chatbox.component';
import { GridService } from '@app/services/grid.service';
import { RackSelectionService } from '@app/services/rack-selection.service';
import { RackService } from '@app/services/rack.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    @ViewChild(ChatboxComponent) chatboxComponent: ChatboxComponent;

    command: string = '';

    constructor(
        public gridService: GridService,
        public rackSelectionService: RackSelectionService,
        public rackService: RackService, //  private tileSelectionService: TileSelectionService,
    ) {}

    // @HostListener('window:keyup', ['$event'])
    // keyEvent(event: KeyboardEvent) {
    //     event.preventDefault();
    //     this.rackSelectionService.onKeyBoardClick(event, this.rackService.rackLetters);
    // }

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
}
