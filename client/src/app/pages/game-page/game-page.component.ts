import { Component } from '@angular/core';
import { GridService } from '@app/services/grid.service';
import { RackSelectionService } from '@app/services/rack-selection.service';
import { RackService } from '@app/services/rack.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(public gridService: GridService, public rackSelectionService: RackSelectionService, public rackService: RackService) {}

    // @HostListener('window:keyup', ['$event'])
    // keyEvent(event: KeyboardEvent) {
    //     event.preventDefault();
    //     this.rackSelectionService.onKeyBoardClick(event, this.rackService.rackLetters);
    // }

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
