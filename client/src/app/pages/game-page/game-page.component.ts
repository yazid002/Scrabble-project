import { Component } from '@angular/core';
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
        private roomService: RoomService,
        private gameSyncService: GameSyncService,
    ) {
        console.log(this.virtualPlayerService);
        console.log(this.roomService);
        console.log(this.gameSyncService);
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
    // TODO enlever goInRoom une fois que le loby est intégré et créé les salles pour nous
    goInRoom() {
        let temp: string = 'Vous avez ';
        if (this.isMaster) {
            this.roomService.createRoom(this.roomName);
            temp += 'créé la salle ';
        } else {
            this.roomService.joinRoom(this.roomName);
            temp += 'join la salle ';
        }
        this.roomName = temp + this.roomName;
    }
}
