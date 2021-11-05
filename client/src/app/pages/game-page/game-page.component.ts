import { Component } from '@angular/core';
// import { QuitConfirmationDialogComponent } from '@app/components/quit-confirmation-dialog/quit-confirmation-dialog.component';
import { GameSyncService } from '@app/services/game-sync.service';
import { GridService } from '@app/services/grid.service';
import { RoomService } from '@app/services/room.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    // TODO verifier si les services en parametre sont utilises ou doivent en private
    // TODO enlever le roomName et isMaster une fois que le loby est intégré et créé les salles pour nous
    roomName: string = '';
    isMaster: boolean = false;

    constructor(
        public gridService: GridService,

        private virtualPlayerService: VirtualPlayerService,
        public roomService: RoomService,
        private gameSyncService: GameSyncService, // private gameService: GameService, // public matDialog: MatDialog,
    ) {
        this.virtualPlayerService.initialize();
        this.gameSyncService.initialize();
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
