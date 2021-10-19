import { Component } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { GridService } from '@app/services/grid.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    // TODO verifier si les services en parametre sont utilises ou doivent en private
    constructor(public gridService: GridService, public gameService: GameService, public virtualPlayerService: VirtualPlayerService) {
        // TODO a enlever
        // console.log(this.gameService);
        // console.log(this.virtualPlayerService);
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
