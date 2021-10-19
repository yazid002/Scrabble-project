import { Component } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { GridService } from '@app/services/grid.service';
import { RoomService } from '@app/services/room.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(
        public gridService: GridService,
        private gameService: GameService,
        private virtualPlayerService: VirtualPlayerService,
        private roomService: RoomService,
    ) {
        console.log(this.gameService);
        console.log(this.virtualPlayerService);
        console.log(this.roomService);
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
