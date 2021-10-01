import { Component } from '@angular/core';
import { GridService } from '@app/services/grid.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(public gridService: GridService) {}

    increaseSize(): void {
        this.gridService.increaseTileSize(1, 1, 22);
    }

    decreaseSize() {
        this.gridService.decreaseTileSize(-1, -1, 13);
    }
}
