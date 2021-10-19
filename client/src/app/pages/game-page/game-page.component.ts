import { Component, HostListener } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { GridService } from '@app/services/grid.service';
import { PlaceSelectionService } from '@app/services/place-selection.service';
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
        private placeSelectionService: PlaceSelectionService, //  private readonly rackService: RackService,
    ) {
        console.log(this.gameService);
        console.log(this.virtualPlayerService);
    }

    @HostListener('keyup', ['$event'])
    onKeyBoardClick(event: KeyboardEvent) {
        //   this.placeSelectionService.getClickIndex(event, this.gameService.players[0].rack);
        //  this.placeSelectionService.getClickCoords(event);
        this.placeSelectionService.onKeyBoardClick(event, this.gameService.players[0].rack);
    }

    @HostListener('click', ['$event'])
    onLeftClick(event: MouseEvent) {
        this.placeSelectionService.onBoardClick(event);

        // this.placeSelectionService.getClickIndex(event, this.gameService.players[0].rack);
        // this.placeSelectionService.getClickCoords(event);
        //  this.placeSelectionService.getIndexFromKey(event, this.gameService.players[0].rack);
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
